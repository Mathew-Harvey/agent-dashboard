# Stripe Payment Links

Created: 2026-02-17

## Services

| Service | Price | Payment Link |
|---------|-------|--------------|
| Domain Connection | $150 | https://buy.stripe.com/3cI00j24x6Al4xuaAA4ZG00 |
| AI Automation (Starter) | $297/mo | https://buy.stripe.com/00w6oH9wZ0bX5By8ss4ZG01 |

## How to Create New Payment Links

```bash
# API key is stored in .env as STRIPE_API_KEY
# unit_amount is in cents (15000 = $150.00 AUD)

curl -s -X POST "https://api.stripe.com/v1/payment_links" \
  -u "$STRIPE_API_KEY:" \
  -d "line_items[0][price_data][currency]=aud" \
  -d "line_items[0][price_data][product_data][name]=Service Name" \
  -d "line_items[0][price_data][product_data][description]=Description" \
  -d "line_items[0][price_data][unit_amount]=15000" \
  -d "line_items[0][quantity]=1"
```
