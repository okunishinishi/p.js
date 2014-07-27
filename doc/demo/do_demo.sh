#!/bin/bash

HERE=$(cd "$(dirname $0)" && pwd)
BIN="${HERE}/../../bin/parari"

${BIN} slide "${HERE}/parari-readme/parari-README.md"
