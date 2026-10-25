"""Serve an actual Jekyll build locally, preserving its /StudentGuide URL prefix."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent.parent / "_site"
PREFIX = "/StudentGuide"


class PreviewHandler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, ".mjs": "text/javascript"}

    def do_GET(self):
        if urlsplit(self.path).path in ("/", PREFIX):
            self.send_response(302)
            self.send_header("Location", PREFIX + "/")
            self.end_headers()
            return
        super().do_GET()

    def translate_path(self, path):
        parsed = urlsplit(path).path
        if not parsed.startswith(PREFIX + "/"):
            return str(ROOT / "__not_a_public_route__")
        return super().translate_path(parsed[len(PREFIX):])


if __name__ == "__main__":
    if not (ROOT / "index.html").is_file():
        raise SystemExit("No built site found. Build Jekyll or download the checked site artifact into _site/ first.")
    handler = partial(PreviewHandler, directory=str(ROOT))
    print("StudentGuide preview: http://localhost:4173/StudentGuide/", flush=True)
    ThreadingHTTPServer(("127.0.0.1", 4173), handler).serve_forever()
