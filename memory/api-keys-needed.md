# API Keys Needed

## Currently Have ✅

| Service | Key | Status |
|---------|-----|--------|
| X/Twitter | Full OAuth + Bearer | ✅ Working |
| Tavily (search) | tvly-prod-xxx | ✅ Working |
| Chatr.ai | chatr_xxx | ✅ Working |
| AgentMail | am_xxx | ✅ Working |
| Moltbook | moltbook_sk_xxx | ✅ Working |
| Maton (Stripe) | iwfzQnM... | ✅ Working |
| Cloudflare | Two tokens set | ✅ Working |

## Need From You 🔑

### 1. Stripe (for Bodyweight Gym payments)

**What for:** Process $19 payments for Ring Muscle Up + Handstand guides

**How to get:**
1. Go to [stripe.com](https://stripe.com) — sign up or log in
2. Go to **Developers → API keys**
3. Copy **Secret Key** (starts with `sk_live_` or `sk_test_`)
4. Also need: Create a Product ($19), get the **Price ID** (starts with `price_`)

**What to give me:**
- `STRIPE_SECRET_KEY` = sk_live_xxxxx
- `STRIPE_PRICE_ID` = price_xxxxx

---

### 2. Resend (for email delivery)

**What for:** Send login credentials to customers after purchase

**How to get:**
1. Go to [resend.com](https://resend.com) — sign up
2. Verify your email (or add a domain later for production)
3. Go to **API Keys** → Create API Key
4. Copy the key

**What to give me:**
- `RESEND_API_KEY` = re_xxxxx
- `EMAIL_FROM` = "The Bodyweight Gym <noreply@yourdomain.com>"

---

### 3. Reddit (for posting)

**What for:** Automated Reddit marketing (if you want it)

**How to get:**
1. Go to [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps)
2. Click **Create App** → Script
3. Fill in name, description, about URL
4. Copy **Client ID** (under app name) and **Client Secret**

**What to give me:**
- `REDDIT_CLIENT_ID` = xxxxx
- `REDDIT_CLIENT_SECRET` = xxxxx

---

## Optional (Nice to Have)

### 4. OpenAI (for image generation)

**What for:** GPT-image, DALL-E (currently using Veo)

**How to get:**
1. Go to [platform.openai.com](https://platform.openai.com) → API Keys
2. Create new key, set budget
3. Copy

---

## Quick Summary

**Priority:**
1. **Stripe** — enables $19 revenue
2. **Resend** — delivers product to customers

Once you have these two, I can start making sales!

---

## How to Give Me Keys

Best way — add to Render env vars for the landing pages:

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Find `muscleup-landing` and `handstand-landingpage` services
3. Go to **Environment** → Add environment variables:
   - `STRIPE_SECRET_KEY` = sk_live_xxx
   - `STRIPE_PRICE_ID` = price_xxx
   - `RESEND_API_KEY` = re_xxx
   - `EMAIL_FROM` = "The Bodyweight Gym <noreply@yourdomain.com>"

Or tell me and I'll add them locally for testing.
