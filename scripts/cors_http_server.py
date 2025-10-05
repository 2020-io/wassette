#!/usr/bin/env python3
from http.server import HTTPServer, SimpleHTTPRequestHandler, test
import sys
import os
import pdb

class CORSRequestHandler (SimpleHTTPRequestHandler):
    #def __init__(self, *args, directory=None, **kwargs):
    #    if directory is None:
    #        directory = os.getcwd()
    #    self.directory = os.fspath(directory)
    #    super().__init__(*args, directory=self.directory, **kwargs)
    def end_headers (self):
        # From https://web.dev/articles/coop-coep:
        # Ensure resources have CORP or CORS enabled
        self.send_header('Access-Control-Allow-Origin', '*')
        
        # If the resource is expected to be loaded only from the same origin, set the Cross-Origin-Resource-Policy: same-origin header.
        # Scripts loaded with a WebWorker must be served from same-origin, so you don't need a CORP or CORS headers.
        #self.send_header('Cross-Origin-Resource-Policy', 'same-origin')
        # If the resource is expected to be loaded only from the same site but cross origin, set the Cross-Origin-Resource-Policy: same-site header.
        #self.send_header('Cross-Origin-Resource-Policy', 'same-site')
        # If the resource is loaded from cross origin(s) under your control, set the Cross-Origin-Resource-Policy: cross-origin header if possible.
        self.send_header('Cross-Origin-Resource-Policy', 'cross-origin')

        # From https://web.dev/articles/cross-origin-isolation-guide:
        # Set the Cross-Origin-Opener-Policy: same-origin header on your top-level document. 
        # If you had set Cross-Origin-Opener-Policy-Report-Only: same-origin, replace it. 
        # This blocks communication between your top-level document and its popup windows.
        # To enable oauth or payment authorization to work :
        # self.send_header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')

        # Set the Cross-Origin-Embedder-Policy: require-corp header on your top-level document. 
        # If you had set Cross-Origin-Embedder-Policy-Report-Only: require-corp, replace it. 
        # This will block the loading of cross-origin resources that are not opted-in.
        # Check that self.crossOriginIsolated returns true in console to verify that your page is cross-origin isolated.
        # Cross-Origin-Embedder-Policy-Report-Only simulates Cross-Origin-Embedder-Policy being require-corp for reporting, but doesn't enforce it
        #self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        self.send_header('Cross-Origin-Embedder-Policy-Report-Only', 'require-corp')
               
        #pdb.set_trace()
        SimpleHTTPRequestHandler.end_headers(self)

if __name__ == '__main__':
    _bind='127.0.0.1'
    _port=8080
    if len(sys.argv) > 1:
        _port=int(sys.argv[1])
    #pdb.set_trace()
    test(CORSRequestHandler, HTTPServer, bind=_bind, port=_port)
