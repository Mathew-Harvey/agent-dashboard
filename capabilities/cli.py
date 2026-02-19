"""
Self-Improvement Capabilities — CLI
=====================================
Quick commands for interacting with the self-improvement system.
"""

import json
import sys
from pathlib import Path
import argparse

# Add workspace to path
import os
sys.path.insert(0, str(Path(__file__).parent.parent))

from capabilities.task_logger import (
    get_recent_tasks,
    get_tasks_by_outcome,
    get_category_stats,
    CATEGORIES,
)


def cmd_stats(args):
    """Show category performance stats."""
    stats = get_category_stats(args.days)
    
    print(f"\n📊 Performance Stats (last {args.days} days)\n")
    print(f"{'Category':<15} {'Total':>6} {'✓':>5} {'✗':>5} {'~':>5} {'Avg':>6}")
    print("-" * 50)
    
    total_all = 0
    for cat in CATEGORIES + ["unknown"]:
        data = stats.get(cat, {})
        if data.get("total", 0) > 0:
            total_all += data["total"]
            print(f"{cat:<15} {data['total']:>6} {data.get('success', 0):>5} {data.get('failure', 0):>5} {data.get('partial', 0):>5} {data['avg_quality']:>6.2f}")
    
    print("-" * 50)
    print(f"{'TOTAL':<15} {total_all:>6}\n")


def cmd_recent(args):
    """Show recent tasks."""
    tasks = get_recent_tasks(args.count, args.category)
    
    print(f"\n📋 Recent Tasks" + (f" ({args.category})" if args.category else "") + f"\n")
    
    for task in tasks[-args.count:]:
        quality_emoji = "🟢" if task["quality"] >= 0.7 else "🟡" if task["quality"] >= 0.4 else "🔴"
        
        print(f"{quality_emoji} [{task['category']:<12}] {task['outcome']:<7} Q:{task['quality']:.1f} | {task['description'][:50]}")
    
    print()


def cmd_failures(args):
    """Show recent failures."""
    tasks = get_tasks_by_outcome("failure", args.count)
    
    print(f"\n🔴 Recent Failures\n")
    
    for task in tasks[-args.count:]:
        print(f"  [{task['category']:<12}] {task['description'][:60]}")
        if task.get("what_failed"):
            for wf in task["what_failed"]:
                print(f"    → {wf}")
        print()


def cmd_log(args):
    """Log a task manually."""
    from capabilities.task_logger import log_task_simple
    
    entry = log_task_simple(
        description=args.description,
        category=args.category,
        outcome=args.outcome,
        quality=float(args.quality),
    )
    print(f"✅ Logged: {entry['task_id']}")


def main():
    parser = argparse.ArgumentParser(description="Self-Improvement CLI")
    sub = parser.add_subparsers(dest="command")
    
    # stats
    p_stats = sub.add_parser("stats", help="Show performance by category")
    p_stats.add_argument("--days", type=int, default=7, help="Days to analyze")
    p_stats.set_defaults(func=cmd_stats)
    
    # recent
    p_recent = sub.add_parser("recent", help="Show recent tasks")
    p_recent.add_argument("--count", type=int, default=10)
    p_recent.add_argument("--category", choices=CATEGORIES)
    p_recent.set_defaults(func=cmd_recent)
    
    # failures
    p_fail = sub.add_parser("failures", help="Show recent failures")
    p_fail.add_argument("--count", type=int, default=10)
    p_fail.set_defaults(func=cmd_failures)
    
    # log
    p_log = sub.add_parser("log", help="Log a task manually")
    p_log.add_argument("--description", required=True)
    p_log.add_argument("--category", choices=CATEGORIES, default="admin")
    p_log.add_argument("--outcome", choices=["success", "failure", "partial"], default="success")
    p_log.add_argument("--quality", default="0.7")
    p_log.set_defaults(func=cmd_log)
    
    args = parser.parse_args()
    
    if hasattr(args, "func"):
        args.func(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
