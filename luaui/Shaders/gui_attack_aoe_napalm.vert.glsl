// SPDX-FileCopyrightText: Beyond All Reason contributors
// SPDX-License-Identifier: GPL-2.0-or-later
#version 120

uniform vec4 u_color;
varying vec4 worldPos;
varying vec4 vColor;

void main() {
    worldPos = gl_Vertex;
    vColor = u_color;
    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
