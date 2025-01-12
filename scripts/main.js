import ModelViewer from './model-viewer.js'
import PerformanceGraph from './performance-graph.js'
import UIController from './ui-controller.js'
import ParticleSystem from './particle-system.js'
import PhysicsEngine from './physics-engine.js'
import PerformanceMapper from './performance-mapper.js'
import AdvancedSystems from './advanced-systems.js'
import BikeData from './bike-data.js'

document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.querySelector('.loading-screen')
    const loadingProgress = document.querySelector('.loading-progress')
    const modelViewer = new ModelViewer()
    const performanceGraph = new PerformanceGraph()
    const uiController = new UIController()
    const particleSystem = new ParticleSystem()
    const physicsEngine = new PhysicsEngine()
    const performanceMapper = new PerformanceMapper()
    const advancedSystems = new AdvancedSystems()

    let currentBike = 'r1'
    let isSimulationRunning = false
    let lastFrameTime = 0
    let totalAssets = Object.keys(BikeData).length + 3
    let loadedAssets = 0

    function updateLoadingProgress(progress) {
        loadingProgress.textContent = `${Math.round(progress)}%`
        if (progress >= 100) {
            loadingScreen.style.opacity = '0'
            setTimeout(() => loadingScreen.style.display = 'none', 500)
        }
    }

    function trackAssetLoad() {
        loadedAssets++
        const progress = (loadedAssets / totalAssets) * 100
        updateLoadingProgress(progress)
    }

    function initializeApplication() {
        loadingScreen.style.display = 'flex'
        loadingScreen.style.opacity = '1'
        
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
        physicsEngine.createMotorcyclePhysics(bikeData.physics)
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

        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                isSimulationRunning = !isSimulationRunning
                advancedSystems.toggleSimulation(isSimulationRunning)
            }
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
        
        if (performance.acceleration > 0.8) {
            particleSystem.createExhaustEffect(physicsData.position)
        }
    }

    function updateTelemetry() {
        const telemetry = advancedSystems.getTelemetryData()
        document.querySelectorAll('[data-telemetry]').forEach(element => {
            const key = element.dataset.telemetry
            if (telemetry[key] !== undefined) {
                element.textContent = typeof telemetry[key] === 'number' 
                    ? telemetry[key].toFixed(1) 
                    : telemetry[key]
            }
        })
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

    initializeApplication()
})
