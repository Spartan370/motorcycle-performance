class UIController {
    constructor() {
        this.initializeElements()
        this.setupEventHandlers()
        this.setupAnimations()
    }

    initializeElements() {
        this.upgradeButtons = document.querySelectorAll('.upgrade-btn')
        this.statDisplays = document.querySelectorAll('.stat-value')
        this.modelRotator = document.querySelector('.model-container')
        this.tooltips = document.querySelectorAll('[data-tooltip]')
    }

    setupEventHandlers() {
        this.upgradeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleUpgradeSelection(button)
                this.animateUpgradeEffect(button)
            })
        })

        this.modelRotator.addEventListener('mousemove', (e) => {
            this.handleModelRotation(e)
        })
    }

    setupAnimations() {
        gsap.registerPlugin(ScrollTrigger)
        
        gsap.from('.stat-value', {
            textContent: 0,
            duration: 2,
            ease: 'power1.out',
            snap: { textContent: 1 },
            stagger: 0.2
        })
    }

    handleUpgradeSelection(button) {
        const upgradeType = button.dataset.upgrade
        const upgradeLevel = button.dataset.level
        
        this.updatePerformanceStats(upgradeType, upgradeLevel)
        this.animateStatChanges()
    }

    updatePerformanceStats(type, level) {
        const stats = this.calculateNewStats(type, level)
        
        Object.entries(stats).forEach(([stat, value]) => {
            const display = document.querySelector(`[data-stat="${stat}"]`)
            if (display) {
                gsap.to(display, {
                    textContent: value,
                    duration: 1,
                    snap: { textContent: 1 }
                })
            }
        })
    }

    animateUpgradeEffect(button) {
        gsap.to(button, {
            scale: 1.1,
            duration: 0.2,
            yoyo: true,
            repeat: 1
        })

        this.createParticleEffect(button)
    }

    createParticleEffect(element) {
        const particles = 12
        const colors = ['#ff0000', '#ff3333', '#ff6666']

        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div')
            particle.className = 'upgrade-particle'
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
            
            const rect = element.getBoundingClientRect()
            particle.style.left = `${rect.left + rect.width / 2}px`
            particle.style.top = `${rect.top + rect.height / 2}px`
            
            document.body.appendChild(particle)

            gsap.to(particle, {
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100,
                opacity: 0,
                duration: 0.6,
                onComplete: () => particle.remove()
            })
        }
    }

    handleModelRotation(e) {
        const rect = this.modelRotator.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        const y = (e.clientY - rect.top) / rect.height
        
        gsap.to(this.modelRotator, {
            rotationY: -20 + (x * 40),
            rotationX: 10 - (y * 20),
            duration: 0.5
        })
    }

    updateTooltipPositions() {
        this.tooltips.forEach(tooltip => {
            const element = document.querySelector(tooltip.dataset.tooltip)
            const rect = element.getBoundingClientRect()
            
            gsap.set(tooltip, {
                x: rect.left + rect.width / 2,
                y: rect.top - 10
            })
        })
    }

    calculateNewStats(type, level) {
        return {
            power: 200,
            torque: 115,
            weight: 195,
            handling: 95
        }
    }
}

export default UIController
