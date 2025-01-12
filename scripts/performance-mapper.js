class PerformanceMapper {
    constructor() {
        this.metrics = {
            power: [],
            torque: [],
            acceleration: [],
            handling: []
        }
        this.setupMetrics()
    }

    setupMetrics() {
        this.powerCurve = new CurveCalculator('power')
        this.torqueCurve = new CurveCalculator('torque')
        this.gearRatios = [2.885, 2.062, 1.762, 1.522, 1.333, 1.200]
    }

    calculatePerformance(rpm, throttle, gear) {
        const powerOutput = this.powerCurve.getValue(rpm) * throttle
        const torqueOutput = this.torqueCurve.getValue(rpm) * throttle
        const wheelForce = this.calculateWheelForce(torqueOutput, gear)
        
        return {
            power: powerOutput,
            torque: torqueOutput,
            force: wheelForce
        }
    }

    calculateWheelForce(torque, gear) {
        const gearRatio = this.gearRatios[gear - 1]
        const finalDrive = 2.933
        const wheelRadius = 0.3302 // meters
        
        return (torque * gearRatio * finalDrive) / wheelRadius
    }

    mapPerformanceData(data) {
        const mappedData = {
            rpm: new Float32Array(1000),
            power: new Float32Array(1000),
            torque: new Float32Array(1000)
        }
        
        for (let i = 0; i < 1000; i++) {
            const rpm = i * (14000 / 1000)
            mappedData.rpm[i] = rpm
            mappedData.power[i] = this.powerCurve.getValue(rpm)
            mappedData.torque[i] = this.torqueCurve.getValue(rpm)
        }
        
        return mappedData
    }

    updateWithUpgrades(upgrades) {
        this.powerCurve.applyModifiers(upgrades.power)
        this.torqueCurve.applyModifiers(upgrades.torque)
    }
}

class CurveCalculator {
    constructor(type) {
        this.type = type
        this.basePoints = this.getBasePoints()
        this.modifiers = []
    }

    getBasePoints() {
        return this.type === 'power' ? [
            { rpm: 0, value: 0 },
            { rpm: 4000, value: 60 },
            { rpm: 8000, value: 120 },
            { rpm: 10000, value: 180 },
            { rpm: 12000, value: 200 },
            { rpm: 14000, value: 190 }
        ] : [
            { rpm: 0, value: 0 },
            { rpm: 2000, value: 80 },
            { rpm: 4000, value: 100 },
            { rpm: 6000, value: 115 },
            { rpm: 8000, value: 112 },
            { rpm: 10000, value: 105 }
        ]
    }

    getValue(rpm) {
        let value = this.interpolate(rpm)
        this.modifiers.forEach(mod => {
            value *= mod.multiplier
        })
        return value
    }

    interpolate(rpm) {
        const points = this.basePoints
        
        for (let i = 0; i < points.length - 1; i++) {
            if (rpm >= points[i].rpm && rpm <= points[i + 1].rpm) {
                const t = (rpm - points[i].rpm) / (points[i + 1].rpm - points[i].rpm)
                return points[i].value + t * (points[i + 1].value - points[i].value)
            }
        }
        
        return 0
    }

    applyModifiers(mods) {
        this.modifiers = mods
    }
}

export default PerformanceMapper
