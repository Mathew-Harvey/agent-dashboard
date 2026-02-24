"""
Improvement Generator — Self-Improvement Core
==============================================
Takes analyzer output → generates specific improvements.
Types: prompt_tweak, workflow, skill_need, lesson
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional
import re

sys.path.insert(0, str(Path(__file__).parent.parent))

from capabilities.analyzer import PerformanceAnalyzer, REFLECTIONS_DIR


# ─── Configuration ───────────────────────────────────────────────────────────

IMPROVEMENTS_DIR = Path(__file__).parent / "improvements"
PROPOSED_DIR = IMPROVEMENTS_DIR / "proposed"
APPROVED_DIR = IMPROVEMENTS_DIR / "approved"
REJECTED_DIR = IMPROVEMENTS_DIR / "rejected"

for d in [PROPOSED_DIR, APPROVED_DIR, REJECTED_DIR]:
    d.mkdir(parents=True, exist_ok=True)

LESSONS_DIR = Path(__file__).parent / "lessons"
LESSONS_DIR.mkdir(parents=True, exist_ok=True)

# Auto-apply threshold
AUTO_APPLY_CONFIDENCE = 7  # 0-10 scale, <= this auto-applies


# ─── Improvement Templates ──────────────────────────────────────────────────

IMPROVEMENT_TEMPLATES = {
    "research": {
        "low_quality": {
            "type": "workflow",
            "template": "Before reporting research results, always: (1) verify at least 2 sources, (2) note confidence level, (3) flag any uncertainties.",
            "expected_impact": "Improve research accuracy and reliability",
        },
        "failure": {
            "type": "lesson",
            "template": "When research fails, document what search terms/databases were tried and what worked instead.",
            "expected_impact": "Avoid repeating failed approaches",
        },
    },
    "outreach": {
        "partial": {
            "type": "workflow",
            "template": "For outreach tasks: (1) Define success criteria upfront, (2) Track response rate, (3) Follow up within 48h.",
            "expected_impact": "Improve outreach completion rates",
        },
    },
    "code": {
        "failure": {
            "type": "lesson",
            "template": "When code fails: (1) Capture exact error, (2) Check documentation, (3) Test in isolation before reporting failure.",
            "expected_impact": "Better debugging and failure documentation",
        },
    },
    "default": {
        "low_quality": {
            "type": "workflow",
            "template": "For any task, if quality drops below 0.5, explicitly document what went wrong before moving on.",
            "expected_impact": "Self-correction on quality issues",
        },
    },
}


# ─── Generator ──────────────────────────────────────────────────────────────

class ImprovementGenerator:
    """Generates targeted improvements from analysis."""
    
    def __init__(self):
        self.analyzer = PerformanceAnalyzer()
    
    def generate_from_analysis(self, analysis: dict = None, patterns: dict = None) -> list:
        """Generate improvements based on analysis."""
        
        from datetime import timedelta
        from capabilities.analyzer import get_tasks_since, analyze_tasks, identify_patterns
        
        if analysis is None or patterns is None:
            # Run fresh analysis on ALL tasks from last 7 days
            tasks = get_tasks_since(datetime.now() - timedelta(days=7))
            analysis = analyze_tasks(tasks)
            patterns = identify_patterns(analysis)
        
        improvements = []
        
        # Process weaknesses
        for weakness in patterns.get("weaknesses", []):
            cat = weakness.get("category")
            if not cat:
                continue
            
            # Get category-specific template
            template = IMPROVEMENT_TEMPLATES.get(cat, IMPROVEMENT_TEMPLATES.get("default", {}))
            
            # Determine issue type
            if "rate" in weakness and weakness["rate"] < 0.5:
                issue_type = "low_quality"
            else:
                issue_type = "failure"
            
            if issue_type in template:
                improvement = self._create_improvement(
                    category=cat,
                    issue_type=issue_type,
                    template=template[issue_type],
                    trigger=f"Analysis: {weakness.get('task', weakness.get('reason', 'Unknown'))[:50]}",
                )
                improvements.append(improvement)
        
        # Process blind spots (suggest trying new categories)
        for blind in patterns.get("blind_spots", []):
            cat = blind.get("category")
            if cat:
                improvement = {
                    "id": f"blind_spot_{cat}_{datetime.now().strftime('%Y%m%d%H%M')}",
                    "type": "skill_need",
                    "category": cat,
                    "title": f"Explore {cat} tasks",
                    "description": f"No recent tasks in {cat}. Consider adding practice tasks.",
                    "content": f"Try at least one {cat} task per week to build capability.",
                    "confidence": 5,
                    "expected_impact": "Broader skill coverage",
                    "trigger": "Blind spot identified in analysis",
                    "auto_apply": True,
                }
                improvements.append(improvement)
        
        return improvements
    
    def _create_improvement(self, category: str, issue_type: str, template: dict, trigger: str) -> dict:
        """Create a single improvement from template."""
        
        improvement = {
            "id": f"improve_{category}_{issue_type}_{datetime.now().strftime('%Y%m%d%H%M')}",
            "type": template.get("type", "workflow"),
            "category": category,
            "title": f"Improve {category} {issue_type}",
            "description": template.get("template", ""),
            "content": template["template"],
            "confidence": 7,  # Template-based improvements get medium confidence
            "expected_impact": template.get("expected_impact", ""),
            "trigger": trigger,
            "auto_apply": True,  # Template-based are auto-apply
        }
        
        return improvement
    
    def save_improvements(self, improvements: list) -> list:
        """Save improvements to proposed directory."""
        
        saved_files = []
        
        for imp in improvements:
            timestamp = datetime.now().strftime("%Y-%m-%d-%H%M")
            filename = f"{imp['id']}.json"
            filepath = PROPOSED_DIR / filename
            
            with open(filepath, "w") as f:
                json.dump(imp, f, indent=2)
            
            saved_files.append(str(filepath))
            
            # Auto-apply if confident enough
            if imp.get("auto_apply", False) and imp.get("confidence", 0) <= AUTO_APPLY_CONFIDENCE:
                self._apply_improvement(imp)
        
        return saved_files
    
    def _apply_improvement(self, improvement: dict):
        """Apply an improvement to the system."""
        
        imp_type = improvement.get("type", "lesson")
        
        if imp_type == "lesson":
            # Add to lessons file
            self._add_lesson(improvement)
        
        elif imp_type == "workflow":
            # Add to workflow notes (stored separately for reference)
            self._add_workflow(improvement)
        
        elif imp_type == "prompt_tweak":
            # Queue for Mat approval (don't auto-apply)
            improvement["status"] = "pending_approval"
            # Don't auto-apply prompt tweaks without human approval
        
        elif imp_type == "skill_need":
            # Note the skill need for review
            self._add_skill_need(improvement)
    
    def _add_lesson(self, improvement: dict):
        """Add a lesson to the lessons file."""
        
        lessons_file = LESSONS_DIR / "learned.md"
        
        entry = f"""
