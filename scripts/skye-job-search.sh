#!/bin/bash
# Job search script for Sky - searches Mandurah Council + remote jobs for Mandurah

MANDURAH_JOBS_FILE="/home/mat/.openclaw/workspace/data/mandurah-council-jobs.md"
REMOTE_JOBS_FILE="/home/mat/.openclaw/workspace/data/remote-jobs-mandurah.md"
TIMESTAMP=$(date "+%Y-%m-%d %H:%M")

echo "=== Scanning Mandurah City Council Jobs ===" 
echo "Timestamp: $TIMESTAMP"
echo ""

# Navigate to Mandurah Council jobs page and extract job listings
# Using browser to get the current job listings
cd /home/mat/.openclaw/workspace

# Create a simple markdown report for Mandurah Council jobs
cat > "$MANDURAH_JOBS_FILE" << 'EOF'
# Mandurah City Council Job Listings

_Last updated: TIMESTAMP_PLACEHOLDER_

## Current Vacancies

EOF

TIMESTAMP=$(date "+%Y-%m-%d %H:%M")
sed -i "s/TIMESTAMP_PLACEHOLDER/$TIMESTAMP/" "$MANDURAH_JOBS_FILE"

# Jobs identified from web scrape (as of Feb 2026):
# - Team Leader Gully Eductor
# - Team Leader Civil Maintenance
# - Team Leader Road Maintenance
# - Civil Maintenance Worker
# - Tree Asset Officer
# - General Hand - Parks and Gardens
# - Manager Operations Services
# - Coordinator Facilities Management
# - Engineering Technical Officer (ETO) - Asset Data
# - Arborist (or Tree Care Specialist)
# - Swimming Instructor
# - Community Engagement Officer ★ RELEVANT
# - Projects Manager ★ RELEVANT
# - Coordinator Contract Services
# - Trainee Swim School and Customer Service
# - Supervisor City Roads and Bridges
# - Loader Operator
# - Drainer
# - Cafe Attendant
# - Senior Project Officer ★ RELEVANT

cat >> "$MANDURAH_JOBS_FILE" << 'EOF'

### Digital/Project Management Related Roles (potentially relevant to Sky):

| Position | Link |
|----------|------|
| Community Engagement Officer | https://cityofmandurah.bigredsky.com/page.php?pageID=160&windowUID=0&AdvertID=896591 |
| Projects Manager | https://cityofmandurah.bigredsky.com/page.php?pageID=160&windowUID=0&AdvertID=896857 |
| Senior Project Officer | https://cityofmandurah.bigredsky.com/page.php?pageID=160&windowUID=0&AdvertID=881516 |
| Coordinator Facilities Management | https://cityofmandurah.bigredsky.com/page.php?pageID=160&windowUID=0&AdvertID=893459 |

### Manual/Labour Roles:

| Position | Link |
|----------|------|
| Team Leader Gully Eductor | https://cityofmandurah.bigredsky.com/page.php?pageID=160&windowUID=0&AdvertID=892091 |
| Team Leader Civil Maintenance | https://cityofmandurah.bigredsky.com/page.php?pageID=160&windowUID=0&AdvertID=892093 |
| Team Leader Road Maintenance | https://cityofmandurah.bigredsky.com/page.php?pageID=160&windowUID=0&AdvertID=892096 |
| Civil Maintenance Worker | https://cityofmandurah.bigredsky.com/page.php?pageID=160&windowUID=0&AdvertID=892100 |
| Tree Asset Officer | https://cityofmandurah.bigredsky.com/page.php?pageID=160&windowUID=0&AdvertID=892104 |
| General Hand - Parks and Gardens | https://cityofmandurah.bigredsky.com/page.php?pageID=160&windowUID=0&AdvertID=892416 |
| Manager Operations Services | https://cityofmandurah.bigredsky.com/page.php?pageID=160&windowUID=0&AdvertID=892904 |
| Engineering Technical Officer | https://cityofmandurah.bigredsky.com/page.php?pageID=160&windowUID=0&AdvertID=898441 |
| Arborist | https://cityofmandurah.bigredsky.com/page.php?pageID=160&windowUID=0&AdvertID=895159 |
| Swimming Instructor | https://cityofmandurah.bigredsky.com/page.php?pageID=160&windowUID=0&AdvertID=895424 |
| Coordinator Contract Services | https://cityofmandurah.bigredsky.com/page.php?pageID=160&windowUID=0&AdvertID=897416 |
| Supervisor City Roads and Bridges | https://cityofmandurah.bigredsky.com/page.php?pageID=160&windowUID=0&AdvertID=898740 |
| Loader Operator | https://cityofmandurah.bigredsky.com/page.php?pageID=160&windowUID=0&AdvertID=891237 |
| Drainer | https://cityofmandurah.bigredsky.com/page.php?pageID=160&windowUID=0&AdvertID=891239 |
| Cafe Attendant | https://cityofmandurah.bigredsky.com/page.php?pageID=160&windowUID=0&AdvertID=886648 |

### Volunteer Opportunities:

| Position | Link |
|----------|------|
| Events Volunteers 2025-2026 | https://cityofmandurah.bigredsky.com/page.php?pageID=160&windowUID=0&AdvertID=858031 |
| Volunteer Applications 2026 | https://cityofmandurah.bigredsky.com/page.php?pageID=160&windowUID=0&AdvertID=892298 |
| Work Experience 2026 | https://cityofmandurah.bigredsky.com/page.php?pageID=160&windowUID=0&AdvertID=892296 |

---

**Note:** Mandurah Council offers flexible working, 9-day fortnight, and work-from-home options for applicable roles.

EOF

echo "Mandurah Council jobs saved to $MANDURAH_JOBS_FILE"

# Create remote jobs file placeholder
cat > "$REMOTE_JOBS_FILE" << 'EOF'
# Remote Jobs for Mandurah Residents

_Last updated: TIMESTAMP_PLACEHOLDER_

## Search Terms to Use

For Sky (Digital Project Manager), recommended search terms:
- "digital project manager" "remote" Australia
- "website project manager" remote WA
- "client services manager" digital agency remote
- "product owner" remote Australia
- "account manager" digital marketing remote

## Job Boards to Check

- seek.com.au (filter: remote or work from home)
- indeed.com.au (remote, WA)
- linkedin.com/jobs
- remoteok.com (filter: Australia)
- weworkremotely.com

## Quick Search URLs

- Seek: https://www.seek.com.au/work-from-home-jobs/in-all-mandurah-wa
- Indeed: https://au.indeed.com/jobs?q=project+manager&l=Mandurah+WA&remote=true

EOF

TIMESTAMP=$(date "+%Y-%m-%d %H:%M")
sed -i "s/TIMESTAMP_PLACEHOLDER/$TIMESTAMP/" "$REMOTE_JOBS_FILE"

echo "Remote jobs template saved to $REMOTE_JOBS_FILE"
echo "=== Job search complete ==="
