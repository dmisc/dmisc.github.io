#version 300 es
precision highp float;
layout (location = 0) out vec4 gColorSpec;
layout (location = 1) out vec4 gNormal;

in vec3 FragPos;
in vec3 Normal;
in vec3 Color;

void main()
{    
	gNormal = vec4(normalize(Normal), 0.0);
	gColorSpec.rgb = Color;
	gColorSpec.a = 1.0;
}  
