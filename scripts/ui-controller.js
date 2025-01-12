class UIController {
    constructor() {
        this.activeModel = 'r1'
        this.isDarkMode = true
        this.initializeElements()
        this.setupEventListeners()
        this.setupAnimations()
    }

    initializeElements() {
        this.elements = {
            themeToggle: document.querySelector('.theme-toggle'),
            modelSelector: document.getElementById('bikeModel'),
            upgradeButtons: document.querySelectorAll('.upgrade-btn'),
            modeButtons: document.querySelectorAll('.mode-btn'),
            systemSliders: document.querySelectorAll('.system-slider'),
            metricValues: document.querySelectorAll('.metric-value'),
            categoryButtons: document.querySelectorAll('.category-btn'),
            viewButtons: document.querySelectorAll('.view-btn'),
            controlButtons: document.querySelectorAll('.control-btn')
        }
    }

    setupEventListeners() {
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme())
        this.elements.modelSelector.addEventListener('change', (e) => this.handleModelChange(e))
        
        this.elements.upgradeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleUpgrade(e))
        })

        this.elements.modeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleModeChange(e))
        })

        this.elements.systemSliders.forEach(slider => {
            slider.addEventListener('input', (e) => this.handleSystemChange(e))
        })

        this.elements.categoryButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleCategoryChange(e))
        })

        this.elements.viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleViewChange(e))
        })

        this.elements.controlButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleControlClick(e))
        })
    }

    setupAnimations() {
        this.animations = {
            buttonPress: {
                scale: 0.95,
                duration: 0.1
            },
            valueChange: {
                duration: 0.3,
                ease: "power2.out"
            }
        }
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode
        document.body.classList.toggle('light-mode')
        this.elements.themeToggle.textContent = this.isDarkMode ? '🌙' : '☀️'
        this.updateThemeColors()
    }

    updateThemeColors() {
        const theme = this.isDarkMode ? {
            background: '#0a0a0a',
            text: '#ffffff',
            accent: '#ff0000'
        } : {
            background: '#ffffff',
            text: '#0a0a0a',
            accent: '#cc0000'
        }

        document.documentElement.style.setProperty('--background-color', theme.background)
        document.documentElement.style.setProperty('--text-color', theme.text)
        document.documentElement.style.setProperty('--accent-color', theme.accent)
    }

    handleModelChange(event) {
        this.activeModel = event.target.value
        this.updateModelDisplay()
        this.animateModelChange()
    }

    handleUpgrade(event) {
        const upgradeBtn = event.target
        const upgradeType = upgradeBtn.dataset.upgrade
        
        gsap.to(upgradeBtn, {
            scale: this.animations.buttonPress.scale,
            duration: this.animations.buttonPress.duration,
            yoyo: true,
            repeat: 1
        })

        this.applyUpgrade(upgradeType)
    }

    handleModeChange(event) {
        const modeButtons = this.elements.modeButtons
        modeButtons.forEach(btn => btn.classList.remove('active'))
        event.target.classList.add('active')
        
        this.updateRidingMode(event.target.dataset.mode)
    }

    handleSystemChange(event) {
        const slider = event.target
        const system = slider.dataset.system
        const value = slider.value
        
        this.updateSystemValue(system, value)
    }

    handleCategoryChange(event) {
        const categoryButtons = this.elements.categoryButtons
        categoryButtons.forEach(btn => btn.classList.remove('active'))
        event.target.classList.add('active')
        
        this.showUpgradeCategory(event.target.dataset.category)
    }

    handleViewChange(event) {
        const viewButtons = this.elements.viewButtons
        viewButtons.forEach(btn => btn.classList.remove('active'))
        event.target.classList.add('active')
        
        this.changeModelView(event.target.dataset.view)
    }

    handleControlClick(event) {
        const control = event.target.dataset.control
        this.executeModelControl(control)
    }

    updateModelDisplay() {
        const previews = document.querySelectorAll('.bike-preview')
        previews.forEach(preview => {
            preview.classList.toggle('active', preview.dataset.model === this.activeModel)
        })
    }

    animateModelChange() {
        gsap.from('.bike-preview.active', {
            opacity: 0,
            scale: 0.9,
            duration: 0.5,
            ease: "power2.out"
        })
    }

    updatePerformanceStats(stats) {
        Object.entries(stats).forEach(([stat, value]) => {
            const element = document.querySelector(`[data-metric="${stat}"]`)
            if (element) {
                gsap.to(element, {
                    innerText: Math.round(value),
                    duration: this.animations.valueChange.duration,
                    ease: this.animations.valueChange.ease,
                    snap: { innerText: 1 }
                })
            }
        })
    }

    showUpgradeCategory(category) {
        const sections = document.querySelectorAll('.upgrade-section')
        sections.forEach(section => {
            section.classList.toggle('active', section.dataset.category === category)
        })
    }

    changeModelView(view) {
        document.dispatchEvent(new CustomEvent('viewChange', { detail: view }))
    }

    executeModelControl(control) {
        document.dispatchEvent(new CustomEvent('modelControl', { detail: control }))
    }
}

export default UIController
