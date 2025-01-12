class MotorcyclePerformanceSystem {
    constructor() {
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        this.performanceMetrics = new Map()
        this.upgradeTree = new WeakMap()
        this.activeModifications = new Set()
        
        this.initializeWebGL()
        this.setupPostProcessing()
        this.initializePhysicsEngine()
        this.createDynamicLightingSystem()
    }

    initializeWebGL() {
        this.renderer.setPixelRatio(window.devicePixelRatio * 1.5)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping
        this.renderer.toneMappingExposure = 1.5
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    }

    setupPostProcessing() {
        const composer = new EffectComposer(this.renderer)
        const renderPass = new RenderPass(this.scene, this.camera)
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, 0.4, 0.85
        )
        composer.addPass(renderPass)
        composer.addPass(bloomPass)
        this.composer = composer
    }

    initializePhysicsEngine() {
        this.physicsWorld = new CANNON.World()
        this.physicsWorld.gravity.set(0, -9.82, 0)
        this.physicsWorld.broadphase = new CANNON.SAPBroadphase(this.physicsWorld)
        this.physicsWorld.solver.iterations = 20
        this.physicsWorld.defaultContactMaterial.friction = 0.5
    }

    createDynamicLightingSystem() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        const pointLight = new THREE.PointLight(0xff0000, 2, 100)
        
        directionalLight.position.set(5, 5, 5)
        directionalLight.castShadow = true
        directionalLight.shadow.mapSize.width = 2048
        directionalLight.shadow.mapSize.height = 2048
        
        this.scene.add(ambientLight)
        this.scene.add(directionalLight)
        this.scene.add(pointLight)
    }

    async loadMotorcycleModel(modelPath) {
        const loader = new THREE.GLTFLoader()
        const dracoLoader = new THREE.DRACOLoader()
        dracoLoader.setDecoderPath('/draco/')
        loader.setDRACOLoader(dracoLoader)

        try {
            const gltf = await loader.loadAsync(modelPath)
            this.motorcycleModel = gltf.scene
            this.setupModelInteractivity()
            this.createCustomShaderMaterials()
            this.scene.add(this.motorcycleModel)
        } catch (error) {
            console.error('Model loading failed:', error)
        }
    }

    createCustomShaderMaterials() {
        const vertexShader = `
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `

        const fragmentShader = `
            varying vec3 vNormal;
            varying vec3 vPosition;
            uniform vec3 color;
            uniform float glossiness;
            
            void main() {
                vec3 light = normalize(vec3(1.0, 1.0, 1.0));
                float intensity = pow(0.5 + 0.5 * dot(vNormal, light), glossiness);
                vec3 finalColor = color * intensity;
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `

        this.customMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(0x800000) },
                glossiness: { value: 30.0 }
            },
            vertexShader,
            fragmentShader
        })
    }

    calculatePerformanceMetrics() {
        const metrics = {
            power: 0,
            torque: 0,
            acceleration: 0,
            handling: 0
        }

        this.activeModifications.forEach(mod => {
            metrics.power += mod.powerGain
            metrics.torque += mod.torqueGain
            metrics.acceleration += mod.accelerationBoost
            metrics.handling += mod.handlingImprovement
        })

        return this.applyDynamicScaling(metrics)
    }

    applyDynamicScaling(metrics) {
        const scalingFactor = Math.log(1 + metrics.power / 100)
        return {
            ...metrics,
            power: metrics.power * scalingFactor,
            torque: metrics.torque * Math.sqrt(scalingFactor)
        }
    }
}
