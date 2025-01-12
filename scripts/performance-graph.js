class PerformanceGraph {
    constructor() {
        this.powerCanvas = document.getElementById('powerCurve')
        this.torqueCanvas = document.getElementById('torqueCurve')
        this.accelerationCanvas = document.getElementById('accelerationCurve')
        
        this.powerCtx = this.powerCanvas.getContext('2d')
        this.torqueCtx = this.torqueCanvas.getContext('2d')
        this.accelerationCtx = this.accelerationCanvas.getContext('2d')
        
        this.graphWidth = this.powerCanvas.width
        this.graphHeight = this.powerCanvas.height
        
        this.setupGraphStyles()
        this.initializeGraphs()
    }

    setupGraphStyles() {
        this.styles = {
            backgroundColor: '#1a1a1a',
            gridColor: '#333333',
            powerColor: '#ff0000',
            torqueColor: '#00ff00',
            accelerationColor: '#0088ff',
            textColor: '#ffffff',
            font: '12px Space Grotesk'
        }
    }

    initializeGraphs() {
        [this.powerCanvas, this.torqueCanvas, this.accelerationCanvas].forEach(canvas => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio
            canvas.height = canvas.offsetHeight * window.devicePixelRatio
        })
    }

    updateGraphs(data) {
        this.clearGraphs()
        this.drawPowerCurve(data.powerCurve)
        this.drawTorqueCurve(data.torqueCurve)
        this.drawAccelerationCurve(data.accelerationCurve)
    }

    clearGraphs() {
        [this.powerCtx, this.torqueCtx, this.accelerationCtx].forEach(ctx => {
            ctx.fillStyle = this.styles.backgroundColor
            ctx.fillRect(0, 0, this.graphWidth, this.graphHeight)
            this.drawGrid(ctx)
        })
    }

    drawGrid(ctx) {
        ctx.strokeStyle = this.styles.gridColor
        ctx.lineWidth = 0.5

        for (let i = 0; i <= 10; i++) {
            const x = (i / 10) * this.graphWidth
            const y = (i / 10) * this.graphHeight

            ctx.beginPath()
            ctx.moveTo(x, 0)
            ctx.lineTo(x, this.graphHeight)
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(0, y)
            ctx.lineTo(this.graphWidth, y)
            ctx.stroke()
        }
    }

    drawPowerCurve(data) {
        this.drawCurve(this.powerCtx, data, this.styles.powerColor, 'Power (HP)')
    }

    drawTorqueCurve(data) {
        this.drawCurve(this.torqueCtx, data, this.styles.torqueColor, 'Torque (Nm)')
    }

    drawAccelerationCurve(data) {
        this.drawCurve(this.accelerationCtx, data, this.styles.accelerationColor, 'Acceleration (g)')
    }

    drawCurve(ctx, data, color, label) {
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.beginPath()

        data.forEach((point, index) => {
            const x = (point.rpm / 14000) * this.graphWidth
            const y = this.graphHeight - (point.value / this.getMaxValue(data)) * this.graphHeight

            if (index === 0) {
                ctx.moveTo(x, y)
            } else {
                ctx.lineTo(x, y)
            }
        })

        ctx.stroke()
        this.drawLabels(ctx, data, label)
    }

    drawLabels(ctx, data, label) {
        ctx.fillStyle = this.styles.textColor
        ctx.font = this.styles.font
        ctx.fillText(label, 10, 20)

        const maxValue = this.getMaxValue(data)
        ctx.fillText(`${Math.round(maxValue)}`, 10, 40)
    }

    getMaxValue(data) {
        return Math.max(...data.map(point => point.value))
    }

    handleResize() {
        this.initializeGraphs()
        this.clearGraphs()
    }

    animateGraph(data, duration = 1000) {
        const startTime = performance.now()
        const animate = (currentTime) => {
            const progress = (currentTime - startTime) / duration
            
            if (progress < 1) {
                const currentData = data.map(point => ({
                    rpm: point.rpm,
                    value: point.value * progress
                }))
                this.updateGraphs({ powerCurve: currentData })
                requestAnimationFrame(animate)
            } else {
                this.updateGraphs({ powerCurve: data })
            }
        }
        requestAnimationFrame(animate)
    }
}

export default PerformanceGraph
