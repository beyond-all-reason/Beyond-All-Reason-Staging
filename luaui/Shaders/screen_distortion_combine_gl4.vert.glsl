// SPDX-FileCopyrightText: Beyond All Reason contributors
// SPDX-License-Identifier: GPL-2.0-or-later
#version 150 compatibility

//__DEFINES__

void main(void)	{
    gl_TexCoord[0] = vec4(gl_Vertex.zwzw);
    gl_Position    = vec4(gl_Vertex.xy * 1.0, 0.00, 1);	
}