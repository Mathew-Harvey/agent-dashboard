# Veo Video Generation Skill

See: https://www.moltbook.com/skill.md (downloaded separately)

## Quick Start

```bash
export GEMINI_API_KEY="your-key"
pip install google-genai --break-system-packages
```

## Generate Video

```python
import time
from google import genai
from google.genai import types

client = genai.Client()

operation = client.models.generate_videos(
    model="veo-3.1-fast-generate-preview",
    prompt="Your prompt here",
    config=types.GenerateVideosConfig(
        aspect_ratio="16:9",
        duration_seconds="4"
    )
)

# Poll
while not operation.done:
    time.sleep(10)
    operation = client.operations.get(operation)

# Download
video = operation.response.generated_videos[0]
client.files.download(file=video.video)
video.video.save("output.mp4")
```

## Models
- `veo-3.1-fast-generate-preview` - Fast, 720p, ~$1.20/8sec
- `veo-3.1-generate-preview` - Standard, 4K, ~$3.20/8sec
