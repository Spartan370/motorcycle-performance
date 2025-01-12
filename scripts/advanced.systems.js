class AdvancedSystems {
    constructor() {
        this.systems = {
            abs: new ABSSystem(),
            tcs: new TractionControlSystem(),
            quickshifter: new QuickshifterSystem(),
            wheelieControl: new WheelineControlSystem(),
            launchControl: new LaunchControlSystem()
        }
        
        this.initializeSystems()
    }

    initializeSystems() {
        this.setupSensorData()
        this.setupControlModules()
        this.initializeIMU()
    }

    setupSensorData() {
        this.sensorData = {
            wheelSpeed: { front: 0, rear: 0 },
            lean: { angle: 0, rate: 0 },
            acceleration: { x: 0, y: 0, z: 0 },
            throttle: 0,
            brake: { front: 0, rear: 0 }
        }
    }

    setupControlModules() {
        this.controlModules = {
            powerMode: 1,
            absLevel: 2,
            tcsLevel: 2,
            wheelieLevel: 2,
            engineBrakeLevel: 2
        }
    }

    initializeIMU() {
        this.imuData = {
            pitch: 0,
            roll: 0,
            yaw: 0,
            acceleration: new THREE.Vector3(),
            gyro: new THREE.Vector3()
        }
    }

    update(deltaTime) {
        this.updateSensorData()
        this.updateIMU()
        this.processSystems(deltaTime)
    }

    updateSensorData() {
        this.sensorData.wheelSpeed.front = this.calculateWheelSpeed('front')
        this.sensorData.wheelSpeed.rear = this.calculateWheelSpeed('rear')
        this.sensorData.lean.angle = this.calculateLeanAngle()
    }

    updateIMU() {
        this.imuData.pitch += this.imuData.gyro.x * 0.016
        this.imuData.roll += this.imuData.gyro.y * 0.016
        this.imuData.yaw += this.imuData.gyro.z * 0.016
    }

    processSystems(deltaTime) {
        Object.values(this.systems).forEach(system => {
            system.process(this.sensorData, deltaTime)
        })
    }

    calculateWheelSpeed(wheel) {
        const rpm = wheel === 'front' ? this.sensorData.wheelSpeed.front : this.sensorData.wheelSpeed.rear
        return (rpm * Math.PI * 0.6604) / 60
    }

    calculateLeanAngle() {
        return Math.atan2(this.imuData.acceleration.y, this.imuData.acceleration.z)
    }

    setRidingMode(mode) {
        const modes = {
            rain: { power: 3, abs: 3, tcs: 3, wheelie: 3 },
            road: { power: 2, abs: 2, tcs: 2, wheelie: 2 },
            sport: { power: 1, abs: 1, tcs: 1, wheelie: 1 },
            track: { power: 1, abs: 1, tcs: 0, wheelie: 0 }
        }
        
        const settings = modes[mode]
        this.updateSystemSettings(settings)
    }

    updateSystemSettings(settings) {
        this.controlModules.powerMode = settings.power
        this.controlModules.absLevel = settings.abs
        this.controlModules.tcsLevel = settings.tcs
        this.controlModules.wheelieLevel = settings.wheelie
    }

    getSystemStatus() {
        return {
            abs: this.systems.abs.getStatus(),
            tcs: this.systems.tcs.getStatus(),
            quickshifter: this.systems.quickshifter.getStatus(),
            wheelieControl: this.systems.wheelieControl.getStatus(),
            launchControl: this.systems.launchControl.getStatus()
        }
    }
}

export default AdvancedSystems
