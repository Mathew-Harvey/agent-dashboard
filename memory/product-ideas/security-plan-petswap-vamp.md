# Security Plan: PetSwap & VAMP

## Data We Collect

### PetSwap (Home Swap with Pets)
- User accounts: name, email, password
- Property listings: address, photos, description
- Pet details: names, photos, care instructions
- Contact info between matched swaps

### VAMP (Marine Asset Management)
- Vessel owner details
- Vessel specifications, location
- Compliance documents
- Maintenance records

---

## Security Risks

| Risk | Likelihood | Impact | Priority |
|------|------------|--------|----------|
| Data breach exposing client addresses | Medium | High | 🔴 |
| Identity theft (fake listings) | Medium | High | 🔴 |
| Unauthorized property access | Low | Medium | 🟡 |
| Payment fraud | Low | High | 🟡 |
| Privacy violations (GDPR/Privacy Act) | Medium | High | 🔴 |

---

## Mitigation Strategy

### 1. Data Minimization
- **Only collect what's essential**
- Don't store full addresses publicly — show city/region only until match confirmed
- Don't store ID documents unless absolutely necessary
- Delete inactive accounts after X months

### 2. Encryption
- **HTTPS everywhere** (force SSL)
- **Encrypt sensitive data at rest** (AES-256)
- Hash passwords (bcrypt/argon2)
- Don't log PII

### 3. Authentication
- Strong password requirements
- 2FA optional but recommended
- Session timeouts
- Rate limiting on auth endpoints

### 4. Access Control
- Role-based access (admin vs user)
- Property owners can only edit their own listings
- API keys rotated regularly
- IP allowlisting for admin areas

### 5. Privacy Compliance

**Australia (Privacy Act 1988):**
- Collection notice — tell people what we collect
- Use/disclose only for intended purpose
- Cross-border disclosure (if hosting abroad)
- Right to access/correct (GDPR-style)
- Notifiable data breaches scheme

**GDPR (for UK/EU users):**
- Lawful basis for processing
- Right to erasure ("right to be forgotten")
- Data portability
- Consent management

### 6. Fraud Prevention
- Verify ownership before publishing listings
- Email verification required
- Flag suspicious patterns
- Manual review queue for new listings

### 7. Incident Response
- Have a breach notification plan
- Know when to report to OAIC (Australia)
- 72-hour notification requirement

---

## Action Items

### Before Launch

| Task | Priority | Effort |
|------|----------|--------|
| Implement HTTPS everywhere | 🔴 | Low |
| Set up database encryption | 🔴 | Medium |
| Add GDPR compliance (erasure, export) | 🔴 | Medium |
| Write Privacy Policy | 🔴 | Low |
| Add Terms of Service | 🔴 | Low |
| Set up secure headers (CSP, HSTS) | 🟡 | Low |
| Rate limiting on auth | 🟡 | Low |

### After Launch

| Task | Priority | Effort |
|------|----------|--------|
| Regular security audits | 🟡 | Medium |
| Penetration testing | 🟡 | Medium |
| Monitor for breaches | 🟡 | Ongoing |
| Backup strategy | 🟡 | Low |

---

## Quick Wins (Before Any Public Launch)

1. **Privacy Policy page** — must have
2. **Cookie consent** — GDPR requirement
3. **Email verification** — reduces spam/fake accounts
4. **Don't show exact addresses** — use approximate location
5. **Hash all passwords** — not plaintext

---

## Hosting Security

- Keep dependencies updated
- Use environment variables for secrets
- Don't commit `.env` to git
- Use Cloudflare for DDoS protection
- Consider WAF (Web Application Firewall)

---

*Created: 2026-02-16*
*Review: Before any public launch*
