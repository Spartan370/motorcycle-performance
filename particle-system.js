class MotorcycleParticleSystem {
    constructor(scene) {
        this.scene = scene
        this.particles = new Map()
        this.emitters = new Map()
        this.gpuCompute = new GPUComputationRenderer(512, 512, renderer)
        
        this.initializeComputeShaders()
        this.createParticleSystems()
    }

    initializeComputeShaders() {
        const positionVariable = this.gpuCompute.addVariable(
            'texturePosition',
            `
            uniform float time;
            uniform float deltaTime;
            void main() {
                vec2 uv = gl_FragCoord.xy / resolution.xy;
                vec4 tmpPos = texture2D(texturePosition, uv);
                vec3 position = tmpPos.xyz;
                vec3 velocity = texture2D(textureVelocity, uv).xyz;
                position += velocity * deltaTime;
                gl_FragColor = vec4(position, 1.0);
            }
            `,
            this.gpuCompute.createTexture()
        )

        const velocityVariable = this.gpuCompute.addVariable(
            'textureVelocity',
            `
            uniform float time;
            uniform float speedFactor;
            uniform vec3 mousePos;
            uniform float turbulence;
            
            const float width = resolution.x;
            const float height = resolution.y;
            
            float rand(vec2 co) {
                return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
            }
            
            void main() {
                vec2 uv = gl_FragCoord.xy / resolution.xy;
                vec3 position = texture2D(texturePosition, uv).xyz;
                vec3 velocity = texture2D(textureVelocity, uv).xyz;
                
                float dx = rand(uv + time) - 0.5;
                float dy = rand(uv + time + 1.0) - 0.5;
                float dz = rand(uv + time + 2.0) - 0.5;
                
                velocity += vec3(dx, dy, dz) * turbulence * deltaTime;
                velocity *= 0.99;
                
                gl_FragColor = vec4(velocity, 1.0);
            }
            `,
            this.gpuCompute.createTexture()
        )

        this.gpuCompute.init()
    }

    createParticleSystems() {
        this.createExhaustSystem()
        this.createTireSmoke()
        this.createAerodynamicFlow()
    }

    createExhaustSystem() {
        const exhaustGeometry = new THREE.BufferGeometry()
        const exhaustParticles = 10000
        const positions = new Float32Array(exhaustParticles * 3)
        const colors = new Float32Array(exhaustParticles * 3)
        const sizes = new Float32Array(exhaustParticles)
        const opacities = new Float32Array(exhaustParticles)

        for(let i = 0; i < exhaustParticles; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 0.1
            positions[i * 3 + 1] = (Math.random() - 0.5) * 0.1
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.1
            
            colors[i * 3] = 0.6 + Math.random() * 0.4
            colors[i * 3 + 1] = 0.2 + Math.random() * 0.2
            colors[i * 3 + 2] = 0.1
            
            sizes[i] = Math.random() * 2
            opacities[i] = Math.random()
        }

        exhaustGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        exhaustGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        exhaustGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
        exhaustGeometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1))

        const exhaustMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pointTexture: { value: new THREE.TextureLoader().load('textures/exhaust_particle.png') }
            },
            vertexShader: exhaustVertexShader,
            fragmentShader: exhaustFragmentShader,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true
        })

        this.exhaustSystem = new THREE.Points(exhaustGeometry, exhaustMaterial)
        this.scene.add(this.exhaustSystem)
    }

    updateParticles(deltaTime, engineLoad, speed) {
        this.gpuCompute.compute()
        
        const exhaustOpacities = this.exhaustSystem.geometry.attributes.opacity
        const exhaustSizes = this.exhaustSystem.geometry.attributes.size
        const exhaustPositions = this.exhaustSystem.geometry.attributes.position
        
        for(let i = 0; i < exhaustOpacities.count; i++) {
            exhaustOpacities.array[i] *= 0.96
            
            if(exhaustOpacities.array[i] < 0.01) {
                this.resetExhaustParticle(i, engineLoad)
            }
            
            exhaustPositions.array[i * 3] += (Math.random() - 0.5) * 0.01
            exhaustPositions.array[i * 3 + 1] += speed * 0.001
            exhaustPositions.array[i * 3 + 2] += (Math.random() - 0.5) * 0.01
        }
        
        exhaustOpacities.needsUpdate = true
        exhaustSizes.needsUpdate = true
        exhaustPositions.needsUpdate = true
    }
}
