"""Build the site: index.html from src/template.html, and one branded page per live demo from src/demo.html."""
import json
import re
from pathlib import Path

UPWORK = "https://www.upwork.com/freelancers/~01d6ae0f1a06a43ac0"
# slug -> (title, one-line description, Streamlit app). rooms and schoolbus were built for specific jobs:
# they get a page for proposals but are not listed on the homepage (railway-crew too).
DEMOS = {
    "routes": ("Route optimizer", "Cheapest delivery routes on real roads, with capacity, time windows and shift length.", "https://slimaneoptic-routes.streamlit.app/"),
    "scheduler": ("AI shift scheduler", "A weekly staff roster built by an optimizer, changed in plain words.", "https://slimaneoptic-scheduler.streamlit.app/"),
    "chatbot": ("Website chatbot and data extraction", "Answers from a website or PDFs with sources; extracts fields into tables.", "https://slimaneoptic-chatbot.streamlit.app/"),
    "planner": ("Demand forecast and reorder planner", "Demo on synthetic sales data: forecasts every product, tests 4 models, and says what to order this week within your budget.", "https://slimaneoptic-planner.streamlit.app/"),
    "rooms": ("Room layout optimizer", "The best few, genuinely different furniture layouts under design rules.", "https://slimaneoptic-rooms.streamlit.app/"),
    "schoolbus": ("School bus routing analysis", "Walk zones, stop consolidation and bus routes on a real street network.", "https://slimaneoptic-schoolbus.streamlit.app/"),
    "railway-crew": ("Onboard crew deployment", "End-to-end crews vs. relays at manpower hubs, under working-hour rules.", "https://slimaneoptic-railway.streamlit.app/"),
    "railway-linen": ("Linen management", "How many bedroll sets, where, and at what cost: pooling, faster laundry, tracking.", "https://slimaneoptic-railway.streamlit.app/linen"),
}

SITE = "https://slimanechanchoul.com"
# Only these template slugs are indexable; every other slug (rooms, schoolbus, railway-crew, railway-linen) stays noindex.
PUBLIC = {"routes", "scheduler", "chatbot", "planner"}
NOINDEX = '<meta name="robots" content="noindex">\n'
# Page <title> and meta description for the public demo pages (PLAN.md section 2.2 copy, numbers only from there).
SEO = {
    "routes": ("Route optimizer demo: 11-32% lower daily cost than a manual plan",
               "Route optimizer (demo): on the sample cities 11-32% lower daily cost than a manual plan; Casablanca sample, 25 deliveries: 3 vans and 147 km by hand, 2 vans and 106 km optimized."),
    "scheduler": ("AI shift scheduler demo: weekly roster, re-planned in plain words",
                  "AI shift scheduler (demo): a weekly roster that respects rest, contracts and leave, aims for a senior on every shift, and names the rule that blocks a shift instead of failing silently."),
    "chatbot": ("Website chatbot and data extraction demo, answers with sources",
                "Website chatbot and data extraction (demo): it answers only from your site or PDFs, cites its sources, says when it doesn't know, and extracts the fields you name into a table."),
    "planner": ("Demand forecast and reorder planner demo: 4 models per product, 300 scenarios",
                "Demand forecast and reorder planner (demo on synthetic data): four models tested per product, the most accurate kept, an order plan in whole cases, a budget optimizer over 300 demand scenarios per product."),
}
# The 10 indexable pages: exactly the sitemap; the assert at the end checks the rest are noindex.
INDEXED = ["", "rag-fix", "mcp-excel", "agent-workflow-demo", "sheets-report", "routes", "scheduler", "planner", "chatbot", "vision"]

root = Path(__file__).parent
home = (root / "src/template.html").read_text()
data = json.loads((root / "src/hero-routes.json").read_text())
(root / "index.html").write_text(home.replace("__DATA__", json.dumps(data, separators=(",", ":"))).replace("__UPWORK__", UPWORK))

icon = re.search(r'<link rel="icon" href="([^"]+)"', home).group(1)
demo = (root / "src/demo.html").read_text()
for slug, (title, blurb, app) in DEMOS.items():
    shot = root / "img" / f"{slug}.webp"  # a real screenshot shown while the sleeping app wakes up
    preview = f'<img src="/img/{slug}.webp" alt="Screenshot of the {title}">' if shot.exists() else ""
    page_title, desc = SEO.get(slug, (f"{title} · S'limane Chanchoul", blurb))
    page = (demo.replace("__PAGETITLE__", page_title).replace("__BLURB__", desc).replace("__ROBOTS__", "" if slug in PUBLIC else NOINDEX)
            .replace("__TITLE__", title).replace("__APP__", app)
            .replace("__UPWORK__", UPWORK).replace("__ICON__", icon).replace("__PREVIEW__", preview))
    (root / slug).mkdir(exist_ok=True)
    (root / slug / "index.html").write_text(page)
# Pages with their own content instead of an embedded app: vision (needs a GPU, so a video) and
# dc-map (print files for one job: noindex, not listed on the homepage), demand-planner (approach brief for
# one job, synthetic figures live in site/demand-planner/: noindex, not listed), telegram-digest (brief of the
# personal-assistant Stage 1 demo, real run of 2026-10-06: noindex, not listed, reusable in proposals)
for slug in ("vision", "dc-map", "demand-planner", "telegram-digest"):
    page = (root / f"src/{slug}.html").read_text().replace("__UPWORK__", UPWORK).replace("__ICON__", icon)
    (root / slug).mkdir(exist_ok=True)
    (root / slug / "index.html").write_text(page)
print("built index.html +", ", ".join([*DEMOS, "vision", "dc-map", "demand-planner", "telegram-digest"]))

# sitemap.xml with exactly the 10 indexable pages; robots.txt has only the Sitemap line (a Disallow line would list hidden paths)
urls = "".join(f"  <url><loc>{SITE}/{p + '/' if p else ''}</loc></url>\n" for p in INDEXED)
(root / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n'
                                  f'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}</urlset>\n')
(root / "robots.txt").write_text(f"Sitemap: {SITE}/sitemap.xml\n")

# Indexability check: the 10 sitemap pages have no noindex, every other page has it.
for p in INDEXED:
    assert "noindex" not in (root / p / "index.html").read_text(), f"/{p} must be indexable"
for f in root.glob("*/index.html"):
    if f.parent.name not in INDEXED:
        assert "noindex" in f.read_text(), f"/{f.parent.name}/ must be noindex"
print("sitemap.xml: 10 URLs; indexability check passed")
