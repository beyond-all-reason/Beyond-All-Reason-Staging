// SPDX-FileCopyrightText: Beyond All Reason contributors
// SPDX-License-Identifier: GPL-2.0-or-later
#version 420

// Reclaim field highlight: colour and alpha come from the vertex shader.

in vec4 vColor;
out vec4 fragColor;

void main() {
	fragColor = vColor;
}
