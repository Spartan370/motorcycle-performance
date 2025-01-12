class PremiumMotorcycleApp {
    constructor() {
        this.initializeUI()
        this.setupEventListeners()
        this.loadBikeData()
        this.setupThemeToggle()
        this.initializeGraphs()
        this.initializeModelViewer()
        this.initializePerformanceMetrics()
    }

    initializeUI() {
        this.navItems = document.querySelectorAll('.nav-item')
        this.bikeModels = document.querySelectorAll('.bike-preview')
        this.categoryBtns = document.querySelectorAll('.category-btn')
        this.modelSelector = document.getElementById('bikeModel')
        this.upgradeButtons = document.querySelectorAll('.upgrade-btn')
        this.performanceDisplays = document.querySelectorAll('.performance-metric')
        
        this.setupNavHighlight()
        this.initializeTooltips()
    }

    setupEventListeners() {
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault()
                this.handleNavigation(item)
            })
        })

        this.bikeModels.forEach(model => {
            model.addEventListener('click', () => this.switchBikeModel(model))
        })

        this.categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchCategory(btn))
        })

        this.modelSelector.addEventListener('change', (e) => {
            this.updateBikeModel(e.target.value)
        })

        this.upgradeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.handleUpgrade(btn.dataset.upgrade))
        })

        window.addEventListener('resize', () => {
            this.handleResize()
        })

        setInterval(() => {
            this.updatePerformanceMetrics()
        }, 1000 / 60)
    }

    handleNavigation(item) {
        this.navItems.forEach(nav => nav.classList.remove('active'))
        item.classList.add('active')
        
        const section = item.getAttribute('href').substring(1)
        this.loadSectionContent(section)
    }

    switchBikeModel(model) {
        this.bikeModels.forEach(bike => bike.classList.remove('active'))
        model.classList.add('active')
        
        const modelId = model.dataset.model
        this.updateModelViewer(modelId)
        this.updatePerformanceGraphs(modelId)
        this.resetUpgrades()
    }

    updateModelViewer(modelId) {
        this.showLoadingSpinner()
        this.modelViewer.loadModel(`models/${modelId}.glb`, () => {
            this.hideLoadingSpinner()
            this.updateSpecs(modelId)
        })
    }

    updatePerformanceGraphs(modelId) {
        const performanceData = this.bikeData[modelId].performance
        this.powerGraph.updateData(performanceData.powerCurve)
        this.torqueGraph.updateData(performanceData.torqueCurve)
        this.accelerationGraph.updateData(performanceData.accelerationCurve)
    }

    handleUpgrade(upgradeId) {
        const upgrade = this.upgradeData[upgradeId]
        if (this.canApplyUpgrade(upgrade)) {
            this.applyUpgrade(upgrade)
            this.updateTotalStats()
            this.updateVisuals(upgrade)
        }
    }

    updatePerformanceMetrics() {
        const metrics = this.calculateCurrentPerformance()
        this.performanceDisplays.forEach(display => {
            const metric = display.dataset.metric
            display.textContent = metrics[metric].toFixed(1)
        })
    }

    calculateCurrentPerformance() {
        return {
            power: this.basePower + this.powerGain,
            torque: this.baseTorque + this.torqueGain,
            weight: this.baseWeight + this.weightReduction,
            handling: this.baseHandling + this.handlingImprovement
        }
    }

    showLoadingSpinner() {
        document.querySelector('.loading-overlay').style.display = 'flex'
    }

    hideLoadingSpinner() {
        document.querySelector('.loading-overlay').style.display = 'none'
    }

    handleResize() {
        this.modelViewer.updateDimensions()
        this.powerGraph.resize()
        this.torqueGraph.resize()
        this.accelerationGraph.resize()
    }

    setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle')
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme')
            themeToggle.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙'
            this.updateThemeColors()
        })
    }

    updateThemeColors() {
        const isDark = document.body.classList.contains('dark-theme')
        const colors = isDark ? this.darkThemeColors : this.lightThemeColors
        document.documentElement.style.setProperty('--primary-color', colors.primary)
        document.documentElement.style.setProperty('--secondary-color', colors.secondary)
        document.documentElement.style.setProperty('--background-dark', colors.background)
    }

    initializeTooltips() {
        const tooltips = document.querySelectorAll('[data-tooltip]')
        tooltips.forEach(element => {
            new Tooltip(element)
        })
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new PremiumMotorcycleApp()
})