## {improvement.get('title', 'Lesson')} — {datetime.now().strftime('%Y-%m-%d')}

**Category:** {improvement.get('category', 'general')}
**Trigger:** {improvement.get('trigger', 'unknown')}
**Type:** {improvement.get('type', 'lesson')}

{improvement.get('content', '')}

*Expected impact: {improvement.get('expected_impact', 'Unknown')}*
"""
        
        # Append to lessons file
        with open(lessons_file, "a") as f:
            f.write(entry)
    
    def _add_workflow(self, improvement: dict):
        """Add a workflow note."""
        
        workflow_file = LESSONS_DIR / "workflows.md"
        
        entry = f"""
### {improvement.get('title', 'Workflow')} — {datetime.now().strftime('%Y-%m-%d')}

**Category:** {improvement.get('category', 'general')}
**Confidence:** {improvement.get('confidence', 5)}/10

{improvement.get('content', '')}

*Expected impact: {improvement.get('expected_impact', 'Unknown')}*
"""
        
        with open(workflow_file, "a") as f:
            f.write(entry)
    
    def _add_skill_need(self, improvement: dict):
        """Note a skill gap."""
        
        skills_file = LESSONS_DIR / "skill_gaps.md"
        
        entry = f"""
### {improvement.get('title', 'Skill Gap')} — {datetime.now().strftime('%Y-%m-%d')}

**Category:** {improvement.get('category', 'unknown')}
**Suggested action:** {improvement.get('content', '')}

