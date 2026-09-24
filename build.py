"""Build the site: index.html from src/template.html, and one branded page per live demo from src/demo.html."""
import json
import re
from pathlib import Path

UPWORK = "https://www.upwork.com/freelancers/~01d6ae0f1a06a43ac0"
# slug -> (title, one-line description, Streamlit app). rooms and schoolbus were built for specific jobs:
# they get a page for proposals but are not listed on the homepage (railway-crew too).
DEMOS = {
    "routes": ("Route optimizer", "Cheapest delivery routes on real roads, with capacity, time windows and shift length.", "https://slimaneoptic-routes.streamlit.app"),
    "scheduler": ("AI shift scheduler", "A weekly staff roster built by an optimizer, changed in plain words.", "https://slimaneoptic-scheduler.streamlit.app"),
    "chatbot": ("Website chatbot and data extraction", "Answers from a website or PDFs with sources; extracts fields into tables.", "https://slimaneoptic-chatbot.streamlit.app"),
    "rooms": ("Room layout optimizer", "The best few, genuinely different furniture layouts under design rules.", "https://slimaneoptic-rooms.streamlit.app"),
    "schoolbus": ("School bus routing analysis", "Walk zones, stop consolidation and bus routes on a real street network.", "https://slimaneoptic-schoolbus.streamlit.app"),
    "railway-crew": ("Onboard crew deployment", "End-to-end crews vs. relays at manpower hubs, under working-hour rules.", "https://slimaneoptic-railway.streamlit.app"),
}

root = Path(__file__).parent
home = (root / "src/template.html").read_text()
data = json.loads((root / "src/hero-routes.json").read_text())
(root / "index.html").write_text(home.replace("__DATA__", json.dumps(data, separators=(",", ":"))).replace("__UPWORK__", UPWORK))

icon = re.search(r'<link rel="icon" href="([^"]+)"', home).group(1)
demo = (root / "src/demo.html").read_text()
for slug, (title, blurb, app) in DEMOS.items():
    page = demo.replace("__TITLE__", title).replace("__BLURB__", blurb).replace("__APP__", app).replace("__UPWORK__", UPWORK).replace("__ICON__", icon)
    (root / slug).mkdir(exist_ok=True)
    (root / slug / "index.html").write_text(page)
print("built index.html +", ", ".join(DEMOS))
