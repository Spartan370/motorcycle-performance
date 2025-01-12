class ModelViewer {
    constructor() {
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        this.loader = new THREE.GLTFLoader()
        this.model = null
        this.setupRenderer()
        this.setupLights()
        this.setupCamera()
        this.setupPostProcessing()
    }

    setupRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.shadowMap.enabled = true
        document.querySelector('.model-container').appendChild(this.renderer.domElement)
    }

    loadModel(path, onProgress) {
        this.loader.load(
            path,
            (gltf) => {
                if (this.model) this.scene.remove(this.model)
                this.model = gltf.scene
                this.scene.add(this.model)
                this.setupMaterials()
                onProgress()
            },
            (xhr) => {
                const progress = (xhr.loaded / xhr.total) * 100
                onProgress(progress)
            },
            (error) => {
                console.error('Model loading error:', error)
                onProgress()
            }
        )
    }

    setupMaterials() {
        this.model.traverse((child) => {
            if (child.isMesh) {
                if (child.name.includes('body')) {
                    child.material = new THREE.ShaderMaterial(motorcyclePaintShader)
                } else if (child.name.includes('carbon')) {
                    child.material = new THREE.ShaderMaterial(carbonFiberShader)
                } else if (child.name.includes('chrome')) {
                    child.material = new THREE.ShaderMaterial(chromeShader)
                }
            }
        })
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(5, 5, 5)
        directionalLight.castShadow = true
        this.scene.add(ambientLight, directionalLight)
    }

    setupCamera() {
        this.camera.position.set(0, 2, 5)
        this.camera.lookAt(0, 0, 0)
    }

    setupPostProcessing() {
        this.composer = new THREE.EffectComposer(this.renderer)
        this.renderPass = new THREE.RenderPass(this.scene, this.camera)
        this.composer.addPass(this.renderPass)

        this.bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, 0.4, 0.85
        )
        this.composer.addPass(this.bloomPass)
    }

    setViewMode(mode) {
        if (!this.model) return
        
        this.model.traverse((child) => {
            if (child.isMesh) {
                switch(mode) {
                    case 'wireframe':
                        child.material.wireframe = true
                        break
                    case 'xray':
                        child.material.transparent = true
                        child.material.opacity = 0.3
                        break
                    default:
                        child.material.wireframe = false
                        child.material.transparent = false
                        child.material.opacity = 1
                }
            }
        })
    }

    updateModelPosition(position, rotation) {
        if (this.model) {
            this.model.position.copy(position)
            this.model.quaternion.copy(rotation)
        }
    }

    render() {
        this.composer.render()
    }
}

export default ModelViewer

    initializeControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.05
        this.controls.minDistance = 3
        this.controls.maxDistance = 10
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(window.innerWidth, window.innerHeight)
            this.composer.setSize(window.innerWidth, window.innerHeight)
        })
    }

    explodeModel() {
        if (!this.model) return
        const center = new THREE.Vector3()
        this.model.traverse((child) => {
            if (child.isMesh) {
                const direction = child.position.clone().sub(center).normalize()
                gsap.to(child.position, {
                    x: direction.x * 2,
                    y: direction.y * 2,
                    z: direction.z * 2,
                    duration: 1,
                    ease: "power2.out"
                })
            }
        })
    }

    resetModel() {
        if (!this.model) return
        this.model.traverse((child) => {
            if (child.isMesh) {
                gsap.to(child.position, {
                    x: child.userData.originalPosition.x,
                    y: child.userData.originalPosition.y,
                    z: child.userData.originalPosition.z,
                    duration: 1,
                    ease: "power2.in"
                })
            }
        })
    }

    toggleLights() {
        this.lights.forEach(light => {
            light.visible = !light.visible
        })
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this))
        this.controls.update()
        
        if (this.model) {
            this.model.traverse((child) => {
                if (child.isMesh && child.material.uniforms) {
                    child.material.uniforms.time.value += 0.016
                }
            })
        }
        
        this.render()
    }

    saveModelState() {
        if (!this.model) return
        this.model.traverse((child) => {
            if (child.isMesh) {
                child.userData.originalPosition = child.position.clone()
            }
        })
    }
}
