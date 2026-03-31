#!/bin/bash
# Mat's Smart Lighting Schedule - Sleep Hygiene Optimized

OPENHUE=/home/linuxbrew/.linuxbrew/bin/openhue
MODE=$1

case "$MODE" in
  "morning-wake")
    # 6 AM - Gentle wake-up light (cool, 30% → 70%)
    $OPENHUE set room "Home" --on --brightness 30 --temperature 250
    sleep 600  # 10 min
    $OPENHUE set room "Home" --brightness 70 --temperature 250
    ;;
    
  "morning-off")
    # 6:30 AM - Turn off after wake-up complete
    $OPENHUE set room "Home" --off
    ;;
    
  "afternoon-focus")
    # 2 PM - Comp desk for work (bright, cool)
    $OPENHUE set light "Comp desk" --on --brightness 100 --temperature 200
    ;;
    
  "evening-transition")
    # 6 PM - Start warming lights for evening
    $OPENHUE set room "Home" --on --brightness 80 --temperature 300
    ;;
    
  "night-wind-down")
    # 8 PM - Warm dim for relaxation
    $OPENHUE set room "Home" --on --brightness 60 --temperature 400
    ;;
    
  "bedtime-prep")
    # 10 PM - Very warm, very dim (melatonin-friendly)
    $OPENHUE set room "Home" --on --brightness 30 --temperature 450
    ;;
    
  "lights-out")
    # 10:30 PM - Bedtime, all off
    $OPENHUE set room "Home" --off
    ;;
    
  *)
    echo "Usage: $0 {morning-wake|morning-off|afternoon-focus|evening-transition|night-wind-down|bedtime-prep|lights-out}"
    exit 1
    ;;
esac
