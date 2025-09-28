#!/usr/bin/env python3

import streamlit as st

from wasmagents.hello import hello

st.title("wasmagents")

st.write(hello())
