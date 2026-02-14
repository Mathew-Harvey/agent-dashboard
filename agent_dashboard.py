#!/usr/bin/env python3
"""
OpenClaw Agent Dashboard
Shows: Active agents, LLMs in use, API costs
Run: python3 agent_dashboard.py
Then open http://localhost:5000 in your browser
"""

import subprocess
import json
import time
from datetime import datetime
from flask import Flask, render_template_string

app = Flask(__name__)

# Cost per 1M tokens (approximate)
LLM_COSTS = {
    "MiniMax-M2.5": {"input": 0.2, "output": 0.4},  # $ per 1M tokens
    "MiniMax-M2": {"input": 0.2, "output": 0.4},
    " Opus": {"input": 15.0, "output": 75.0},
    " Sonnet": {"input": 3.0, "output": 15.0},
    " Haiku": {"input": 0.2, "output": 1.0},
    "GPT-4": {"input": 10.0, "output": 30.0},
    "GPT-4o": {"input": 2.5, "output": 10.0},
    "GPT-4o-mini": {"input": 0.15, "output": 0.6},
    "claude-opus-4-6": {"input": 15.0, "output": 75.0},
    "claude-sonnet-4-5": {"input": 3.0, "output": 15.0},
    "claude-haiku-3": {"input": 0.2, "output": 1.0},
    "ollama/gpt-oss:20b": {"input": 0.0, "output": 0.0},  # Local, free
}

def get_openclaw_status():
    """Run openclaw status and parse output"""
    try:
        result = subprocess.run(
            ["openclaw", "status", "--all"],
            capture_output=True,
            text=True,
            timeout=10
        )
        return result.stdout, result.stderr
    except Exception as e:
        return "", str(e)

def parse_sessions(output):
    """Extract session info from openclaw status output"""
    sessions = []
    in_sessions = False
    
    for line in output.split('\n'):
        if 'Sessions' in line and 'Key' in line:
            in_sessions = True
            continue
        if in_sessions and line.strip().startswith('│'):
            parts = [p.strip() for p in line.split('│') if p.strip()]
            if len(parts) >= 4 and 'Key' not in parts[0]:
                sessions.append({
                    'key': parts[0],
                    'kind': parts[1],
                    'age': parts[2],
                    'model': parts[3],
                    'tokens': parts[4] if len(parts) > 4 else 'N/A'
                })
        elif in_sessions and not line.strip().startswith('│'):
            in_sessions = False
    
    return sessions

def parse_agents(output):
    """Extract agent info"""
    agents = []
    in_agents = False
    
    for line in output.split('\n'):
        if 'Agents' in line and '·' in line:
            # Parse line like: "Agents · 3 · 1 bootstrapping · sessions 1 · default bosun active 1m ago"
            parts = line.split('·')
            if len(parts) >= 2:
                agents_info = parts[1].strip().split()
                if agents_info:
                    agents.append({
                        'total': agents_info[0],
                        'status': ' '.join(agents_info[1:]) if len(agents_info) > 1 else 'unknown'
                    })
    
    return agents

def calculate_cost(sessions):
    """Estimate API costs based on session token usage"""
    total_cost = 0.0
    session_costs = []
    
    for session in sessions:
        model = session.get('model', 'Unknown')
        tokens_str = session.get('tokens', '0/0')
        
        # Parse tokens like "48k/205k (23%)"
        try:
            used_str = tokens_str.split('/')[0].replace('k', '000').replace('m', '000000')
            used = int(used_str)
        except:
            used = 0
        
        # Find cost
        cost_info = None
        for model_name, costs in LLM_COSTS.items():
            if model_name in model:
                cost_info = costs
                break
        
        if cost_info:
            # Assume 30% input, 70% output for estimation
            input_cost = (used * 0.3 / 1_000_000) * cost_info['input']
            output_cost = (used * 0.7 / 1_000_000) * cost_info['output']
            session_cost = input_cost + output_cost
        else:
            session_cost = 0.0
        
        total_cost += session_cost
        session_costs.append({
            'model': model,
            'tokens_used': used,
            'estimated_cost': session_cost
        })
    
    return total_cost, session_costs

