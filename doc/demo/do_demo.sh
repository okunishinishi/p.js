#!/bin/bash

HERE=$(cd "$(dirname $0)" && pwd)
BIN="${HERE}/../../bin/parari"

sh "${HERE}/parari-readme/.slide.sh"
