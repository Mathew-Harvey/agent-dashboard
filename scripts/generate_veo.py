#!/usr/bin/env python3
"""Generate a Veo video for marketing."""
import os
import sys
from google import genai
from google.genai import types

# Configure client
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

# Creative, non-sloppy prompt for PetSwap
PROMPT = """A charming, loopable scene showing a smartphone screen transforming a cat's face into a dog's face with smooth morphing animation. The phone displays the PetSwap app interface with a "SWAP!" button. Soft, natural lighting in a cozy living room. High-quality, professional marketing footage suitable for social media."""

OUTPUT_DIR = "/home/mat/.openclaw/workspace/assets"
TIMESTAMP = "20260221-0900"

def main():
    print("Generating Veo video for PetSwap marketing...")
    
    try:
        # Generate video using Veo
        operation = client.models.generate_videos(
            model="veo-3.0-generate-001",
            prompt=PROMPT,
            config=types.GenerateVideosConfig(
                aspect_ratio="16:9",
                number_of_videos=1,
                duration_seconds=8
            )
        )
        
        # Wait for completion
        result = operation.result()
        
        # Get the generated video
        video = result.generated_videos[0]
        
        # Download video
        video_uri = video.uri
        output_path = os.path.join(OUTPUT_DIR, f"petswap-veo-{TIMESTAMP}.mp4")
        
        # Download the video
        client.files.download(uri=video_uri, name=output_path)
        
        print(f"Video saved to: {output_path}")
        print(f"Video URI: {video_uri}")
        
    except Exception as e:
        error_msg = str(e)
        print(f"Error: {error_msg}")
        
        # Check for quota error
        if "quota" in error_msg.lower() or "resource exhausted" in error_msg.lower() or "429" in error_msg:
            print("QUOTA_HIT: Daily Veo quota exhausted")
            sys.exit(1)
        else:
            raise

if __name__ == "__main__":
    main()
