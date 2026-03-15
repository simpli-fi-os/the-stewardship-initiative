# The Stewardship Initiative (TSI)

**Unlock the hidden potential within trusted communities.**

TSI is a privacy-conscious, Notion-powered community directory that connects member needs with member skills, talent, and resources. Built for churches first, designed for any high-trust community.

---

## The Problem ("The Connection Gap")

Even in vibrant, high-trust communities like churches, there is a natural gap between members who have valuable skills (lawyers, plumbers, accountants, artists) and members who need those exact services. This disconnect prevents the natural flow of service, support, and fellowship that strengthens a community.

## The Solution

TSI bridges this gap with a simple, elegant two-part system:

1. **Notion Backend** — Church administrators manage a simple Notion database (duplicated from our master template). They own and control their data entirely.
2. **Beautiful Frontend** — Members access a searchable, filterable directory through TSI's web app. The frontend connects to Notion via API, keeping data private to each organization.

The result: invisible networks become visible, asking for help becomes an act of strength, and providing it becomes a blessing.

---

## Architecture

- **Frontend**: Static PHP pages, Tailwind CSS (CDN), vanilla JavaScript
- **Fonts**: Inter (sans), Playfair Display / Lora (serif)
- **Backend Data**: Notion API (each church owns their own database)
- **Hosting**: Any PHP-capable server (shared hosting, VPS, etc.)
- **No build step required** for current prototype — Tailwind via Play CDN

### Design System ("Garden of Eden" Palette)

| Token | Hex | Usage |
|-------|-----|-------|
| `jungle-green` | `#022C22` | Primary background |
| `hibiscus-pink` | `#D90368` | Accent, highlights, CTAs |
| `marigold-yellow` | `#FDB833` | Interactive elements, links, badges |
| `orchid-white` | `#FDFDFF` | Primary text on dark backgrounds |
| `lush-teal` | `#033F32` | Card backgrounds, secondary surfaces |

---

## Getting Started

### Prerequisites

- A PHP-capable web server (Apache, Nginx, or even `php -S localhost:8000`)
- A Notion account (free tier works)

### Church Administrator Setup

1. **Duplicate** the [TSI Notion Template](https://simpli-fi.notion.site/21d42ea8d87680cd9bc7c287b5106980?v=21d42ea8d87681ad8bb7000c54a9ad50)
2. **Create** a Notion Integration at [notion.so/my-integrations](https://www.notion.so/my-integrations) with read-only permissions
3. **Connect** the integration to your duplicated database
4. **Submit** your API key and Database ID via the Connect page

---

## Documentation

| Document | Purpose |
|----------|--------|
| **[Product Bible](docs/PRODUCT_BIBLE.md)** | Market analysis, revenue model, tech stack, automation pipeline, brand guide, content/SEO strategy, growth loops, roadmap |
| **[Architecture](docs/ARCHITECTURE.md)** | Technical architecture, database schema, Notion integration, multi-tenant routing |

## Alpha Partner

**The Village Church** (Flower Mound, TX) is the initial alpha partner.

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

*A [Simpli-FI OS](https://simpli-fi-os.com) Initiative*
