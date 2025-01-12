const exhaustVertexShader = `
    attribute float size;
    attribute float opacity;
    varying float vOpacity;
    
    void main() {
        vOpacity = opacity;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
    }
`

const exhaustFragmentShader = `
    uniform sampler2D pointTexture;
    varying float vOpacity;
    
    void main() {
        vec4 texColor = texture2D(pointTexture, gl_PointCoord);
        gl_FragColor = vec4(texColor.rgb, texColor.a * vOpacity);
    }
`

const motorcyclePaintShader = {
    uniforms: {
        time: { value: 0 },
        baseColor: { value: new THREE.Color(0x000000) },
        pearlescence: { value: 0.5 },
        roughness: { value: 0.2 },
        metalness: { value: 0.8 },
        normalMap: { value: null },
        envMap: { value: null }
    },
    vertexShader: `
        varying vec3 vViewPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        
        void main() {
            vUv = uv;
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            vNormal = normalMatrix * normal;
            
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        uniform vec3 baseColor;
        uniform float pearlescence;
        uniform float roughness;
        uniform float metalness;
        uniform float time;
        uniform samplerCube envMap;
        uniform sampler2D normalMap;
        
        varying vec3 vViewPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        
        void main() {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewPosition);
            
            vec3 r = reflect(-viewDir, normal);
            float fresnel = pow(1.0 + dot(normal, viewDir), 5.0);
            
            vec3 envColor = textureCube(envMap, r).rgb;
            vec3 pearlColor = vec3(
                sin(fresnel * 3.14159 + time),
                sin(fresnel * 3.14159 + time + 2.094),
                sin(fresnel * 3.14159 + time + 4.189)
            ) * 0.5 + 0.5;
            
            vec3 finalColor = mix(
                baseColor,
                pearlColor,
                pearlescence * fresnel
            );
            
            finalColor = mix(finalColor, envColor, metalness * fresnel);
            finalColor *= (1.0 - roughness * (1.0 - fresnel));
            
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `
}

const carbonFiberShader = {
    uniforms: {
        time: { value: 0 },
        fiberColor: { value: new THREE.Color(0x222222) },
        resinColor: { value: new THREE.Color(0x000000) },
        weaveScale: { value: 50.0 },
        glossiness: { value: 0.95 }
    },
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        
        void main() {
            vUv = uv;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            vNormal = normalMatrix * normal;
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        uniform vec3 fiberColor;
        uniform vec3 resinColor;
        uniform float weaveScale;
        uniform float glossiness;
        uniform float time;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        
        float pattern(vec2 uv) {
            uv *= weaveScale;
            vec2 i = floor(uv);
            vec2 f = fract(uv);
            
            float v = mod(i.x + i.y, 2.0);
            float w = sin(time + v * 3.14159);
            
            vec2 center = f * 2.0 - 1.0;
            float d = length(center);
            
            float wave = sin(d * 10.0 - time) * 0.5 + 0.5;
            return smoothstep(0.4 + w * 0.1, 0.6 + w * 0.1, wave);
        }
        
        void main() {
            float fiber = pattern(vUv);
            vec3 color = mix(resinColor, fiberColor, fiber);
            
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewPosition);
            float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 5.0);
            
            color = mix(color, vec3(1.0), fresnel * glossiness);
            
            gl_FragColor = vec4(color, 1.0);
        }
    `
}
