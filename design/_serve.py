import http.server, socketserver
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        if self.path.endswith('.html'):
            self.send_header('Content-Type','text/html; charset=utf-8')
        super().end_headers()
    def send_header(self,k,v):
        if k=='Content-Type' and v.startswith('text/html') and 'charset' in getattr(self,'_ct','') : return
        super().send_header(k,v)
socketserver.TCPServer(("127.0.0.1",4188),H).serve_forever()
