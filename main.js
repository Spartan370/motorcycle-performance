class MotorcyclePerformanceApp {
    constructor() {
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        
        this.physicsEngine = new MotorcyclePhysicsEngine()
        this.particleSystem = new MotorcycleParticleSystem(this.scene)
        this.performanceMapper = new PerformanceMapper()
        
        this.clock = new THREE.Clock()
        this.controls = {}
        this.activeUpgrades = new Set()
        
        this.initialize()
    }

    initialize() {
        this.setupRenderer()
        this.setupLighting()
        this.loadMotorcycleModel()
        this.initializePostProcessing()
        this.setupEventListeners()
        this.animate()
    }

    setupRenderer() {
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping
        this.renderer.toneMappingExposure = 1.5
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        document.querySelector('.webgl-container').appendChild(this.renderer.domElement)
    }

    loadMotorcycleModel() {
        const loader = new THREE.GLTFLoader()
        loader.load('models/motorcycle.glb', (gltf) => {
            this.motorcycle = gltf.scene
            this.setupMaterialsAndShaders()
            this.scene.add(this.motorcycle)
            this.initializePhysicsBody()
        })
    }

    setupMaterialsAndShaders() {
        const paintMaterial = new THREE.ShaderMaterial(motorcyclePaintShader)
        const carbonMaterial = new THREE.ShaderMaterial(carbonFiberShader)
        
        this.motorcycle.traverse((child) => {
            if (child.isMesh) {
                if (child.name.includes('Body')) {
                    child.material = paintMaterial
                } else if (child.name.includes('Carbon')) {
                    child.material = carbonMaterial
                }
            }
        })
    }

    initializePostProcessing() {
        const renderPass = new RenderPass(this.scene, this.camera)
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, 0.4, 0.85
        )
        
        this.composer = new EffectComposer(this.renderer)
        this.composer.addPass(renderPass)
        this.composer.addPass(bloomPass)
    }

    updatePerformance() {
        const engineState = {
            rpm: this.controls.throttle * 10000,
            load: this.controls.throttle,
            temperature: this.performanceMapper.metrics.thermalData[0]
        }
        
        const performance = this.performanceMapper.calculateRealTimePerformance(
            engineState.rpm,
            engineState.load,
            engineState.temperature
        )
        
        this.updateTelemetryDisplays(performance)
        this.updateParticleSystems(performance)
    }

    updatePhysics() {
        const deltaTime = this.clock.getDelta()
        const physicsState = this.physicsEngine.update(deltaTime)
        
        this.motorcycle.position.copy(physicsState.chassis.position)
        this.motorcycle.quaternion.copy(physicsState.chassis.quaternion)
        
        this.updateWheelsAndSuspension(physicsState)
    }

    animate() {
        requestAnimationFrame(() => this.animate())
        
        const deltaTime = this.clock.getDelta()
        const elapsedTime = this.clock.getElapsedTime()
        
        this.updatePhysics()
        this.updatePerformance()
        this.particleSystem.updateParticles(deltaTime, this.controls.throttle, this.physicsEngine.getSpeed())
        
        this.updateShaderUniforms(elapsedTime)
        this.composer.render()
    }

    updateShaderUniforms(time) {
        this.motorcycle.traverse((child) => {
            if (child.material && child.material.uniforms) {
                child.material.uniforms.time.value = time
            }
        })
    }

    handleUpgrade(upgradeType) {
        if (this.activeUpgrades.has(upgradeType)) return
        
        this.activeUpgrades.add(upgradeType)
        this.applyUpgradeEffects(upgradeType)
        this.updateVisuals(upgradeType)
        this.recalculatePerformanceMetrics()
    }
}

const app = new MotorcyclePerformanceApp()
