#!/bin/bash

HERE=$(cd "$(dirname $0)" && pwd)

for f in ${HERE}/*
do
    mv ${f} "$(dirname ${f})/old_$(basename ${f})"
done
