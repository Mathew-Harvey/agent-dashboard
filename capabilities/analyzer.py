"""
Performance Analyzer — Self-Improvement Core
=============================================
Analyzes task patterns and generates insights.
Triggers: every 10 tasks, end of day, quality < 0.3, manual
"""

import json
from datetime import datetime, timedelta
from pathlib import Path
from collections import defaultdict
from typing import Optional
import sys

sys.path.insert(0, str(Path(__file__).parent.parent))

from capabilities.task_logger import LOGS_DIR, CATEGORIES


# ─── Configuration ───────────────────────────────────────────────────────────

REFLECTIONS_DIR = Path(__file__).parent / "reflections"
REFLECTIONS_DIR.mkdir(parents=True, exist_ok=True)

# Trigger thresholds
TASKS_BEFORE_ANALYSIS = 10
QUALITY_THRESHOLD = 0.3  # Analyze immediately on low quality


# ─── Data Collection ──────────────────────────────────────────────────────────

def get_tasks_since(since: datetime) -> list:
    """Get all tasks since a given datetime."""
    tasks = []
    
    for log_file in sorted(LOGS_DIR.glob("*.jsonl")):
        with open(log_file) as f:
            for line in f:
                try:
                    task = json.loads(line.strip())
                    task_time = datetime.fromisoformat(task.get("timestamp", ""))
                    if task_time >= since:
                        tasks.append(task)
                except (json.JSONDecodeError, ValueError):
                    continue
    
    return tasks


def get_tasks_count_since(since: datetime) -> int:
    """Count tasks since a given datetime (more efficient than loading all)."""
    count = 0
    
    for log_file in sorted(LOGS_DIR.glob("*.jsonl")):
        with open(log_file) as f:
            for line in f:
                try:
                    task = json.loads(line.strip())
                    task_time = datetime.fromisoformat(task.get("timestamp", ""))
                    if task_time >= since:
                        count += 1
                except (json.JSONDecodeError, ValueError):
                    continue
    
    return count


def analyze_tasks(tasks: list) -> dict:
    """Analyze a list of tasks and return insights."""
    
    if not tasks:
        return {"error": "No tasks to analyze"}
    
    # Basic counts
    total = len(tasks)
    by_outcome = defaultdict(int)
    by_category = defaultdict(lambda: {"total": 0, "success": 0, "failure": 0, "partial": 0, "qualities": []})
    
    failures = []
    low_quality = []
    
    for task in tasks:
        outcome = task.get("outcome", "partial")
        category = task.get("category", "unknown")
        quality = task.get("quality", 0.5)
        
        by_outcome[outcome] += 1
        by_category[category]["total"] += 1
        by_category[category][outcome] += 1
        by_category[category]["qualities"].append(quality)
        
        if outcome == "failure":
            failures.append(task)
        if quality < QUALITY_THRESHOLD:
            low_quality.append(task)
    
    # Calculate averages
    for cat in by_category:
        quals = by_category[cat]["qualities"]
        by_category[cat]["avg_quality"] = sum(quals) / len(quals) if quals else 0.5
        del by_category[cat]["qualities"]  # Don't serialize large arrays
    
    # Calculate success rates
    success_rates = {}
    for cat, data in by_category.items():
        if data["total"] > 0:
            success_rates[cat] = data["success"] / data["total"]
        else:
            success_rates[cat] = 0
    
    return {
        "total": total,
        "by_outcome": dict(by_outcome),
        "by_category": dict(by_category),
        "success_rates": success_rates,
        "failures": failures,
        "low_quality": low_quality,
    }


# ─── Pattern Recognition ─────────────────────────────────────────────────────

def identify_patterns(analysis: dict) -> dict:
    """Identify patterns from analysis data."""
    
    patterns = {
        "strengths": [],
        "weaknesses": [],
        "blind_spots": [],
        "time_wasters": [],
    }
    
    # Find strengths (categories with >80% success)
    for cat, rate in analysis.get("success_rates", {}).items():
        if rate >= 0.8 and analysis["by_category"][cat]["total"] >= 3:
            patterns["strengths"].append({
                "category": cat,
                "rate": rate,
                "count": analysis["by_category"][cat]["total"],
            })
    
    # Find weaknesses (categories with <50% success)
    for cat, rate in analysis.get("success_rates", {}).items():
        if rate < 0.5:
            patterns["weaknesses"].append({
                "category": cat,
                "rate": rate,
                "count": analysis["by_category"][cat]["total"],
            })
    
    # Find blind spots (categories with high volume but no data = never attempted)
    all_cats = set(CATEGORIES)
    attempted_cats = set(analysis.get("by_category", {}).keys())
    never_attempted = all_cats - attempted_cats
    for cat in never_attempted:
        patterns["blind_spots"].append({"category": cat, "reason": "No tasks attempted in this category"})
    
    # Find failures
    for failure in analysis.get("failures", [])[:5]:  # Top 5
        patterns["weaknesses"].append({
            "category": failure.get("category"),
            "task": failure.get("description", "")[:60],
            "reason": failure.get("what_failed", ["Unknown"])[0] if failure.get("what_failed") else "Unknown",
        })
    
    return patterns


