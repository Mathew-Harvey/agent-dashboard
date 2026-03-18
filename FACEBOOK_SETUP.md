# Facebook Page Posting Setup

## What You Need

To post to The Bodyweight Gym Facebook page automatically, you need:

1. **Facebook Page ID**
2. **Page Access Token** (long-lived)

---

## Step-by-Step Setup

### 1. Get Your Page ID

**Option A: From Page Settings (easiest)**
1. Go to your Facebook Page: https://www.facebook.com/thebodyweightgym.com.au/
2. Click "Settings" (left sidebar)
3. Click "Page Info" (left sidebar)
4. Your Page ID is shown at the bottom

**Option B: From URL**
1. Go to your Page
2. Click "About"
3. Your Page ID is in the URL or at the bottom of the About section

### 2. Get a Page Access Token

1. Go to **Meta for Developers**: https://developers.facebook.com/
2. Click **My Apps** (top right)
3. Create a new app OR use an existing one:
   - **Type**: Business
   - **Name**: "The Bodyweight Gym Auto-Poster" (or similar)
4. In your app dashboard:
   - Add **Facebook Login** product (if not already added)
   - Go to **Tools** → **Graph API Explorer**
5. In Graph API Explorer:
   - Select your app from the dropdown
   - Click **User or Page** → select your Page
   - Under **Permissions**, add: `pages_manage_posts`, `pages_read_engagement`
   - Click **Generate Access Token**
   - Copy the token (it's temporary for now)

### 3. Make the Token Long-Lived

Temporary tokens expire in 1-2 hours. Convert to long-lived (60 days):

```bash
# Replace YOUR_APP_ID, YOUR_APP_SECRET, and SHORT_TOKEN
curl -G \
  -d "grant_type=fb_exchange_token" \
  -d "client_id=YOUR_APP_ID" \
  -d "client_secret=YOUR_APP_SECRET" \
  -d "fb_exchange_token=SHORT_TOKEN" \
  https://graph.facebook.com/v21.0/oauth/access_token
```

The response will include a `access_token` — copy it.

### 4. Get a Page Token from the Long-Lived User Token

```bash
# Replace PAGE_ID and LONG_LIVED_USER_TOKEN
curl -G \
  -d "access_token=LONG_LIVED_USER_TOKEN" \
  https://graph.facebook.com/v21.0/PAGE_ID?fields=access_token
```

This gives you a **Page Access Token** that doesn't expire (as long as the app remains active).

---

## 5. Add Credentials to .env

Open `/home/mat/.openclaw/workspace/.env` and add:

```bash
# Facebook Page credentials for The Bodyweight Gym
FB_PAGE_ID="your_page_id_here"
FB_PAGE_ACCESS_TOKEN="your_page_access_token_here"
```

**⚠️ Never commit .env to git!** (It's already in .gitignore)

---

## Test the Setup

```bash
cd /home/mat/.openclaw/workspace
./scripts/post-to-facebook.sh "Test post from Jeff 🐧"
```

If successful, you'll see: `✅ Posted to Facebook! Post ID: ...`

---

## What Happens Next

Once credentials are in `.env`:
- The daily cron job (9 AM AWST) will automatically post to **both X and Facebook**
- Script: `/home/mat/.openclaw/workspace/scripts/daily-x-sales-post.sh`
- Logs: `/home/mat/.openclaw/workspace/memory/marketing/x-posts.md`

---

## Troubleshooting

**"Invalid OAuth access token"**
→ Token expired or wrong permissions. Regenerate with `pages_manage_posts` permission.

**"(#200) Permissions error"**
→ Your app doesn't have permission to post. Add `pages_manage_posts` in Graph API Explorer.

**"Invalid parameter"**
→ Check that FB_PAGE_ID is correct (numeric ID, not vanity URL).

---

Once you've added the credentials to `.env`, let me know and I'll test it!
