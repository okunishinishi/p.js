#!/bin/bash

HERE=$(cd "$(dirname $0)" && pwd)
BIN="${HERE}/../../../bin/parari"

${BIN} slide "${HERE}/parari-README.md" "${HERE}/parari-cosmic.html" --theme "cosmic"
