# Meta-package with all key symbols from FastHTML and Starlette. Import it like this at the start of every FastHTML app.
from fasthtml.common import *

# The FastHTML app object and shortcut to `app.route`
app, rt = fast_app()

# Passing a path to `rt` is optional. If not passed (recommended), the function name is the route ('/foo')
# Both GET and POST HTTP methods are handled by default
# Type-annotated params are passed as query params (recommended) unless a path param is defined (which it isn't here)
@rt('/test')
def test():
    # `Title` and `P` here are FastTags: direct m-expression mappings of HTML tags to Python functions with positional and named parameters. 
    # All standard HTML tags are included in the common wildcard import.
    # When a tuple is returned, this returns concatenated HTML partials. 
    # HTMX by default will use a title HTML partial to set the current page name. 
    # HEAD tags (e.g. Meta, Link, etc) in the returned tuple are automatically placed in HEAD; everything else is placed in BODY.
    # FastHTML will automatically return a complete HTML document with appropriate headers if a normal HTTP request is received. 
    # For an HTMX request, however, just the partials are returned.
    return Title("FastHTML"), H1("index.py"), P(f"test")

# By default `serve` runs uvicorn on port 5001.
serve()
