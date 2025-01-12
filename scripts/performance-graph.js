class PerformanceGraph {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId)
        this.ctx = this.canvas.getContext('2d')
        this.data = []
        this.maxValue = 0
        this.minValue = 0
        this.gridSize = 50
        this.padding = 20
        this.colors = {
            line: '#800000',
            background: 'rgba(0, 0, 0, 0.3)',
            grid: 'rgba(255, 255, 255, 0.1)',
            text: '#ffffff'
        }
        
        this.setupCanvas()
        this.addEventListeners()
    }

    setupCanvas() {
        this.canvas.width = this.canvas.offsetWidth * window.devicePixelRatio
        this.canvas.height = this.canvas.offsetHeight * window.devicePixelRatio
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    addEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => this.handleHover(e))
        window.addEventListener('resize', () => this.resize())
    }

    updateData(newData) {
        this.data = newData
        this.maxValue = Math.max(...newData)
        this.minValue = Math.min(...newData)
        this.draw()
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.drawBackground()
        this.drawGrid()
        this.drawAxes()
        this.drawData()
        this.drawLabels()
    }

    drawBackground() {
        this.ctx.fillStyle = this.colors.background
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    drawGrid() {
        this.ctx.beginPath()
        this.ctx.strokeStyle = this.colors.grid

        for(let i = 0; i <= this.canvas.width; i += this.gridSize) {
            this.ctx.moveTo(i, 0)
            this.ctx.lineTo(i, this.canvas.height)
        }

        for(let i = 0; i <= this.canvas.height; i += this.gridSize) {
            this.ctx.moveTo(0, i)
            this.ctx.lineTo(this.canvas.width, i)
        }

        this.ctx.stroke()
    }

    drawAxes() {
        this.ctx.beginPath()
        this.ctx.strokeStyle = this.colors.text
        this.ctx.lineWidth = 2

        this.ctx.moveTo(this.padding, this.padding)
        this.ctx.lineTo(this.padding, this.canvas.height - this.padding)
        this.ctx.lineTo(this.canvas.width - this.padding, this.canvas.height - this.padding)

        this.ctx.stroke()
    }

    drawData() {
        if(this.data.length < 2) return

        this.ctx.beginPath()
        this.ctx.strokeStyle = this.colors.line
        this.ctx.lineWidth = 3

        const xStep = (this.canvas.width - 2 * this.padding) / (this.data.length - 1)
        const yScale = (this.canvas.height - 2 * this.padding) / (this.maxValue - this.minValue)

        this.data.forEach((value, index) => {
            const x = this.padding + (index * xStep)
            const y = this.canvas.height - this.padding - ((value - this.minValue) * yScale)
            
            if(index === 0) {
                this.ctx.moveTo(x, y)
            } else {
                this.ctx.lineTo(x, y)
            }
        })

        this.ctx.stroke()
    }

    drawLabels() {
        this.ctx.fillStyle = this.colors.text
        this.ctx.font = '12px Space Grotesk'
        this.ctx.textAlign = 'right'

        const yStep = (this.maxValue - this.minValue) / 5
        for(let i = 0; i <= 5; i++) {
            const value = this.minValue + (yStep * i)
            const y = this.canvas.height - this.padding - (i * (this.canvas.height - 2 * this.padding) / 5)
            this.ctx.fillText(value.toFixed(0), this.padding - 5, y + 4)
        }
    }

    handleHover(e) {
        const rect = this.canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const xStep = (this.canvas.width - 2 * this.padding) / (this.data.length - 1)
        const index = Math.round((x - this.padding) / xStep)
        
        if(index >= 0 && index < this.data.length) {
            this.showTooltip(this.data[index], e.clientX, e.clientY)
        }
    }

    showTooltip(value, x, y) {
        const tooltip = document.getElementById('graph-tooltip') || this.createTooltip()
        tooltip.textContent = value.toFixed(1)
        tooltip.style.left = `${x + 10}px`
        tooltip.style.top = `${y - 20}px`
        tooltip.style.display = 'block'
    }

    createTooltip() {
        const tooltip = document.createElement('div')
        tooltip.id = 'graph-tooltip'
        tooltip.className = 'graph-tooltip'
        document.body.appendChild(tooltip)
        return tooltip
    }

    resize() {
        this.setupCanvas()
        this.draw()
    }
}
