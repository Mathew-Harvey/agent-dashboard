# The Bodyweight Gym — Sales Funnel Plan

## Current State

**What Already Works:**
- Landing pages deployed (muscleup-landing.onrender.com, handstand-landingpage.onrender.com)
- Checkout endpoint exists (`/api/create-checkout`)
- Thank-you page with account creation (`/thank-you.html`)
- Tracker user creation API (`/api/create-tracker-user`)
- Email template for login credentials

**What's Missing (Tonight):**
- Stripe keys (`STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`)
- Email sending keys (`RESEND_API_KEY` or `SENDGRID_API_KEY`)

---

## The Funnel Flow

```
┌─────────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Free Video Site    │────▶│  Landing Page   │────▶│  Stripe Checkout│
│  (traffic source)  │     │ ($19 product)   │     │  (hosted by     │
└─────────────────────┘     └──────────────────┘     │   Stripe)       │
                                                       └────────┬────────┘
                                                                │
                                                                ▼
┌─────────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Tracker App        │◀────│  Thank You Page  │◀────│  Payment        │
│  (user account)     │     │  (create account)│     │  Success        │
└─────────────────────┘     └──────────────────┘     └─────────────────┘
```

---

## What Mat Needs to Do Tonight

### 1. Set Up Stripe

**Option A: Via Maton (recommended)**
- Already have the stripe skill installed
- Need to create a Stripe connection via Maton dashboard
- Get the API key

**Option B: Direct Stripe**
- Go to stripe.com, create account
- Create a **Product** (e.g., "Ring Muscle Up Guide")
- Create a **Price** ($19 AUD one-time)
- Get `STRIPE_SECRET_KEY` from Developers → API keys
- Set env vars in Render for both landing pages

### 2. Configure Email (One of these)

**Option A: Resend (easiest)**
- Sign up at resend.com (free tier: 3,000 emails/month)
- Get API key → `RESEND_API_KEY`
- Set `EMAIL_FROM` = "The Bodyweight Gym <noreply@yourdomain.com>"

**Option B: SendGrid**
- Similar setup, get SENDGRID_API_KEY

### 3. Environment Variables to Set

In **Render** for both landing pages:

```
STRIPE_SECRET_KEY   = sk_live_xxxxx (or sk_test_xxxxx)
STRIPE_PRICE_ID     = price_xxxxx
RESEND_API_KEY      = re_xxxxx
EMAIL_FROM          = The Bodyweight Gym <noreply@yourdomain.com>
TRACKER_API_URL     = https://muscleup-api.onrender.com/api/users
TRACKER_API_SECRET  = (from muscleup-api env)
TRACKER_LOGIN_URL   = https://muscleup-web.onrender.com/login
SITE_URL            = https://muscleup-landing.onrender.com
```

---

## What I Can Do Once Keys Are Set

1. **Monitor payments** — Check Stripe charges via API, log sales
2. **Send follow-up emails** — Welcome序列, cross-sell handstand guide to muscle-up buyers
3. **Track conversions** — Log each sale to memory/daily-sales.md
4. **A/B test** — Different landing page variants, track which converts
5. **Automated receipts** — Send receipt + download link via email

---

## Revenue Tracking

I'll log all sales to `memory/daily-sales.md`:
```
## YYYY-MM-DD

### Sales
- Ring Muscle Up: $19 × 2 = $38 (Stripe ch_xxx, ch_yyy)
- Handstand: $19 × 1 = $19 (Stripe ch_zzz)

### Total: $57
```

---

## Marketing Funnel Starting Points

**Phase 1: Free Content**
- **thebodyweightgym.org** — Free training videos, CTAs to paid products
- Reddit posts (false grip, progressions)
- YouTube shorts / long-form
- Instagram reels

**Phase 2: Capture**
- CTA → landing page

**Phase 3: Convert**
- $19 purchase → Stripe → tracker app access

**Phase 4: Upsell**
- After purchase: email with handstand guide offer

---

## Skills I Need to Learn/Set Up

| Skill | Purpose | Status |
|-------|---------|--------|
| Stripe API (via Maton) | Monitor charges, list payments | Ready to use |
| Resend/SendGrid | Send emails programmatically | Need API key |
| Render API | Check deployment status | Available |
| Webhook handling | Real-time payment notifications | Need Stripe webhook setup |

---

## Next Steps After Mat Finishes Tonight

1. Test the full purchase flow (buy own product)
2. Verify email arrives with login details
3. Log into tracker app successfully
4. I'll start monitoring for new sales

---

## Questions for Mat

1. Do you have a domain for the email sender? (Resend needs verified domain for production, but can use test domain for dev)
