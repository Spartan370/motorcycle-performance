const BikeData = {
    r1: {
        name: "Yamaha R1M 2024",
        specs: {
            engine: "998cc Inline-4",
            power: 200,
            torque: 112,
            weight: 201,
            topSpeed: 299
        },
        performance: {
            powerCurve: [
                0, 15, 35, 65, 95, 125, 155, 180, 195, 200,
                200, 198, 195, 190, 182, 170, 155, 140, 120, 100
            ],
            torqueCurve: [
                0, 40, 60, 75, 85, 95, 105, 112, 110, 108,
                105, 100, 95, 90, 85, 80, 75, 70, 65, 60
            ],
            accelerationCurve: [
                0, 0.5, 1.2, 2.1, 3.0, 3.8, 4.5, 5.1, 5.6, 6.0,
                6.3, 6.5, 6.7, 6.8, 6.9, 7.0, 7.0, 7.0, 7.0, 7.0
            ]
        },
        upgrades: {
            available: true,
            categories: ["Engine", "Suspension", "Exhaust", "Electronics"]
        }
    },
    v4: {
        name: "Ducati V4R 2024",
        specs: {
            engine: "998cc V4",
            power: 218,
            torque: 118,
            weight: 193,
            topSpeed: 299
        },
        performance: {
            powerCurve: [
                0, 20, 45, 75, 105, 140, 170, 195, 210, 218,
                218, 215, 210, 205, 195, 180, 165, 150, 130, 110
            ],
            torqueCurve: [
                0, 45, 65, 80, 90, 100, 110, 118, 115, 112,
                108, 105, 100, 95, 90, 85, 80, 75, 70, 65
            ],
            accelerationCurve: [
                0, 0.6, 1.4, 2.3, 3.2, 4.0, 4.7, 5.3, 5.8, 6.2,
                6.5, 6.7, 6.9, 7.0, 7.1, 7.2, 7.2, 7.2, 7.2, 7.2
            ]
        },
        upgrades: {
            available: true,
            categories: ["Engine", "Suspension", "Exhaust", "Electronics"]
        }
    },
    zx10r: {
        name: "Kawasaki ZX-10RR 2024",
        specs: {
            engine: "998cc Inline-4",
            power: 204,
            torque: 115,
            weight: 207,
            topSpeed: 299
        },
        performance: {
            powerCurve: [
                0, 18, 40, 70, 100, 130, 160, 185, 200, 204,
                204, 202, 198, 192, 185, 175, 160, 145, 125, 105
            ],
            torqueCurve: [
                0, 42, 62, 78, 88, 98, 108, 115, 113, 110,
                106, 102, 97, 92, 87, 82, 77, 72, 67, 62
            ],
            accelerationCurve: [
                0, 0.55, 1.3, 2.2, 3.1, 3.9, 4.6, 5.2, 5.7, 6.1,
                6.4, 6.6, 6.8, 6.9, 7.0, 7.1, 7.1, 7.1, 7.1, 7.1
            ]
        },
        upgrades: {
            available: true,
            categories: ["Engine", "Suspension", "Exhaust", "Electronics"]
        }
    }
}

const UpgradeData = {
    engine: {
        stage1: {
            name: "Stage 1 ECU Flash",
            power: 10,
            torque: 5,
            cost: 800
        },
        stage2: {
            name: "Stage 2 Performance Kit",
            power: 15,
            torque: 8,
            cost: 2500
        },
        stage3: {
            name: "Stage 3 Race Package",
            power: 25,
            torque: 12,
            cost: 5000
        }
    },
    exhaust: {
        slip_on: {
            name: "Slip-on Exhaust",
            power: 5,
            weight: -2,
            cost: 1200
        },
        full_system: {
            name: "Full Exhaust System",
            power: 12,
            weight: -4.5,
            cost: 3500
        }
    },
    suspension: {
        springs: {
            name: "Race Springs",
            handling: 10,
            cost: 600
        },
        cartridge: {
            name: "Cartridge Kit",
            handling: 25,
            cost: 2200
        },
        ohlins: {
            name: "Öhlins Package",
            handling: 40,
            cost: 4500
        }
    }
}

export { BikeData, UpgradeData }
