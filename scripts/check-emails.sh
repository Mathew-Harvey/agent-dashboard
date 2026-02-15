#!/bin/bash
# Check both AgentMail and Gmail for unread emails

AGENTMAIL_KEY="am_0c4fe254a60572f60c1535b9b6ffd1861616a29401f103cb9b5089d41740dcab"

echo "=== AgentMail (jeff-assistant@agentmail.to) ==="
cd /tmp
source agentmail-env/bin/activate 2>/dev/null || true
python3 -c "
from agentmail import AgentMail
client = AgentMail(api_key='$AGENTMAIL_KEY')
msgs = client.inboxes.messages.list(inbox_id='jeff-assistant@agentmail.to')
print(f'Unread: {msgs.count}')
for m in msgs.messages:
    print(f'  - {m.subject} from {m.from_}')
" 2>&1 | grep -v Warning | grep -v "Core Pydantic"

echo ""
echo "=== Gmail (mathewharvey@gmail.com) ==="
gog gmail search "in:inbox is:unread newer_than:2h" 2>&1 | head -20
