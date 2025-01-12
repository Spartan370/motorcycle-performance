const BikeData = {
    r1: {
        name: "Yamaha R1M 2024",
        modelPath: "assets/models/r1m.glb",
        stats: {
            power: 200,
            torque: 113.3,
            weight: 201,
            handling: 95
        },
        performance: {
            powerCurve: [
                { rpm: 4000, value: 60 },
                { rpm: 6000, value: 100 },
                { rpm: 8000, value: 140 },
                { rpm: 10000, value: 180 },
                { rpm: 12000, value: 200 },
                { rpm: 14000, value: 190 }
            ],
            torqueCurve: [
                { rpm: 4000, value: 80 },
                { rpm: 6000, value: 95 },
                { rpm: 8000, value: 105 },
                { rpm: 10000, value: 113 },
                { rpm: 12000, value: 108 },
                { rpm: 14000, value: 95 }
            ]
        },
        physics: {
            mass: 201,
            dimensions: {
                length: 2.055,
                width: 0.690,
                height: 1.165,
                wheelbase: 1.405
            },
            suspension: {
                frontTravel: 0.120,
                rearTravel: 0.120,
                frontSpringRate: 10000,
                rearSpringRate: 12000
            },
            aerodynamics: {
                dragCoefficient: 0.48,
                frontalArea: 0.85
            }
        },
        upgrades: {
            engine: [
                {
                    id: "stage1",
                    name: "Stage 1 ECU Flash",
                    price: 800,
                    gains: {
                        power: 10,
                        torque: 5
                    }
                },
                {
                    id: "stage2",
                    name: "Stage 2 Performance Kit",
                    price: 2500,
                    gains: {
                        power: 15,
                        torque: 8
                    }
                },
                {
                    id: "stage3",
                    name: "Stage 3 Race Package",
                    price: 5000,
                    gains: {
                        power: 25,
                        torque: 12
                    }
                }
            ],
            suspension: [
                {
                    id: "springs",
                    name: "Race Springs",
                    price: 600,
                    gains: {
                        handling: 10
                    }
                },
                {
                    id: "cartridge",
                    name: "Cartridge Kit",
                    price: 2200,
                    gains: {
                        handling: 25
                    }
                },
                {
                    id: "ohlins",
                    name: "Öhlins Package",
                    price: 4500,
                    gains: {
                        handling: 40
                    }
                }
            ]
        }
    },
    v4: {
        name: "Ducati V4R 2024",
        modelPath: "assets/models/v4r.glb",
        stats: {
            power: 218,
            torque: 111.3,
            weight: 193,
            handling: 98
        },
        performance: {
            powerCurve: [
                { rpm: 4000, value: 70 },
                { rpm: 6000, value: 120 },
                { rpm: 8000, value: 160 },
                { rpm: 10000, value: 190 },
                { rpm: 12000, value: 218 },
                { rpm: 14000, value: 210 }
            ],
            torqueCurve: [
                { rpm: 4000, value: 85 },
                { rpm: 6000, value: 98 },
                { rpm: 8000, value: 108 },
                { rpm: 10000, value: 111 },
                { rpm: 12000, value: 106 },
                { rpm: 14000, value: 98 }
            ]
        },
        physics: {
            mass: 193,
            dimensions: {
                length: 2.080,
                width: 0.705,
                height: 1.155,
                wheelbase: 1.420
            },
            suspension: {
                frontTravel: 0.125,
                rearTravel: 0.130,
                frontSpringRate: 10500,
                rearSpringRate: 12500
            },
            aerodynamics: {
                dragCoefficient: 0.45,
                frontalArea: 0.82
            }
        },
        upgrades: {
            engine: [
                {
                    id: "stage1",
                    name: "Stage 1 ECU Flash",
                    price: 900,
                    gains: {
                        power: 12,
                        torque: 6
                    }
                },
                {
                    id: "stage2",
                    name: "Stage 2 Performance Kit",
                    price: 3000,
                    gains: {
                        power: 18,
                        torque: 9
                    }
                },
                {
                    id: "stage3",
                    name: "Stage 3 Race Package",
                    price: 6000,
                    gains: {
                        power: 28,
                        torque: 14
                    }
                }
            ],
            suspension: [
                {
                    id: "springs",
                    name: "Race Springs",
                    price: 700,
                    gains: {
                        handling: 12
                    }
                },
                {
                    id: "cartridge",
                    name: "Cartridge Kit",
                    price: 2500,
                    gains: {
                        handling: 28
                    }
                },
                {
                    id: "ohlins",
                    name: "Öhlins Package",
                    price: 5000,
                    gains: {
                        handling: 45
                    }
                }
            ]
        }
    },
    zx10r: {
        name: "Kawasaki ZX-10RR 2024",
        modelPath: "assets/models/zx10r.glb",
        stats: {
            power: 203,
            torque: 114.9,
            weight: 207,
            handling: 93
        },
        performance: {
            powerCurve: [
                { rpm: 4000, value: 65 },
                { rpm: 6000, value: 110 },
                { rpm: 8000, value: 150 },
                { rpm: 10000, value: 185 },
                { rpm: 12000, value: 203 },
                { rpm: 14000, value: 195 }
            ],
            torqueCurve: [
                { rpm: 4000, value: 82 },
                { rpm: 6000, value: 96 },
                { rpm: 8000, value: 107 },
                { rpm: 10000, value: 114 },
                { rpm: 12000, value: 110 },
                { rpm: 14000, value: 96 }
            ]
        },
        physics: {
            mass: 207,
            dimensions: {
                length: 2.085,
                width: 0.750,
                height: 1.185,
                wheelbase: 1.450
            },
            suspension: {
                frontTravel: 0.120,
                rearTravel: 0.114,
                frontSpringRate: 9800,
                rearSpringRate: 11800
            },
            aerodynamics: {
                dragCoefficient: 0.49,
                frontalArea: 0.87
            }
        },
        upgrades: {
            engine: [
                {
                    id: "stage1",
                    name: "Stage 1 ECU Flash",
                    price: 750,
                    gains: {
                        power: 9,
                        torque: 4
                    }
                },
                {
                    id: "stage2",
                    name: "Stage 2 Performance Kit",
                    price: 2800,
                    gains: {
                        power: 14,
                        torque: 7
                    }
                },
                {
                    id: "stage3",
                    name: "Stage 3 Race Package",
                    price: 5500,
                    gains: {
                        power: 24,
                        torque: 11
                    }
                }
            ],
            suspension: [
                {
                    id: "springs",
                    name: "Race Springs",
                    price: 550,
                    gains: {
                        handling: 8
                    }
                },
                {
                    id: "cartridge",
                    name: "Cartridge Kit",
                    price: 2000,
                    gains: {
                        handling: 22
                    }
                },
                {
                    id: "ohlins",
                    name: "Öhlins Package",
                    price: 4200,
                    gains: {
                        handling: 38
                    }
                }
            ]
        }
    }
}

export default BikeData
