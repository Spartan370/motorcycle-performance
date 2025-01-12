const motorcyclePaintShader = {
    uniforms: {
        time: { value: 0 },
        baseColor: { value: new THREE.Color(0xff0000) },
        glossiness: { value: 0.9 },
        flakeScale: { value: 100.0 },
        flakeIntensity: { value: 0.5 }
    },
    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform vec3 baseColor;
        uniform float glossiness;
        uniform float flakeScale;
        uniform float flakeIntensity;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }
        
        void main() {
            vec3 normal = normalize(vNormal);
            vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
            
            float diffuse = max(dot(normal, lightDir), 0.0);
            
            vec2 flakeUv = vUv * flakeScale;
            float flakePattern = random(floor(flakeUv));
            float flake = smoothstep(0.5, 0.6, flakePattern) * flakeIntensity;
            
            vec3 viewDir = normalize(-vPosition);
            vec3 halfDir = normalize(lightDir + viewDir);
            float specular = pow(max(dot(normal, halfDir), 0.0), 32.0) * glossiness;
            
            vec3 finalColor = baseColor * (diffuse + 0.2) + vec3(1.0) * specular + vec3(flake);
            
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `
}

const carbonFiberShader = {
    uniforms: {
        time: { value: 0 },
        weaveScale: { value: 20.0 },
        glossiness: { value: 0.8 }
    },
    vertexShader: `
        varying vec3 vNormal;
        varying vec2 vUv;
        
        void main() {
            vNormal = normalize(normalMatrix * normal);
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform float weaveScale;
        uniform float glossiness;
        
        varying vec3 vNormal;
        varying vec2 vUv;
        
        void main() {
            vec2 uv = vUv * weaveScale;
            vec2 id = floor(uv);
            vec2 gv = fract(uv) - 0.5;
            
            float pattern = smoothstep(0.4, 0.5, abs(gv.x) + abs(gv.y));
            
            vec3 normal = normalize(vNormal);
            vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
            float diffuse = max(dot(normal, lightDir), 0.0);
            
            vec3 baseColor = vec3(0.1);
            vec3 finalColor = mix(baseColor, vec3(0.2), pattern);
            finalColor *= (diffuse + 0.2);
            
            float specular = pow(max(dot(normal, normalize(lightDir + vec3(0.0, 0.0, 1.0))), 0.0), 32.0) * glossiness;
            finalColor += vec3(specular);
            
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `
}

const chromeShader = {
    uniforms: {
        time: { value: 0 },
        envMap: { value: null },
        reflectivity: { value: 1.0 }
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
        uniform float reflectivity;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(-vPosition);
            vec3 reflectDir = reflect(-viewDir, normal);
            
            vec3 envColor = textureCube(envMap, reflectDir).rgb;
            vec3 finalColor = envColor * reflectivity;
            
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `
}

export { motorcyclePaintShader, carbonFiberShader, chromeShader }
