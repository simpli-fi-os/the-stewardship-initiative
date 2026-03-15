# TSI Architecture & Technical Notes

## Current State (Alpha Prototype)

The alpha is a collection of static PHP pages served from a single directory. There is no build step, no framework, and no database. Tailwind CSS is loaded via the Play CDN, and all interactivity is vanilla JavaScript.

The Village Church directory (village-directory.php) currently uses **hardcoded demo data** in a JavaScript array. The next milestone is wiring this to the Notion API.

## Notion Integration Design

### Data Flow

1. Church Admin duplicates Notion template
2. Creates integration, submits API key + DB ID to TSI
3. TSI validates credentials against Notion API
4. Stores encrypted config
5. On directory page load, queries Notion API with stored credentials
6. Caches results (suggested: 5-minute TTL)
7. Returns JSON to frontend for rendering

### Notion Database Schema (Template)

| Property | Type | Purpose |
|----------|------|---------|
| Name | Title | Member's full name |
| Title/Role | Rich Text | Professional title or church role |
| Skills | Multi-select | Categorized skills/giftings |
| Description | Rich Text | What they can help with |
| Bio | Rich Text | Personal background |
| Email | Email | Contact email |
| Phone | Phone | Optional contact phone |
| Photo | Files & Media | Profile photo |
| Available | Checkbox | Currently accepting requests |
| Campus/Location | Select | For multi-campus churches |

### Security Considerations

- API keys encrypted at rest (AES-256 or similar)
- API keys never exposed to the browser (all Notion calls server-side)
- Each church's integration has read-only permissions
- Rate limiting on the connect form
- CSRF tokens on all forms

## Multi-Tenant Architecture (Future)

### Option A: Slug-Based Routing (Recommended)

```
thestewardshipinitiative.org/d/village-church
thestewardshipinitiative.org/d/watermark-church
```

A single directory.php reads the slug, looks up the stored config, and queries the appropriate Notion database. Works on any shared hosting, zero DNS configuration per church.

### Option B: Subdomain Routing

```
village-church.thestewardshipinitiative.org
watermark-church.thestewardshipinitiative.org
```

More complex DNS/hosting setup but cleaner URLs. Reserved for White-Label tier ($199/mo).

## White-Label Customization

The Village Church directory demonstrates the customization model:
- Church-specific color palette (TVC's navy/gray vs TSI's Garden of Eden)
- Church logo and hero imagery
- Custom messaging and scripture references
- Church-branded email domains

Future: A configuration object per church drives theme colors, logo URL, hero image, and messaging.

## Production Readiness Checklist

- [ ] Replace Tailwind CDN with compiled CSS (PostCSS build)
- [ ] Add .env configuration management
- [ ] Server-side Notion API proxy with caching
- [ ] Encrypted credential storage
- [ ] CSRF protection on all forms
- [ ] Input validation and sanitization
- [ ] Error pages (404, 500)
- [ ] SSL/TLS enforcement
- [ ] Content Security Policy headers
- [ ] Analytics integration
- [ ] Automated deployment pipeline (Vercel)

## File Versioning Convention

Files with version suffixes (e.g., find-resources_1_0_.php) represent earlier iterations. In this repo, these are renamed descriptively (e.g., find-resources-v1.php). The un-suffixed file is always the current version.

---

*Last updated: March 15, 2026*
