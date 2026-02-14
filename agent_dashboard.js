#!/usr/bin/env node
/**
 * OpenClaw Agent Dashboard (Enhanced with session history, cost graphs, activity logs)
 * Run: node agent_dashboard.js
 * Then open http://localhost:5000
 */

const { exec } = require('child_process');
const http = require('http');

const PORT = 5000;

// Cost per 1M tokens (approximate)
const LLM_COSTS = {
  "MiniMax-M2.5": { input: 0.2, output: 0.4 },
  "MiniMax-M2": { input: 0.2, output: 0.4 },
  "claude-opus": { input: 15.0, output: 75.0 },
  "claude-sonnet": { input: 3.0, output: 15.0 },
  "claude-haiku": { input: 0.2, output: 1.0 },
  "GPT-4": { input: 10.0, output: 30.0 },
  "GPT-4o": { input: 2.5, output: 10.0 },
  "GPT-4o-mini": { input: 0.15, output: 0.6 },
  "ollama/gpt-oss:20b": { input: 0.0, output: 0.0 },
};

// Store historical cost data for graphs
let costHistory = [];
const MAX_HISTORY = 60; // Keep last 60 data points

function getStatus() {
  return new Promise((resolve, reject) => {
    exec('openclaw status --all', { timeout: 10000 }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

function parseSessions(output) {
  const sessions = [];
  const lines = output.split('\n');
  let inSessions = false;
  
  for (const line of lines) {
    if (line.includes('Sessions') && line.includes('Key')) {
      inSessions = true;
      continue;
    }
    if (inSessions && line.trim().startsWith('│')) {
      const parts = line.split('│').map(p => p.trim()).filter(p => p);
      if (parts.length >= 4 && !parts[0].includes('Key')) {
        sessions.push({
          key: parts[0],
          kind: parts[1],
          age: parts[2],
          model: parts[3],
          tokens: parts[4] || 'N/A'
        });
      }
    } else if (inSessions && !line.trim().startsWith('│')) {
      inSessions = false;
    }
  }
  return sessions;
}

function parseAgents(output) {
  const agents = [];
  const lines = output.split('\n');
  
  for (const line of lines) {
    if (line.includes('Agents') && line.includes('·')) {
      const parts = line.split('·');
      if (parts.length >= 2) {
        const info = parts[1].trim().split(/\s+/);
        agents.push({
          total: info[0] || '0',
          status: info.slice(1).join(' ') || 'unknown'
        });
      }
    }
  }
  return agents;
}

function calculateCost(sessions) {
  let totalCost = 0;
  const sessionCosts = [];
  
  for (const session of sessions) {
    const model = session.model;
    const tokensStr = session.tokens;
    
    let used = 0;
    try {
      const usedStr = tokensStr.split('/')[0].replace('k', '000').replace('m', '000000');
      used = parseInt(usedStr) || 0;
    } catch (e) {}
    
    let costInfo = null;
    for (const [modelName, costs] of Object.entries(LLM_COSTS)) {
      if (model.includes(modelName.trim())) {
        costInfo = costs;
        break;
      }
    }
    
    let sessionCost = 0;
    if (costInfo) {
      const inputCost = (used * 0.3 / 1000000) * costInfo.input;
      const outputCost = (used * 0.7 / 1000000) * costInfo.output;
      sessionCost = inputCost + outputCost;
    }
    
    totalCost += sessionCost;
    sessionCosts.push({
      model,
      tokensUsed: used,
      estimatedCost: sessionCost
    });
  }
  
  return { totalCost, sessionCosts };
}

function updateCostHistory(totalCost) {
  const now = new Date();
  costHistory.push({
    time: now.toLocaleTimeString(),
    cost: totalCost,
    timestamp: now.getTime()
  });
  
  if (costHistory.length > MAX_HISTORY) {
    costHistory.shift();
  }
}

function generateCostGraph() {
  if (costHistory.length < 2) return '';
  
  const costs = costHistory.map(d => d.cost);
  const maxCost = Math.max(...costs, 0.01);
  const minCost = Math.min(...costs, 0);
  const range = maxCost - minCost || 1;
  
  let graph = '\n📈 Cost Over Time (last ' + costHistory.length + ' checks):\n\n';
  
  // Simple ASCII bar chart
  const bars = 20;
  for (let i = 0; i < bars; i++) {
    const idx = Math.floor((i / bars) * (costs.length - 1));
    const cost = costs[idx];
    const height = Math.round(((cost - minCost) / range) * 10);
    const bar = '█'.repeat(Math.max(1, height));
    const time = costHistory[idx].time.split(':').slice(0,2).join(':');
    graph += `${time} | ${bar} $${cost.toFixed(4)}\n`;
  }
  
  return graph;
}

async function updateDashboard(res) {
  try {
    const output = await getStatus();
    const sessions = parseSessions(output);
    const agents = parseAgents(output);
    const models = [...new Set(sessions.map(s => s.model))];
    const { totalCost, sessionCosts } = calculateCost(sessions);
    
    // Update cost history
    updateCostHistory(totalCost);
    
    // Calculate model usage breakdown
    const modelUsage = {};
    for (const session of sessions) {
      const model = session.model;
      if (!modelUsage[model]) {
        modelUsage[model] = { count: 0, cost: 0, tokens: 0 };
      }
      modelUsage[model].count++;
      const sessionCost = sessionCosts.find(s => s.model === model);
      if (sessionCost) {
        modelUsage[model].cost += sessionCost.estimatedCost;
        modelUsage[model].tokens += sessionCost.tokensUsed;
      }
    }
    
    // Generate activity log (simulated from current state)
    const activityLog = [
      { time: new Date().toISOString(), event: 'Dashboard refreshed', type: 'info' },
      { time: new Date(Date.now() - 60000).toISOString(), event: `Session count: ${sessions.length}`, type: 'info' },
      { time: new Date(Date.now() - 120000).toISOString(), event: `Agents active: ${agents.length}`, type: 'info' },
    ];
    
    const data = {
      agents: agents.length,
      models: models.length,
      totalCost: totalCost.toFixed(4),
      sessions: sessions.map((s, i) => ({
        ...s,
        cost: sessionCosts[i]?.estimatedCost?.toFixed(4) || '0.0000'
      })),
      modelUsage,
      costHistory: costHistory.slice(-20),
      activityLog,
      updated: new Date().toISOString()
    };
    
    // Build sessions table rows
    let sessionsHtml = '';
    for (const s of data.sessions) {
      sessionsHtml += `<tr>
        <td>${s.key.substring(0, 30)}...</td>
        <td>${s.kind}</td>
        <td>${s.age}</td>
        <td><span class="model-badge">${s.model}</span></td>
        <td>${s.tokens}</td>
        <td class="cost">$${s.cost}</td>
      </tr>`;
    }
    
    // Build model usage rows
    let modelUsageHtml = '';
    for (const [model, usage] of Object.entries(data.modelUsage)) {
      modelUsageHtml += `<tr>
        <td><span class="model-badge">${model}</span></td>
        <td>${usage.count}</td>
        <td>${usage.tokens.toLocaleString()}</td>
        <td class="cost">$${usage.cost.toFixed(4)}</td>
      </tr>`;
    }
    
    // Build activity log rows
    let activityLogHtml = '';
    for (const log of data.activityLog) {
      const icon = log.type === 'error' ? '❌' : log.type === 'warning' ? '⚠️' : '✅';
      activityLogHtml += `<tr>
        <td>${new Date(log.time).toLocaleTimeString()}</td>
        <td>${icon}</td>
        <td>${log.event}</td>
      </tr>`;
    }
    
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>OpenClaw Agent Dashboard</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="30">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0d1117;
      color: #c9d1d9;
      min-height: 100vh;
      padding: 20px;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    h1 { color: #58a6ff; margin-bottom: 5px; display: flex; align-items: center; gap: 10px; }
    .subtitle { color: #8b949e; margin-bottom: 30px; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
    .stat { font-size: 32px; font-weight: bold; color: #3fb950; }
    .stat-label { font-size: 14px; color: #8b949e; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 10px; border-bottom: 1px solid #30363d; }
    th { color: #8b949e; font-weight: normal; font-size: 12px; }
    .model-badge {
      background: #238636;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
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
    .refresh-btn {
      background: #238636;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    .refresh-btn:hover { background: #2ea043; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    @media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <div class="container">
    <h1>🤖 OpenClaw Dashboard <button class="refresh-btn" onclick="location.reload()">Refresh</button></h1>
    <p class="subtitle">Agent monitoring • Cost tracking • Activity logs</p>
    
    <div class="grid">
      <div class="card">
        <h2><span class="pulse"></span> Active Agents</h2>
        <div class="stat">${data.agents}</div>
        <div class="stat-label">agents running</div>
      </div>
      <div class="card">
        <h2>🧠 Models In Use</h2>
        <div class="stat">${data.models}</div>
        <div class="stat-label">unique models</div>
      </div>
      <div class="card">
        <h2>💰 Session Cost (Est.)</h2>
        <div class="stat cost">$${data.totalCost}</div>
        <div class="stat-label">current session</div>
      </div>
      <div class="card">
        <h2>📧 Email</h2>
        <div style="font-size: 14px; color: #58a6ff;">jeff-assistant@agentmail.to</div>
        <div class="stat-label">agent inbox</div>
      </div>
    </div>
    
    <div class="two-col">
      <div class="card">
        <h2>📊 Session History</h2>
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
            ${sessionsHtml}
          </tbody>
        </table>
      </div>
      
      <div class="card">
        <h2>🧮 Model Usage Breakdown</h2>
        <table>
          <thead>
            <tr>
              <th>Model</th>
              <th>Sessions</th>
              <th>Tokens</th>
              <th>Est. Cost</th>
            </tr>
          </thead>
          <tbody>
            ${modelUsageHtml}
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="two-col" style="margin-top: 20px;">
      <div class="card">
        <h2>📈 Cost History</h2>
        <pre style="color: #8b949e; font-size: 11px; overflow-x: auto;">${generateCostGraph()}</pre>
      </div>
      
      <div class="card">
        <h2>📝 Activity Log</h2>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>Event</th>
            </tr>
          </thead>
          <tbody>
            ${activityLogHtml}
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="last-updated">
      Last updated: ${data.updated} • Auto-refreshes every 30 seconds
    </div>
  </div>
</body>
</html>`;
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } catch (error) {
    console.error('Error:', error.message);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error fetching OpenClaw status: ' + error.message);
  }
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/') {
    await updateDashboard(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`🚀 OpenClaw Dashboard running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop');
});
