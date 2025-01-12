const motorcycleData = {
    bikes: {
        yamahaR1: {
            name: "YAMAHA R1",
            baseHP: 200,
            categories: {
                engine: {
                    name: "ENGINE",
                    upgrades: [
                        {
                            id: "exhaust_r1",
                            name: "Titanium Full System",
                            cost: 3800,
                            stage: 3,
                            hpGain: 12,
                            installTime: "4-6 hours",
                            compatibility: ["2015+", "Race Only"],
                            details: "Full titanium construction, weight reduction: -4kg"
                        },
                        {
                            id: "ecu_r1",
                            name: "Race ECU",
                            cost: 2200,
                            stage: 2,
                            hpGain: 8,
                            installTime: "2-3 hours",
                            compatibility: ["All Years"],
                            details: "Fully programmable, includes race maps"
                        }
                    ]
                },
                suspension: {
                    name: "SUSPENSION",
                    upgrades: [
                        {
                            id: "forks_r1",
                            name: "Öhlins FGR300",
                            cost: 4200,
                            stage: 3,
                            handling: 10,
                            installTime: "3-4 hours",
                            compatibility: ["2020+"],
                            details: "World Superbike spec front forks"
                        }
                    ]
                }
            }
        },
        ducatiV4: {
            name: "DUCATI V4",
            baseHP: 214,
            categories: {
                engine: {
                    name: "ENGINE",
                    upgrades: [
                        {
                            id: "exhaust_v4",
                            name: "Akrapovič Evolution",
                            cost: 4500,
                            stage: 3,
                            hpGain: 14,
                            installTime: "4-5 hours",
                            compatibility: ["All V4 Models"],
                            details: "Titanium construction, includes X-pipe"
                        }
                    ]
                }
            }
        }
    }
};

const networkConfig = {
    nodes: {
        shape: 'dot',
        size: 30,
        font: {
            face: 'Rajdhani',
            color: 'white',
            size: 18
        },
        borderWidth: 2,
        borderWidthSelected: 4,
        shadow: {
            enabled: true,
            color: '#800000',
            size: 10
        }
    },
    edges: {
        width: 2,
        color: {
            color: '#800000',
            highlight: '#000080',
            hover: '#800000',
            opacity: 0.8
        },
        smooth: {
            type: 'continuous'
        }
    },
    physics: {
        barnesHut: {
            gravitationalConstant: -80000,
            springLength: 250,
            springConstant: 0.04,
            damping: 0.09
        }
    },
    interaction: {
        hover: true,
        tooltipDelay: 200,
        zoomView: true,
        dragView: true
    }
};