*Expected impact: {improvement.get('expected_impact', 'Unknown')}*
"""
        
        with open(skills_file, "a") as f:
            f.write(entry)
    
    def get_pending_approvals(self) -> list:
        """Get improvements that need Mat's approval."""
        
        pending = []
        
        for f in PROPOSED_DIR.glob("*.json"):
            with open(f) as fp:
                imp = json.load(fp)
                if imp.get("type") == "prompt_tweak" and imp.get("confidence", 0) > AUTO_APPLY_CONFIDENCE:
                    pending.append(imp)
        
        return pending
    
    def approve_improvement(self, improvement_id: str):
        """Mark an improvement as approved and apply it."""
        
        filepath = PROPOSED_DIR / f"{improvement_id}.json"
        
        if not filepath.exists():
            return {"error": "Improvement not found"}
        
        with open(filepath) as f:
            improvement = json.load(f)
        
        # Move to approved
        approved_path = APPROVED_DIR / f"{improvement_id}.json"
        filepath.rename(approved_path)
        
        # Apply it
        improvement["status"] = "approved"
        improvement["approved_at"] = datetime.now().isoformat()
        
        with open(approved_path, "w") as f:
            json.dump(improvement, f, indent=2)
        
        self._apply_improvement(improvement)
        
        return {"status": "approved", "improvement": improvement}
    
    def reject_improvement(self, improvement_id: str, reason: str = ""):
        """Reject an improvement."""
        
        filepath = PROPOSED_DIR / f"{improvement_id}.json"
        
        if not filepath.exists():
            return {"error": "Improvement not found"}
        
        with open(filepath) as f:
            improvement = json.load(f)
        
        # Move to rejected
        rejected_path = REJECTED_DIR / f"{improvement_id}.json"
        filepath.rename(rejected_path)
        
        improvement["status"] = "rejected"
        improvement["rejected_at"] = datetime.now().isoformat()
        improvement["rejection_reason"] = reason
        
        with open(rejected_path, "w") as f:
            json.dump(improvement, f, indent=2)
        
        return {"status": "rejected", "improvement": improvement}


# ─── CLI ────────────────────────────────────────────────────────────────────

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Improvement Generator")
    parser.add_argument("--generate", action="store_true", help="Generate improvements from latest analysis")
    parser.add_argument("--pending", action="store_true", help="Show pending approvals")
    parser.add_argument("--approve", type=str, help="Approve an improvement by ID")
    parser.add_argument("--reject", type=str, help="Reject an improvement by ID")
    parser.add_argument("--reason", type=str, default="", help="Reason for rejection")
    parser.add_argument("--show", type=str, help="Show improvement by ID")
    
    args = parser.parse_args()
    
    generator = ImprovementGenerator()
    
    if args.generate:
        # Generate improvements
        improvements = generator.generate_from_analysis()
        
        if not improvements:
            print("No improvements generated.")
            return
        
        # Save them
        saved = generator.save_improvements(improvements)
        
        print(f"\n✅ Generated {len(improvements)} improvements:")
        for imp in improvements:
            auto_tag = " [AUTO-APPLIED]" if imp.get("auto_apply") else ""
            print(f"   - [{imp['type']}] {imp['title']}{auto_tag}")
        
        print(f"\n   Saved to: {PROPOSED_DIR}")
    
    elif args.pending:
        pending = generator.get_pending_approvals()
        
        if not pending:
            print("No improvements pending approval.")
        else:
            print(f"\n📋 Pending Approvals ({len(pending)}):\n")
            for p in pending:
                print(f"   {p['id']}: {p['title']}")
    
    elif args.approve:
        result = generator.approve_improvement(args.approve)
        if "error" in result:
            print(f"❌ {result['error']}")
        else:
            print(f"✅ Approved: {result['improvement']['title']}")
    
    elif args.reject:
        result = generator.reject_improvement(args.reject, args.reason)
        if "error" in result:
            print(f"❌ {result['error']}")
        else:
            print(f"❌ Rejected: {result['improvement']['title']}")
    
    elif args.show:
        # Show improvement details
        for dir in [PROPOSED_DIR, APPROVED_DIR, REJECTED_DIR]:
            filepath = dir / f"{args.show}.json"
            if filepath.exists():
                with open(filepath) as f:
                    imp = json.load(f)
                print(f"\n# {imp.get('title', 'Improvement')}")
                print(f"**Type:** {imp.get('type')}")
                print(f"**Category:** {imp.get('category')}")
                print(f"**Confidence:** {imp.get('confidence')}/10")
                print(f"**Status:** {imp.get('status', 'proposed')}")
                print(f"\n{imp.get('content', imp.get('description', ''))}")
                return
        print("Improvement not found.")
    
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
