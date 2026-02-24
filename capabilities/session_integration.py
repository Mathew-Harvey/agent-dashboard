"""
Session Integration — Auto-log tasks from main session
======================================================
Use this to auto-log tasks in the main Jeff session.
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from capabilities.task_logger import log_task_simple, get_category_stats
from capabilities.analyzer import PerformanceAnalyzer
from capabilities.improvement_generator import ImprovementGenerator


def log_and_check(description: str, category: str = None, outcome: str = "success", quality: float = 0.7):
    """
    Log a task and check if we should analyze.
    
    Call this after completing any significant task.
    """
    # Log the task
    entry = log_task_simple(
        description=description,
        category=category,
        outcome=outcome,
        quality=quality,
    )
    
    print(f"📝 Logged: [{category or 'auto'}] {description[:40]}...")
    
    # Check if we should analyze
    analyzer = PerformanceAnalyzer()
    should, reason = analyzer.should_analyze()
    
    if should:
        print(f"🔄 Triggering analysis: {reason}")
        analyzer.analyze(trigger="auto_10_tasks")
        
        # Also generate improvements
        generator = ImprovementGenerator()
        improvements = generator.generate_from_analysis()
        if improvements:
            generator.save_improvements(improvements)
            print(f"💡 Generated {len(improvements)} improvements")
    
    return entry


def quick_status():
    """Show quick status of self-improvement system."""
    stats = get_category_stats(7)
    
    print("\n📊 Self-Improvement Status (7 days)")
    print("-" * 40)
    
    total = 0
    for cat, data in stats.items():
        if data.get("total", 0) > 0:
            total += data["total"]
            print(f"  {cat:<12} {data['total']:>3} tasks  (avg quality: {data['avg_quality']:.2f})")
    
    print(f"  {'TOTAL':<12} {total:>3} tasks")
    print()
    
    # Check for pending improvements
    from capabilities.improvement_generator import IMPROVEMENTS_DIR, PROPOSED_DIR
    pending = len(list(PROPOSED_DIR.glob("*.json")))
    print(f"📋 Pending improvements: {pending}")
    
    return stats


# Convenience functions for session use
def log_code(description: str, outcome: str = "success", quality: float = 0.8):
    """Log a code task."""
    return log_and_check(description, "code", outcome, quality)


def log_research(description: str, outcome: str = "success", quality: float = 0.7):
    """Log a research task."""
    return log_and_check(description, "research", outcome, quality)


def log_outreach(description: str, outcome: str = "success", quality: float = 0.6):
    """Log an outreach task."""
    return log_and_check(description, "outreach", outcome, quality)


def log_sales(description: str, outcome: str = "success", quality: float = 0.6):
    """Log a sales task."""
    return log_and_check(description, "sales", outcome, quality)


def log_admin(description: str, outcome: str = "success", quality: float = 0.7):
    """Log an admin task."""
    return log_and_check(description, "admin", outcome, quality)


def log_business_dev(description: str, outcome: str = "success", quality: float = 0.6):
    """Log a business dev task."""
    return log_and_check(description, "business_dev", outcome, quality)
