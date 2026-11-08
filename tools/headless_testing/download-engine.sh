#!/bin/bash
# SPDX-FileCopyrightText: Beyond All Reason contributors
# SPDX-License-Identifier: GPL-2.0-or-later

set -euo pipefail

mkdir -p "$ENGINE_DESTINATION"

TEMP_FILE=$(mktemp --suffix=.7z)

curl -L "$ENGINE_URL" -o "$TEMP_FILE"
7z x "$TEMP_FILE" -o"$ENGINE_DESTINATION"
rm -f "$TEMP_FILE"
