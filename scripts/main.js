document.addEventListener('DOMContentLoaded', () => {
    const modelViewer = new ModelViewer()
    const performanceGraph = new PerformanceGraph()
    const uiController = new UIController()
    const particleSystem = new ParticleSystem()
    const physicsEngine = new PhysicsEngine()
    const performanceMapper = new PerformanceMapper()
    const advancedSystems = new AdvancedSystems()
    const loadingScreen = document.querySelector('.loading-screen')
const loadingProgress = document.querySelector('.loading-progress')

function updateLoadingProgress(progress) {
    loadingProgress.textContent = `${Math.round(progress)}%`
    if (progress >= 100) {
        loadingScreen.style.opacity = '0'
        setTimeout(() => {
            loadingScreen.style.display = 'none'
        }, 500)
    }
}

let totalAssets = 0
let loadedAssets = 0

function trackAssetLoad() {
    loadedAssets++
    const progress = (loadedAssets / totalAssets) * 100
    updateLoadingProgress(progress)
}

function initializeLoading() {
    totalAssets = Object.keys(BikeData).length + 3 // bikes + essential assets
    loadingScreen.style.display = 'flex'
    loadingScreen.style.opacity = '1'
}

initializeLoading()

    let currentBike = 'r1'
    let isSimulationRunning = false
    let lastFrameTime = 0

    function initializeApplication() {
        loadInitialBikeData()
        setupEventListeners()
        startRenderLoop()
        initializePhysics()
    }

    function loadInitialBikeData() {
    const bikeData = BikeData[currentBike]
    modelViewer.loadModel(bikeData.modelPath, trackAssetLoad)
    performanceGraph.updateGraphs(bikeData.performance)
    uiController.updatePerformanceStats(bikeData.stats)
    trackAssetLoad()
    }

    function setupEventListeners() {
        document.getElementById('bikeModel').addEventListener('change', (e) => {
            currentBike = e.target.value
            loadInitialBikeData()
        })

        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode
                advancedSystems.setRidingMode(mode)
                updateSystemDisplays()
            })
        })

        document.querySelectorAll('.system-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const system = e.target.dataset.system
                const value = e.target.value
                advancedSystems.updateSystem(system, value)
                updateSystemDisplays()
            })
        })

        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.dataset.view
                modelViewer.setViewMode(view)
            })
        })
    }

    function startRenderLoop(timestamp = 0) {
        const deltaTime = (timestamp - lastFrameTime) / 1000
        lastFrameTime = timestamp

        if (isSimulationRunning) {
            updateSimulation(deltaTime)
        }

        modelViewer.render()
        particleSystem.update(deltaTime)
        updateTelemetry()

        requestAnimationFrame(startRenderLoop)
    }

    function initializePhysics() {
        const bikeData = BikeData[currentBike]
        physicsEngine.createMotorcyclePhysics(bikeData.physics)
    }

    function updateSimulation(deltaTime) {
        physicsEngine.update(deltaTime)
        const physicsData = physicsEngine.getSimulationData()
        modelViewer.updateModelPosition(physicsData.position, physicsData.rotation)
        
        const performance = performanceMapper.calculatePerformance(
            physicsData.rpm,
            physicsData.throttle,
            physicsData.gear
        )
        
        updatePerformanceDisplays(performance)
    }

    function updateTelemetry() {
        const telemetry = advancedSystems.getTelemetryData()
        document.getElementById('rpm-value').textContent = Math.round(telemetry.rpm)
        document.getElementById('speed-value').textContent = Math.round(telemetry.speed)
        document.getElementById('gear-value').textContent = telemetry.gear
        document.getElementById('lean-value').textContent = `${telemetry.leanAngle.toFixed(1)}°`
    }

    function updateSystemDisplays() {
        const systemStatus = advancedSystems.getSystemStatus()
        Object.entries(systemStatus).forEach(([system, value]) => {
            const display = document.querySelector(`[data-system="${system}"] + .system-value`)
            if (display) display.textContent = value
        })
    }

    function updatePerformanceDisplays(performance) {
        performanceGraph.updateGraphs({
            power: performance.power,
            torque: performance.torque,
            acceleration: performance.acceleration
        })

        document.querySelectorAll('.metric-value').forEach(metric => {
            const type = metric.dataset.metric
            if (performance[type]) {
                metric.textContent = Math.round(performance[type])
            }
        })
    }

    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            isSimulationRunning = !isSimulationRunning
            advancedSystems.toggleSimulation(isSimulationRunning)
        }
    })

    initializeApplication()
})