# ─── Reflection Generation ──────────────────────────────────────────────────

def generate_reflection(analysis: dict, patterns: dict, trigger: str) -> str:
    """Generate a reflection document."""
    
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    
    # Build the reflection markdown
    lines = [
        f"# Reflection — {timestamp}",
        f"**Trigger:** {trigger}",
        f"**Tasks analyzed:** {analysis.get('total', 0)}",
        "",
        "## Summary",
        "",
    ]
    
    # Outcome summary
    outcomes = analysis.get("by_outcome", {})
    if outcomes:
        lines.append(f"- **Success:** {outcomes.get('success', 0)} ({outcomes.get('success', 0)/max(analysis['total'],1)*100:.0f}%)")
        lines.append(f"- **Failure:** {outcomes.get('failure', 0)} ({outcomes.get('failure', 0)/max(analysis['total'],1)*100:.0f}%)")
        lines.append(f"- **Partial:** {outcomes.get('partial', 0)} ({outcomes.get('partial', 0)/max(analysis['total'],1)*100:.0f}%)")
    lines.append("")
    
    # Category performance
    lines.append("## Category Performance")
    lines.append("")
    lines.append("| Category | Total | Success Rate | Avg Quality |")
    lines.append("|----------|-------|--------------|-------------|")
    
    for cat, data in sorted(analysis.get("by_category", {}).items(), key=lambda x: -x[1].get("total", 0)):
        rate = analysis.get("success_rates", {}).get(cat, 0)
        lines.append(f"| {cat:<8} | {data['total']:>5} | {rate:>10.0%} | {data.get('avg_quality', 0):>11.2f} |")
    lines.append("")
    
    # Strengths
    if patterns.get("strengths"):
        lines.append("## 🟢 Strengths")
        lines.append("")
        for s in patterns["strengths"]:
            if "category" in s and "rate" in s:
                lines.append(f"- **{s['category']}**: {s['rate']:.0%} success rate ({s['count']} tasks)")
            else:
                lines.append(f"- {s.get('task', 'Unknown')[:60]}")
        lines.append("")
    
    # Weaknesses
    if patterns.get("weaknesses"):
        lines.append("## 🔴 Weaknesses")
        lines.append("")
        for w in patterns["weaknesses"]:
            if "category" in w and "rate" in w:
                lines.append(f"- **{w['category']}**: {w['rate']:.0%} success rate ({w['count']} tasks)")
            else:
                lines.append(f"- {w.get('task', w.get('reason', 'Unknown'))[:60]}")
                if w.get("reason"):
                    lines.append(f"  - {w['reason']}")
        lines.append("")
    
    # Blind spots
    if patterns.get("blind_spots"):
        lines.append("## ⚪ Blind Spots")
        lines.append("")
        for b in patterns["blind_spots"]:
            lines.append(f"- **{b['category']}**: {b['reason']}")
        lines.append("")
    
    # Recommendations
    lines.append("## 🎯 Recommendations")
    lines.append("")
    
    # Auto-generate recommendations based on patterns
    recommendations = []
    
    # If research has low quality
    research_data = analysis.get("by_category", {}).get("research", {})
    if research_data.get("avg_quality", 1) < 0.6:
        recommendations.append("1. **Research quality issue** — Consider deeper verification steps before reporting")
    
    # If outreach has many partials
    outreach_data = analysis.get("by_category", {}).get("outreach", {})
    if outreach_data.get("partial", 0) > outreach_data.get("success", 0):
        recommendations.append("2. **Outreach follow-through** — Partial completions suggest need for better follow-up strategies")
    
    # If no code tasks recently
    if "code" not in analysis.get("by_category", {}):
        recommendations.append("3. **Code practice gap** — No recent code tasks; consider adding coding practice")
    
    # If failures exist
    if analysis.get("failures"):
        recommendations.append(f"4. **Failure review** — {len(analysis['failures'])} failures to review; add to improvement queue")
    
    if not recommendations:
        lines.append("- Keep doing what you're doing. Performance is solid.")
    else:
        lines.extend(recommendations)
    
    lines.append("")
    lines.append("---")
    lines.append(f"**Generated by Jeff's Self-Improvement Analyzer**")
    
    return "\n".join(lines)


