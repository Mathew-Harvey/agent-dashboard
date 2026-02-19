"""
Task Logger — Self-Improvement Foundation
==========================================
Logs every task with outcome, quality, and reflection data.
"""

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Optional
from functools import wraps
import uuid

# Base directory for capabilities
BASE_DIR = Path(__file__).parent.parent / "capabilities"
LOGS_DIR = BASE_DIR / "logs" / "tasks"

# Ensure directories exist
LOGS_DIR.mkdir(parents=True, exist_ok=True)

# Categories
CATEGORIES = ["code", "research", "outreach", "sales", "admin", "business_dev"]


def get_log_path() -> Path:
    """Get the current log file path (one per month)."""
    return LOGS_DIR / f"{datetime.now().strftime('%Y-%m')}.jsonl"


def log_task(
    task_id: Optional[str] = None,
    description: str = "",
    category: str = "admin",
    outcome: str = "success",  # success, failure, partial
    quality: float = 0.5,  # 0.0 to 1.0
    time_ms: int = 0,
    what_worked: list = None,
    what_failed: list = None,
    session_key: str = None,
    metadata: dict = None,
) -> dict:
    """
    Log a task execution for later analysis.
    
    Returns the logged entry with ID.
    """
    if task_id is None:
        task_id = f"task_{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:6]}"
    
    if what_worked is None:
        what_worked = []
    if what_failed is None:
        what_failed = []
    
    entry = {
        "task_id": task_id,
        "description": description,
        "category": category,
        "outcome": outcome,
        "quality": quality,
        "time_ms": time_ms,
        "what_worked": what_worked,
        "what_failed": what_failed,
        "session_key": session_key,
        "timestamp": datetime.now().isoformat(),
        "metadata": metadata or {},
    }
    
    # Append to JSONL
    with open(get_log_path(), "a") as f:
        f.write(json.dumps(entry) + "\n")
    
    return entry


def auto_category(description: str) -> str:
    """
    Auto-detect category from task description.
    """
    desc_lower = description.lower()
    
    # Code keywords
    code_kw = ["code", "write", "debug", "fix", "implement", "function", "script", "python", "javascript"]
    if any(kw in desc_lower for kw in code_kw):
        return "code"
    
    # Research keywords
    research_kw = ["search", "find", "research", "lookup", "check", "verify", "investigate"]
    if any(kw in desc_lower for kw in research_kw):
        return "research"
    
    # Outreach keywords
    outreach_kw = ["post", "tweet", "comment", "outreach", "message", "dm", "reply"]
    if any(kw in desc_lower for kw in outreach_kw):
        return "outreach"
    
    # Sales keywords
    sales_kw = ["pitch", "proposal", "client", "sale", "quote", "pricing"]
    if any(kw in desc_lower for kw in sales_kw):
        return "sales"
    
    # Business dev keywords
    bd_kw = ["partner", "opportunity", "strategy", "expand", "market", "revenue"]
    if any(kw in desc_lower for kw in bd_kw):
        return "business_dev"
    
    # Admin keywords
    admin_kw = ["email", "schedule", "remind", "organize", "note", "update"]
    if any(kw in desc_lower for kw in admin_kw):
        return "admin"
    
    return "admin"  # default


def log_task_simple(
    description: str,
    category: str = None,
    outcome: str = "success",
    quality: float = 0.5,
    time_ms: int = 0,
) -> dict:
    """
    Simplified logging with auto-category detection.
    """
    if category is None:
        category = auto_category(description)
    
    return log_task(
        description=description,
        category=category,
        outcome=outcome,
        quality=quality,
        time_ms=time_ms,
    )


def get_recent_tasks(count: int = 10, category: str = None) -> list:
    """
    Retrieve recent tasks, optionally filtered by category.
    """
    log_file = get_log_path()
    if not log_file.exists():
        return []
    
    tasks = []
    with open(log_file) as f:
        for line in f:
            try:
                task = json.loads(line.strip())
                if category is None or task.get("category") == category:
                    tasks.append(task)
            except json.JSONDecodeError:
                continue
    
    return tasks[-count:]


def get_tasks_by_outcome(outcome: str = "failure", count: int = 50) -> list:
    """Get recent tasks with specific outcome for analysis."""
    log_file = get_log_path()
    if not log_file.exists():
        return []
    
    tasks = []
    with open(log_file) as f:
        for line in f:
            try:
                task = json.loads(line.strip())
                if task.get("outcome") == outcome:
                    tasks.append(task)
            except json.JSONDecodeError:
                continue
    
    return tasks[-count:]


def get_category_stats(days: int = 7) -> dict:
    """
    Get performance stats by category.
    """
    import time
    from datetime import timedelta
    
    cutoff = (datetime.now() - timedelta(days=days)).isoformat()
    stats = {cat: {"total": 0, "success": 0, "failure": 0, "partial": 0, "avg_quality": 0} for cat in CATEGORIES}
    stats["unknown"] = {"total": 0, "success": 0, "failure": 0, "partial": 0, "avg_quality": 0}
    
    # Scan all recent log files
    now = datetime.now()
    for i in range(days + 1):
        d = now - timedelta(days=i)
        log_file = LOGS_DIR / f"{d.strftime('%Y-%m')}.jsonl"
        if not log_file.exists():
            continue
        
        with open(log_file) as f:
            for line in f:
                try:
                    task = json.loads(line.strip())
                    if task.get("timestamp", "") < cutoff:
                        continue
                    
                    cat = task.get("category", "unknown")
                    if cat not in stats:
                        cat = "unknown"
                    
                    stats[cat]["total"] += 1
                    stats[cat][task.get("outcome", "partial")] += 1
                    stats[cat]["avg_quality"] += task.get("quality", 0.5)
                except json.JSONDecodeError:
                    continue
    
    # Calculate averages
    for cat in stats:
        if stats[cat]["total"] > 0:
            stats[cat]["avg_quality"] /= stats[cat]["total"]
    
    return stats


def task_logger(description: str = None, category: str = None):
    """
    Decorator for automatic task logging.
    
    Usage:
        @task_logger("my task", "code")
        def my_function():
            ...
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            start = datetime.now()
            try:
                result = func(*args, **kwargs)
                elapsed = int((datetime.now() - start).total_seconds() * 1000)
                
                # Try to extract outcome from result
                outcome = "success"
                quality = 0.8
                
                log_task_simple(
                    description=description or func.__name__,
                    category=category,
                    outcome=outcome,
                    quality=quality,
                    time_ms=elapsed,
                )
                
                return result
            except Exception as e:
                elapsed = int((datetime.now() - start).total_seconds() * 1000)
                
                log_task_simple(
                    description=description or func.__name__,
                    category=category,
                    outcome="failure",
                    quality=0.0,
                    time_ms=elapsed,
                )
                raise
        
        return wrapper
    return decorator
