"""Build index.html from src/template.html: inlines the hero route data and the Upwork link."""
import json
from pathlib import Path

UPWORK = "https://www.upwork.com/freelancers/~01d6ae0f1a06a43ac0"
root = Path(__file__).parent
t = (root / "src/template.html").read_text()
data = json.loads((root / "src/hero-routes.json").read_text())
(root / "index.html").write_text(t.replace("__DATA__", json.dumps(data, separators=(",", ":"))).replace("__UPWORK__", UPWORK))
