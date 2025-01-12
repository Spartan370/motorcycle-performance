class ModelViewer {
    constructor() {
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
        this.loader = new THREE.GLTFLoader()
        this.currentModel = null
        this.lights = []
        
        this.initialize()
    }

    initialize() {
        this.setupRenderer()
        this.setupCamera()
        this.setupLights()
        this.setupEnvironment()
        this.setupPostProcessing()
        this.animate()
    }

    setupRenderer() {
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping
        this.renderer.toneMappingExposure = 1.5
        this.renderer.shadowMap.enabled = true
        document.querySelector('.model-container').appendChild(this.renderer.domElement)
    }

    setupCamera() {
        this.camera.position.set(5, 2, 5)
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.05
        this.controls.maxPolarAngle = Math.PI / 1.5
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        const mainLight = new THREE.DirectionalLight(0xffffff, 1)
        const rimLight = new THREE.SpotLight(0xff0000, 2)
        
        mainLight.position.set(5, 5, 5)
        rimLight.position.set(-5, 3, -5)
        
        this.lights.push(ambientLight, mainLight, rimLight)
        this.lights.forEach(light => this.scene.add(light))
    }

    setupEnvironment() {
        const envMapLoader = new THREE.PMREMGenerator(this.renderer)
        new THREE.RGBELoader()
            .load('textures/studio_environment.hdr', (texture) => {
                const envMap = envMapLoader.fromEquirectangular(texture).texture
                this.scene.environment = envMap
                texture.dispose()
            })
    }

    setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer)
        
        const renderPass = new RenderPass(this.scene, this.camera)
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, 0.4, 0.85
        )
        
        this.composer.addPass(renderPass)
        this.composer.addPass(bloomPass)
    }

    loadModel(modelPath, callback) {
        this.loader.load(modelPath, (gltf) => {
            if (this.currentModel) {
                this.scene.remove(this.currentModel)
            }
            
            this.currentModel = gltf.scene
            this.setupModelMaterials()
            this.scene.add(this.currentModel)
            
            this.centerModel()
            if (callback) callback()
        })
    }

    setupModelMaterials() {
        this.currentModel.traverse((child) => {
            if (child.isMesh) {
                if (child.name.includes('Body')) {
                    child.material = new THREE.ShaderMaterial(motorcyclePaintShader)
                } else if (child.name.includes('Carbon')) {
                    child.material = new THREE.ShaderMaterial(carbonFiberShader)
                }
            }
        })
    }

    centerModel() {
        const box = new THREE.Box3().setFromObject(this.currentModel)
        const center = box.getCenter(new THREE.Vector3())
        this.currentModel.position.sub(center)
    }

    animate() {
        requestAnimationFrame(() => this.animate())
        
        this.controls.update()
        this.updateShaders()
        this.composer.render()
    }

    updateShaders() {
        const time = performance.now() * 0.001
        
        this.currentModel?.traverse((child) => {
            if (child.material?.uniforms) {
                child.material.uniforms.time.value = time
            }
        })
    }

    handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.composer.setSize(window.innerWidth, window.innerHeight)
    }

    explodeView(enabled) {
        if (!this.currentModel) return
        
        const explodeDistance = enabled ? 2 : 0
        let i = 0
        
        this.currentModel.traverse((child) => {
            if (child.isMesh) {
                gsap.to(child.position, {
                    x: child.userData.originalPosition?.x || 0 + (enabled ? Math.cos(i) : 0) * explodeDistance,
                    y: child.userData.originalPosition?.y || 0 + (enabled ? Math.sin(i) : 0) * explodeDistance,
                    z: child.userData.originalPosition?.z || 0 + (enabled ? Math.cos(i + Math.PI) : 0) * explodeDistance,
                    duration: 1,
                    ease: 'power2.inOut'
                })
                i += Math.PI / 4
            }
        })
    }
}
