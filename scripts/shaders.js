const motorcyclePaintShader = {
    uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x800000) },
        glossiness: { value: 0.9 }
    },
    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform float glossiness;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
            vec3 light = normalize(vec3(1.0, 1.0, 1.0));
            float fresnel = pow(1.0 - dot(normalize(vNormal), normalize(vec3(0.0, 0.0, 1.0))), 3.0);
            
            vec3 reflection = reflect(-light, vNormal);
            float specular = pow(max(dot(reflection, normalize(vec3(0.0, 0.0, 1.0))), 0.0), 32.0);
            
            vec3 baseColor = color + fresnel * 0.5;
            vec3 finalColor = mix(baseColor, vec3(1.0), specular * glossiness);
            
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `
}

const carbonFiberShader = {
    uniforms: {
        time: { value: 0 },
        scale: { value: 50.0 }
    },
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        
        void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform float scale;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        
        float pattern(vec2 uv) {
            vec2 pos = vec2(uv * scale);
            
            float pattern = sin(pos.x) * sin(pos.y);
            pattern = smoothstep(-1.0, 1.0, pattern);
            
            return pattern;
        }
        
        void main() {
            float p = pattern(vUv);
            vec3 baseColor = mix(vec3(0.1), vec3(0.2), p);
            
            float fresnel = pow(1.0 - dot(normalize(vNormal), normalize(vec3(0.0, 0.0, 1.0))), 3.0);
            vec3 finalColor = mix(baseColor, vec3(0.4), fresnel);
            
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `
}

const chromeShader = {
    uniforms: {
        time: { value: 0 },
        envMap: { value: null }
    },
    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform samplerCube envMap;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
            vec3 reflection = reflect(normalize(vPosition), normalize(vNormal));
            vec4 envColor = textureCube(envMap, reflection);
            
            gl_FragColor = envColor;
        }
    `
}

export { motorcyclePaintShader, carbonFiberShader, chromeShader }