HTML_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head>
    <title>OpenClaw Agent Dashboard</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0d1117;
            color: #c9d1d9;
            min-height: 100vh;
            padding: 20px;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 {
            color: #58a6ff;
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .subtitle { color: #8b949e; margin-bottom: 30px; }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .card {
            background: #161b22;
            border: 1px solid #30363d;
            border-radius: 8px;
            padding: 20px;
        }
        .card h2 {
            color: #58a6ff;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .stat {
            font-size: 36px;
            font-weight: bold;
            color: #3fb950;
        }
        .stat-label { font-size: 14px; color: #8b949e; }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            text-align: left;
            padding: 12px;
            border-bottom: 1px solid #30363d;
        }
        th { color: #8b949e; font-weight: normal; font-size: 12px; }
        .model-badge {
            background: #238636;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
        }
        .cost { color: #f0883e; font-weight: bold; }
        .pulse {
            display: inline-block;
            width: 8px;
            height: 8px;
            background: #3fb950;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        .last-updated { color: #8b949e; font-size: 12px; margin-top: 20px; }
    </style>
    <meta http-equiv="refresh" content="30">
</head>
<body>
    <div class="container">
        <h1>🤖 OpenClaw Dashboard</h1>
        <p class="subtitle">Agent monitoring & cost tracking</p>
        
        <div class="grid">
            <div class="card">
                <h2><span class="pulse"></span> Active Agents</h2>
                <div class="stat">{{ agents|length }}</div>
                <div class="stat-label">agents running</div>
            </div>
            <div class="card">
                <h2>🧠 Models In Use</h2>
                <div class="stat">{{ models|length }}</div>
                <div class="stat-label">unique models</div>
            </div>
            <div class="card">
                <h2>💰 API Cost (Est.)</h2>
                <div class="stat cost">${{ "%.4f"|format(total_cost) }}</div>
                <div class="stat-label">this session</div>
            </div>
        </div>
        
        <div class="card">
            <h2>📊 Active Sessions</h2>
            <table>
                <thead>
                    <tr>
                        <th>Session</th>
                        <th>Kind</th>
                        <th>Age</th>
                        <th>Model</th>
                        <th>Tokens</th>
                        <th>Est. Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {% for session in sessions %}
                    <tr>
                        <td>{{ session.key[:30] }}...</td>
                        <td>{{ session.kind }}</td>
                        <td>{{ session.age }}</td>
                        <td><span class="model-badge">{{ session.model }}</span></td>
                        <td>{{ session.tokens }}</td>
                        <td class="cost">${{ "%.4f"|format(session_costs[loop.index0].estimated_cost) }}</td>
                    </tr>
                    {% endfor %}
                </tbody>
            </table>
        </div>
        
        <div class="last-updated">
            Last updated: {{ last_updated }}
        </div>
    </div>
</body>
</html>
'''

@app.route('/')
def index():
    stdout, stderr = get_openclaw_status()
    sessions = parse_sessions(stdout)
    agents = parse_agents(stdout)
    
    # Get unique models
    models = list(set(s.get('model', 'Unknown') for s in sessions))
    
    # Calculate costs
    total_cost, session_costs = calculate_cost(sessions)
    
    return render_template_string(
        HTML_TEMPLATE,
        agents=agents,
        models=models,
        sessions=sessions,
        session_costs=session_costs,
        total_cost=total_cost,
        last_updated=datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    )

if __name__ == '__main__':
    print("🚀 Starting OpenClaw Dashboard...")
    print("📊 Open http://localhost:5000 in your browser")
    app.run(host='0.0.0.0', port=5000, debug=False)
