class AdvancedSystems {
    constructor() {
        this.systems = {
            traction: 50,
            abs: 50,
            wheelie: 50,
            launch: 50
        }

        this.ridingModes = {
            rain: {
                traction: 80,
                abs: 70,
                wheelie: 30,
                launch: 20
            },
            road: {
                traction: 50,
                abs: 50,
                wheelie: 50,
                launch: 50
            },
            sport: {
                traction: 30,
                abs: 30,
                wheelie: 70,
                launch: 70
            },
            race: {
                traction: 20,
                abs: 20,
                wheelie: 90,
                launch: 90
            }
        }

        this.telemetry = {
            rpm: 0,
            speed: 0,
            gear: 1,
            leanAngle: 0,
            acceleration: 0,
            brakeForce: 0
        }

        this.currentMode = 'road'
        this.isSimulationActive = false
    }

    setRidingMode(mode) {
        if (this.ridingModes[mode]) {
            this.currentMode = mode
            this.systems = { ...this.ridingModes[mode] }
        }
    }

    updateSystem(system, value) {
        if (system in this.systems) {
            this.systems[system] = parseInt(value)
        }
    }

    toggleSimulation(active) {
        this.isSimulationActive = active
        if (active) {
            this.startTelemetryUpdate()
        }
    }

    startTelemetryUpdate() {
        if (!this.isSimulationActive) return

        this.telemetry.rpm = this.calculateRPM()
        this.telemetry.speed = this.calculateSpeed()
        this.telemetry.gear = this.calculateGear()
        this.telemetry.leanAngle = this.calculateLeanAngle()
    }

    calculateRPM() {
        const baseRPM = this.telemetry.rpm
        const acceleration = this.systems.launch / 100
        const maxRPM = 14000
        
        let newRPM = baseRPM + (acceleration * 1000)
        if (newRPM > maxRPM) newRPM = maxRPM

        return newRPM
    }

    calculateSpeed() {
        const wheelCircumference = 2 * Math.PI * 0.3
        const rpmToSpeed = (this.telemetry.rpm / 60) * wheelCircumference * 3.6
        return rpmToSpeed * (this.systems.traction / 100)
    }

    calculateGear() {
        const speed = this.telemetry.speed
        if (speed < 40) return 1
        if (speed < 80) return 2
        if (speed < 120) return 3
        if (speed < 160) return 4
        if (speed < 200) return 5
        return 6
    }

    calculateLeanAngle() {
        const maxLean = 55
        const tractionInfluence = this.systems.traction / 100
        return Math.sin(this.telemetry.speed / 200) * maxLean * tractionInfluence
    }

    processTractionControl(wheelSpeed, groundSpeed) {
        const slipRatio = (wheelSpeed - groundSpeed) / groundSpeed
        const tractionLimit = this.systems.traction / 100
        return slipRatio > tractionLimit
    }

    processABS(wheelSpeed, groundSpeed) {
        const slipRatio = (groundSpeed - wheelSpeed) / groundSpeed
        const absThreshold = this.systems.abs / 100
        return slipRatio > absThreshold
    }

    processWheelie(pitchAngle) {
        const wheelieLimit = this.systems.wheelie / 100
        return pitchAngle > wheelieLimit * 45
    }

    processLaunchControl(rpm, wheelSpeed) {
        const launchLimit = this.systems.launch / 100
        const maxLaunchRPM = 8000 + (launchLimit * 4000)
        return rpm > maxLaunchRPM
    }

    getTelemetryData() {
        return { ...this.telemetry }
    }

    getSystemStatus() {
        return { ...this.systems }
    }

    getCurrentMode() {
        return this.currentMode
    }
}

export default AdvancedSystems
