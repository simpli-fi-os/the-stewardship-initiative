# TSI Architecture & Technical Notes

## Current State (Alpha Prototype)

The alpha is a collection of static PHP pages served from a single directory. There is no build step, no framework, and no database. Tailwind CSS is loaded via the Play CDN, and all interactivity is vanilla JavaScript.

The Village Church directory (`village-directory.php`) currently uses **hardcoded demo data** in a JavaScript array. The next milestone is wiring this to the Notion API.

## Notion Integration Design

### Data Flow

```
Church Admin                    TSI Web App                     Notion API
     │                              │                               │
     │  1. Duplicates template      │                               │
     │─────────────────────────────►│                               │
     │                              │                               │
     │  2. Creates integration      │                               │
     │  3. Submits API key + DB ID  │                               │
     │─────────────────────────────►│                               │
     │                              │  4. Validates credentials     │
     │                              │─────────────────────────────►│
     │                              │                               │
     │                              │  5. Stores encrypted config   │
     │                              │                               │
     │                              │                               │
Member visits directory             │                               │
     │─────────────────────────────►│  6. Queries Notion DB         │
     │                              │─────────────────────────────►│
     │                              │  7. Returns filtered results  │
     │  8. Renders cards            │◄─────────────────────────────│
     │◄─────────────────────────────│                               │
```

### Notion Database Schema (Template)

The master template should include these properties:

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
| Available | Checkbox | Whether currently accepting requests |
| Campus/Location | Select | For multi-campus churches |

### API Integration (Planned)

The backend PHP layer will:

1. Accept `POST` from `connect.php` with API key + Database ID
2. Validate the credentials against Notion's API
3. Store the encrypted config (API key encrypted at rest, DB ID in plaintext)
4. Generate a unique slug for the church's directory URL
5. On directory page load, query Notion API with the stored credentials
6. Cache results for a configurable TTL (suggested: 5 minutes)
7. Return JSON to the frontend for rendering

### Security Considerations

- API keys must be **encrypted at rest** (AES-256 or similar)
- API keys are **never exposed to the browser** — all Notion calls happen server-side
- Each church's integration has **read-only** permissions
- Rate limiting on the connect form to prevent abuse
- CSRF tokens on all forms

## Multi-Tenant Architecture (Future)

Each church gets a unique directory URL. Two approaches under consideration:

### Option A: Slug-Based Routing
```
thestewardshipinitiative.org/d/village-church
thestewardshipinitiative.org/d/watermark-church
```
A single `directory.php` reads the slug, looks up the stored config, and queries the appropriate Notion database.

### Option B: Subdomain Routing
```
village-church.thestewardshipinitiative.org
watermark-church.thestewardshipinitiative.org
```
More complex DNS/hosting setup but cleaner URLs.

**Recommendation**: Start with Option A (slug-based). It works on any shared hosting and requires zero DNS configuration per church.

## White-Label Customization

The Village Church directory (`village-directory.php`) demonstrates the customization model:
- Church-specific color palette (TVC's navy/gray scheme vs. TSI's Garden of Eden palette)
- Church logo and hero imagery
- Custom messaging and scripture references
- Church-branded email domains for contacts

Future: A configuration object per church that drives theme colors, logo URL, hero image, and messaging copy.

## File Versioning Convention

Files with version suffixes (e.g., `find-resources_1_0_.php`) represent earlier iterations. In this repo, these are renamed descriptively (e.g., `find-resources-v1.php`) and kept for reference. The un-suffixed file is always the current version.

## Production Readiness Checklist

- [ ] Replace Tailwind CDN with compiled CSS (PostCSS build)
- [ ] Add `.env` configuration management
- [ ] Server-side Notion API proxy with caching
- [ ] Encrypted credential storage
- [ ] CSRF protection on all forms
- [ ] Input validation and sanitization
- [ ] Error pages (404, 500)
- [ ] SSL/TLS enforcement
- [ ] Content Security Policy headers
- [ ] Analytics integration
- [ ] Automated deployment pipeline
