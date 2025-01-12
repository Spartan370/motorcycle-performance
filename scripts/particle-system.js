class ParticleSystem {
    constructor() {
        this.particles = []
        this.maxParticles = 1000
        this.emissionRate = 60
        this.particleGeometry = new THREE.BufferGeometry()
        this.particleMaterial = new THREE.PointsMaterial({
            size: 0.05,
            map: this.createParticleTexture(),
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
        })
        
        this.initialize()
    }

    initialize() {
        this.positions = new Float32Array(this.maxParticles * 3)
        this.velocities = new Float32Array(this.maxParticles * 3)
        this.colors = new Float32Array(this.maxParticles * 3)
        this.lifetimes = new Float32Array(this.maxParticles)
        
        this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
        this.particleGeometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3))
        
        this.particleSystem = new THREE.Points(this.particleGeometry, this.particleMaterial)
    }

    createParticleTexture() {
        const canvas = document.createElement('canvas')
        canvas.width = 32
        canvas.height = 32
        
        const context = canvas.getContext('2d')
        const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16)
        gradient.addColorStop(0, 'rgba(255,255,255,1)')
        gradient.addColorStop(1, 'rgba(255,255,255,0)')
        
        context.fillStyle = gradient
        context.fillRect(0, 0, 32, 32)
        
        const texture = new THREE.Texture(canvas)
        texture.needsUpdate = true
        return texture
    }

    emitParticles(position, color, count) {
        for (let i = 0; i < count; i++) {
            const index = this.particles.length
            if (index >= this.maxParticles) break
            
            this.positions[index * 3] = position.x
            this.positions[index * 3 + 1] = position.y
            this.positions[index * 3 + 2] = position.z
            
            this.velocities[index * 3] = (Math.random() - 0.5) * 0.1
            this.velocities[index * 3 + 1] = Math.random() * 0.1
            this.velocities[index * 3 + 2] = (Math.random() - 0.5) * 0.1
            
            this.colors[index * 3] = color.r
            this.colors[index * 3 + 1] = color.g
            this.colors[index * 3 + 2] = color.b
            
            this.lifetimes[index] = 1.0
            
            this.particles.push({
                index: index,
                lifetime: 1.0
            })
        }
        
        this.particleGeometry.attributes.position.needsUpdate = true
        this.particleGeometry.attributes.color.needsUpdate = true
    }

    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i]
            const index = particle.index
            
            particle.lifetime -= deltaTime
            
            if (particle.lifetime <= 0) {
                this.particles.splice(i, 1)
                continue
            }
            
            this.positions[index * 3] += this.velocities[index * 3]
            this.positions[index * 3 + 1] += this.velocities[index * 3 + 1]
            this.positions[index * 3 + 2] += this.velocities[index * 3 + 2]
            
            const alpha = particle.lifetime
            this.colors[index * 3] *= alpha
            this.colors[index * 3 + 1] *= alpha
            this.colors[index * 3 + 2] *= alpha
        }
        
        this.particleGeometry.attributes.position.needsUpdate = true
        this.particleGeometry.attributes.color.needsUpdate = true
    }

    createExhaustEffect(position) {
        const color = new THREE.Color(0xff3300)
        this.emitParticles(position, color, 5)
    }

    createSparkEffect(position) {
        const color = new THREE.Color(0xffff00)
        this.emitParticles(position, color, 20)
    }

    createNitroEffect(position) {
        const color = new THREE.Color(0x00ffff)
        this.emitParticles(position, color, 30)
    }
}

export default ParticleSystem
