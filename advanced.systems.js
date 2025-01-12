class PerformanceAnimationSystem {
    constructor(motorcycle) {
        this.motorcycle = motorcycle
        this.particleSystem = new THREE.GPUParticleSystem({
            maxParticles: 250000,
            particleNoiseTex: new THREE.TextureLoader().load('textures/perlin.png'),
            particleSpriteTex: new THREE.TextureLoader().load('textures/particle.png')
        })

        this.upgradeEffects = new Map()
        this.activeAnimations = new Set()
        this.initializeRaycaster()
        this.setupInteractiveElements()
    }

    createDynamicUpgradeTree() {
        const vertices = new Float32Array(15000)
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
        
        const material = new THREE.LineBasicMaterial({
            color: 0x800000,
            linewidth: 2,
            transparent: true,
            opacity: 0.8
        })

        this.upgradeLines = new THREE.LineSegments(geometry, material)
        this.scene.add(this.upgradeLines)
    }

    generatePerformanceCurves() {
        const points = []
        for(let i = 0; i <= 100; i++) {
            const t = i / 100
            const x = t * 10
            const y = Math.pow(t, 3) * Math.sin(t * Math.PI * 2) * 5
            const z = Math.cos(t * Math.PI) * 3
            points.push(new THREE.Vector3(x, y, z))
        }
        
        const curve = new THREE.CatmullRomCurve3(points)
        const geometry = new THREE.TubeGeometry(curve, 100, 0.1, 8, false)
        const material = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            emissive: 0x400000,
            shininess: 100
        })
        
        return new THREE.Mesh(geometry, material)
    }

    updatePerformanceMetrics(deltaTime) {
        this.activeAnimations.forEach(animation => {
            animation.progress += deltaTime * animation.speed
            if(animation.progress >= 1) {
                this.completeAnimation(animation)
            }
            this.updateParticleEffects(animation)
        })

        this.particleSystem.update(deltaTime)
    }

    createHolographicDisplay() {
        const geometry = new THREE.CylinderGeometry(2, 2, 4, 32, 1, true)
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x800000) }
            },
            vertexShader: this.hologramVertexShader,
            fragmentShader: this.hologramFragmentShader,
            side: THREE.DoubleSide,
            transparent: true
        })

        return new THREE.Mesh(geometry, material)
    }

    simulateAerodynamics() {
        const windVelocity = new THREE.Vector3(1, 0, 0)
        const particles = new Float32Array(1000 * 3)
        
        for(let i = 0; i < 1000; i++) {
            const offset = i * 3
            particles[offset] = Math.random() * 10 - 5
            particles[offset + 1] = Math.random() * 10
            particles[offset + 2] = Math.random() * 10 - 5
            
            this.updateParticlePosition(particles, offset, windVelocity)
        }
    }

    updateParticlePosition(particles, offset, windVelocity) {
        const drag = 0.02
        const turbulence = Math.sin(particles[offset] * 0.1) * 0.1
        
        particles[offset] += windVelocity.x + turbulence
        particles[offset + 1] += (Math.random() - 0.5) * 0.1
        particles[offset + 2] += (Math.random() - 0.5) * 0.1
        
        if(particles[offset] > 5) particles[offset] = -5
    }
}

class RealTimePerformanceCalculator {
    constructor() {
        this.metrics = new Float64Array(1000)
        this.setupWebWorker()
        this.initializeFFT()
    }

    calculateTorqueCurve(rpm) {
        const baselineTorque = 100
        const peakRPM = 10000
        const curve = rpm.map(r => {
            const normalized = r / peakRPM
            return baselineTorque * Math.sin(normalized * Math.PI) * Math.exp(-Math.pow(normalized - 0.6, 2))
        })
        return new Float32Array(curve)
    }
}
