#!/usr/bin/env python3
"""Tiny static server that disables caching, so edits to CSS/JS/HTML show on a normal reload.
Plain `python -m http.server` sends no Cache-Control, so browsers serve stale wireframe.css.

Usage: python3 serve.py [port] [directory]   (defaults: 8123, this script's folder)
"""
import functools
import http.server
import os
import sys

port = int(sys.argv[1]) if len(sys.argv) > 1 else 8123
directory = sys.argv[2] if len(sys.argv) > 2 else os.path.dirname(os.path.abspath(__file__))


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()


handler = functools.partial(NoCacheHandler, directory=directory)
print(f"Serving {directory} at http://localhost:{port}/ (no-cache)")
http.server.ThreadingHTTPServer(("", port), handler).serve_forever()
