#!/usr/bin/env python3
"""
Self-Improvement Cron Jobs
===========================
Automated analysis and improvement generation.
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from capabilities.analyzer import PerformanceAnalyzer
from capabilities.improvement_generator import ImprovementGenerator


def run_analysis():
    """Run performance analysis."""
    print("🔍 Running performance analysis...")
    
    analyzer = PerformanceAnalyzer()
    
    # Check if we should analyze
    should, reason = analyzer.should_analyze()
    
    if not should:
        print(f"⏭️  Skipping: {reason}")
        return {"status": "skipped", "reason": reason}
    
    # Run analysis
    result = analyzer.analyze(trigger="cron")
    
    print(f"✅ Analyzed {result['tasks_analyzed']} tasks")
    print(f"   Saved to: {result['reflection_file']}")
    
    return result


def run_improvement_generation():
    """Generate improvements from latest analysis."""
    print("💡 Generating improvements...")
    
    generator = ImprovementGenerator()
    improvements = generator.generate_from_analysis()
    
    if not improvements:
        print("⏭️  No improvements to generate")
        return {"status": "skipped", "reason": "no_improvements"}
    
    # Save (auto-applies low-confidence)
    saved = generator.save_improvements(improvements)
    
    auto_applied = sum(1 for imp in improvements if imp.get("auto_apply"))
    
    print(f"✅ Generated {len(improvements)} improvements")
    print(f"   Auto-applied: {auto_applied}")
    print(f"   Pending approval: {len(improvements) - auto_applied}")
    
    return {
        "status": "complete",
        "generated": len(improvements),
        "auto_applied": auto_applied,
        "pending": len(improvements) - auto_applied,
    }


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Self-Improvement Cron")
    parser.add_argument("--analyze", action="store_true", help="Run analysis")
    parser.add_argument("--improve", action="store_true", help="Generate improvements")
    parser.add_argument("--all", action="store_true", help="Run full pipeline")
    
    args = parser.parse_args()
    
    if args.all:
        # Full pipeline: analyze then generate
        result1 = run_analysis()
        if result1.get("status") != "skipped":
            result2 = run_improvement_generation()
    elif args.analyze:
        run_analysis()
    elif args.improve:
        run_improvement_generation()
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
