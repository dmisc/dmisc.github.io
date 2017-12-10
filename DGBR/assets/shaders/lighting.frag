#version 300 es
precision highp float;
out vec4 FragColor;
in vec2 TexCoords;

uniform sampler2D gNormal;
uniform sampler2D gColorSpec;
uniform sampler2D gDepth;

struct Light {
    vec3 Position;
    vec3 Color;

    float FarAttenuationStart;
    float FarAttenuationEnd;
};
uniform Light light;
uniform vec3 viewPos;
uniform mat4 invViewProj;


float linearDepth(float depthSample)
{
    float zNear = 0.1;
    float zFar = 100.0;
    depthSample = 2.0 * depthSample - 1.0;
    float zLinear = 2.0 * zNear / (zFar + zNear - depthSample * (zFar - zNear));
    return zLinear;
}

void main()
{             
    vec3 Normal = texture(gNormal, TexCoords).rgb;
    vec3 Diffuse = texture(gColorSpec, TexCoords).rgb;
    float Specular = texture(gColorSpec, TexCoords).a;
    float Depth = texture(gDepth, TexCoords).x;

    vec4 _fragPos = invViewProj * vec4(TexCoords * 2.0 - 1.0, Depth * 2.0 - 1.0, 1.0);
    _fragPos /= _fragPos.w;

    vec3 FragPos = _fragPos.xyz;

    //FragColor = vec4(abs(sin(FragPos.x)), abs(sin(FragPos.y)), abs(sin(FragPos.z)), 1.0);
    //FragColor = vec4(abs(Normal.x), abs(Normal.y), abs(Normal.z), 1.0);
    //FragColor = vec4(Specular * vec3(1, 1, 1), 1);
    //FragColor = vec4(Diffuse, 1.0);
    //return;

    //float d = linearDepth(texture(gDepth, TexCoords).x);
    //FragColor = vec4(d, d, d, 1);
    //return;

    vec3 lighting = Diffuse * 0.05; // hard-coded ambient component
    vec3 viewDir = normalize(viewPos - FragPos);

    // Diffuse
    vec3 lightDir = normalize(light.Position - FragPos);
    vec3 diffuse = max(dot(Normal, lightDir), 0.0) * Diffuse * light.Color;
    // Specular
    vec3 halfwayDir = normalize(lightDir + viewDir);  
    float spec = pow(max(dot(Normal, halfwayDir), 0.0), 16.0);
    vec3 specular = light.Color * spec * Specular;
    // Attenuation
    float distance = length(light.Position - FragPos);
    float attenuation = 0.0;
    if (distance < light.FarAttenuationStart)
        attenuation = 1.0;
    else if (distance < light.FarAttenuationEnd)
        attenuation = 1.0 - (distance - light.FarAttenuationStart) / (light.FarAttenuationEnd - light.FarAttenuationStart);

    diffuse *= attenuation;
    specular *= attenuation;
    lighting += diffuse + specular;

    FragColor = vec4(lighting, 1.0);
}  
