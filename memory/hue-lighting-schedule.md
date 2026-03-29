# Mat's Smart Lighting Schedule - Sleep Hygiene Optimized

## Overview
Automated lighting schedule based on circadian rhythm and sleep hygiene best practices. Warm light in evening reduces blue light exposure, helping melatonin production.

## Daily Schedule (Perth Time - AWST/GMT+8)

| Time | Action | Brightness | Temperature | Purpose |
|------|--------|------------|-------------|---------|
| **6:00 AM** | Morning wake | 30% → 70% (gradual over 10min) | Cool (250 mirek) | Gentle wake-up, alertness |
| **2:00 PM** | Comp desk on | 100% | Very cool (200 mirek) | Afternoon focus/work |
| **6:00 PM** | Evening transition | 80% | Warm (300 mirek) | Evening relaxation |
| **8:00 PM** | Night wind-down | 60% | Warmer (400 mirek) | Relaxation mode |
| **10:00 PM** | Bedtime prep | 30% | Very warm (450 mirek) | Melatonin-friendly |
| **11:00 PM** | Lights out | OFF | - | Bedtime |

## Color Temperature Guide
- **153-250 mirek** = Cool white (daylight, focus)
- **300-350 mirek** = Neutral white (relaxed)
- **400-500 mirek** = Warm white (evening, sleep prep)

Lower mirek = cooler/bluer (alertness)
Higher mirek = warmer/yellower (relaxation)

## Manual Control
```bash
# Test the schedule manually
/home/mat/.openclaw/workspace/scripts/hue-automation/lighting-schedule.sh morning-wake
/home/mat/.openclaw/workspace/scripts/hue-automation/lighting-schedule.sh afternoon-focus
/home/mat/.openclaw/workspace/scripts/hue-automation/lighting-schedule.sh evening-transition
/home/mat/.openclaw/workspace/scripts/hue-automation/lighting-schedule.sh night-wind-down
/home/mat/.openclaw/workspace/scripts/hue-automation/lighting-schedule.sh bedtime-prep
/home/mat/.openclaw/workspace/scripts/hue-automation/lighting-schedule.sh lights-out
```

## Check Timer Status
```bash
systemctl --user list-timers | grep hue
```

## Disable/Enable Timers
```bash
# Disable all
systemctl --user stop hue-*.timer
systemctl --user disable hue-*.timer

# Enable all
systemctl --user enable hue-*.timer
systemctl --user start hue-*.timer
```

## Sleep Hygiene Science
- **Blue light suppresses melatonin** - avoid cool white light 2-3 hours before bed
- **Warm light in evening** - helps natural melatonin production
- **Gradual dimming** - signals body it's time to wind down
- **Consistent bedtime** - 11 PM daily helps regulate circadian rhythm
- **Morning bright light** - helps wake up and reset circadian clock

## Files
- Schedule script: `/home/mat/.openclaw/workspace/scripts/hue-automation/lighting-schedule.sh`
- Systemd timers: `/home/mat/.config/systemd/user/hue-*.timer`
- Systemd services: `/home/mat/.config/systemd/user/hue-*.service`
