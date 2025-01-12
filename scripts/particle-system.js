class ParticleSystem {
    constructor() {
        this.particles = []
        this.maxParticles = 1000
        this.particleGeometry = new THREE.BufferGeometry()
        this.particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                size: { value: 2.0 },
                color: { value: new THREE.Color(0xff3333) }
            },
            vertexShader: `
                uniform float time;
                uniform float size;
                
                attribute float life;
                attribute vec3 velocity;
                
                varying float vAlpha;
                
                void main() {
                    float age = time - life;
                    vec3 pos = position + velocity * age;
                    vAlpha = 1.0 - age / 2.0;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (1.0 - age / 2.0) * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                varying float vAlpha;
                
                void main() {
                    vec2 center = gl_PointCoord - vec2(0.5);
                    float dist = length(center);
                    float alpha = smoothstep(0.5, 0.2, dist) * vAlpha;
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })

        this.particleSystem = new THREE.Points(this.particleGeometry, this.particleMaterial)
        this.setupParticleAttributes()
    }

    setupParticleAttributes() {
        const positions = new Float32Array(this.maxParticles * 3)
        const velocities = new Float32Array(this.maxParticles * 3)
        const lifetimes = new Float32Array(this.maxParticles)

        this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        this.particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3))
        this.particleGeometry.setAttribute('life', new THREE.BufferAttribute(lifetimes, 1))
    }

    emitParticles(position, direction, count = 50) {
        const positions = this.particleGeometry.attributes.position.array
        const velocities = this.particleGeometry.attributes.velocity.array
        const lifetimes = this.particleGeometry.attributes.life.array

        for (let i = 0; i < count; i++) {
            const index = this.particles.length * 3
            if (index >= this.maxParticles * 3) break

            positions[index] = position.x
            positions[index + 1] = position.y
            positions[index + 2] = position.z

            const spread = 0.5
            velocities[index] = direction.x + (Math.random() - 0.5) * spread
            velocities[index + 1] = direction.y + (Math.random() - 0.5) * spread
            velocities[index + 2] = direction.z + (Math.random() - 0.5) * spread

            lifetimes[this.particles.length] = performance.now() / 1000

            this.particles.push({
                index: this.particles.length,
                birth: performance.now() / 1000
            })
        }

        this.particleGeometry.attributes.position.needsUpdate = true
        this.particleGeometry.attributes.velocity.needsUpdate = true
        this.particleGeometry.attributes.life.needsUpdate = true
    }

    update(deltaTime) {
        this.particleMaterial.uniforms.time.value = performance.now() / 1000

        const now = performance.now() / 1000
        this.particles = this.particles.filter(particle => {
            return (now - particle.birth) < 2.0
        })
    }

    createExhaustEffect(position) {
        const direction = new THREE.Vector3(0, 0, -1)
        this.emitParticles(position, direction, 10)
    }

    createBrakeEffect(position) {
        const direction = new THREE.Vector3(0, 1, 0)
        this.emitParticles(position, direction, 20)
    }

    createDriftEffect(position) {
        const direction = new THREE.Vector3(1, 0, 0)
        this.emitParticles(position, direction, 30)
    }
}

export default ParticleSystem