# ─── Main Analyzer ──────────────────────────────────────────────────────────

class PerformanceAnalyzer:
    """Self-improvement analyzer."""
    
    def __init__(self):
        self.last_analysis_time = None
        self.last_analysis_count = 0
        
        # Try to load last analysis info
        stats_file = REFLECTIONS_DIR / ".last_analysis"
        if stats_file.exists():
            try:
                with open(stats_file) as f:
                    data = json.load(f)
                    self.last_analysis_time = datetime.fromisoformat(data.get("last_analysis_time", ""))
                    self.last_analysis_count = data.get("last_analysis_count", 0)
            except:
                pass
    
    def should_analyze(self) -> tuple[bool, str]:
        """Check if analysis should run."""
        now = datetime.now()
        
        # Check task count since last analysis
        if self.last_analysis_time:
            tasks_since = get_tasks_count_since(self.last_analysis_time)
            if tasks_since >= TASKS_BEFORE_ANALYSIS:
                return True, f"{tasks_since} tasks since last analysis"
        
        # Check end of day (6 PM cutoff)
        if now.hour >= 18 and now.date() != (self.last_analysis_time or now).date():
            return True, "end of day"
        
        return False, ""
    
    def analyze(self, trigger: str = "manual", since: datetime = None) -> dict:
        """Run analysis and save reflection."""
        
        if since is None:
            since = self.last_analysis_time or (datetime.now() - timedelta(days=7))
        
        # Collect tasks
        tasks = get_tasks_since(since)
        analysis = analyze_tasks(tasks)
        patterns = identify_patterns(analysis)
        
        # Generate reflection
        reflection = generate_reflection(analysis, patterns, trigger)
        
        # Save reflection
        timestamp = datetime.now().strftime("%Y-%m-%d-%H%M")
        reflection_file = REFLECTIONS_DIR / f"{timestamp}.md"
        with open(reflection_file, "w") as f:
            f.write(reflection)
        
        # Update stats
        self.last_analysis_time = datetime.now()
        self.last_analysis_count = len(tasks)
        
        stats_file = REFLECTIONS_DIR / ".last_analysis"
        with open(stats_file, "w") as f:
            json.dump({
                "last_analysis_time": self.last_analysis_time.isoformat(),
                "last_analysis_count": self.last_analysis_count,
                "last_reflection_file": str(reflection_file),
            }, f)
        
        return {
            "trigger": trigger,
            "tasks_analyzed": len(tasks),
            "reflection_file": str(reflection_file),
            "patterns": patterns,
            "analysis": analysis,
        }
    
    def get_latest_reflection(self) -> Optional[str]:
        """Get the most recent reflection."""
        files = sorted(REFLECTIONS_DIR.glob("*.md"))
        if not files:
            return None
        with open(files[-1]) as f:
            return f.read()


# ─── CLI ────────────────────────────────────────────────────────────────────

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Performance Analyzer")
    parser.add_argument("--trigger", default="manual", help="What triggered this analysis")
    parser.add_argument("--days", type=int, default=7, help="Days to analyze")
    parser.add_argument("--show", action="store_true", help="Show latest reflection")
    
    args = parser.parse_args()
    
    analyzer = PerformanceAnalyzer()
    
    if args.show:
        reflection = analyzer.get_latest_reflection()
        if reflection:
            print(reflection)
        else:
            print("No reflections found.")
        return
    
    # Run analysis
    since = datetime.now() - timedelta(days=args.days)
    result = analyzer.analyze(trigger=args.trigger, since=since)
    
    print(f"\n✅ Analysis complete!")
    print(f"   Trigger: {result['trigger']}")
    print(f"   Tasks analyzed: {result['tasks_analyzed']}")
    print(f"   Saved to: {result['reflection_file']}")
    print()
    
    if result['patterns']['strengths']:
        print("🟢 Strengths:")
        for s in result['patterns']['strengths'][:3]:
            print(f"   - {s['category']}: {s['rate']:.0%}")
    
    if result['patterns']['weaknesses']:
        print("\n🔴 Weaknesses:")
        for w in result['patterns']['weaknesses'][:3]:
            if "category" in w and "rate" in w:
                print(f"   - {w['category']}: {w['rate']:.0%}")
            else:
                print(f"   - {w.get('task', 'unknown')[:50]}")


if __name__ == "__main__":
    main()
