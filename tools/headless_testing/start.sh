#!/bin/bash
# SPDX-FileCopyrightText: Beyond All Reason contributors
# SPDX-License-Identifier: GPL-2.0-or-later

rm -rf $1/LuaUI/Config
$1/engine/*/spring-headless --isolation --write-dir "$1" "$2"
