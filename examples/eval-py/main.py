# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

# code is from https://github.com/bytecodealliance/componentize-py/blob/main/examples/sandbox/guest.py
import contextlib
import io
import json

import wit_world
from wit_world.types import Err


def handle(e: Exception) -> Err[str]:
    message = str(e)
    if message == "":
        return Err(f"{type(e).__name__}")
    else:
        return Err(f"{type(e).__name__}: {message}")


class WitWorld(wit_world.WitWorld):
    def eval(self, expression: str) -> str:
        try:
            return json.dumps(eval(expression))
        except Exception as e:
            raise handle(e)

    def exec(self, statements: str) -> str:
        buffer = io.StringIO()
        try:
            with contextlib.redirect_stdout(buffer), contextlib.redirect_stderr(buffer):
                exec(statements)
            return buffer.getvalue()
        except Exception as e:
            raise handle(e)
