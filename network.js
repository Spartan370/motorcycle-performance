class MotorcycleNetwork {
    constructor() {
        this.container = document.getElementById('mynetwork');
        this.nodes = new vis.DataSet();
        this.edges = new vis.DataSet();
        this.selectedUpgrades = new Set();
        this.totalCost = 0;
        this.totalHPGain = 0;
        
        this.initializeNetwork();
        this.bindEvents();
    }

    initializeNetwork() {
        this.createNodes();
        this.createEdges();
        
        const data = {
            nodes: this.nodes,
            edges: this.edges
        };
        
        this.network = new vis.Network(this.container, data, networkConfig);
    }

    createNodes() {
        Object.values(motorcycleData.bikes).forEach((bike, index) => {
            this.nodes.add({
                id: bike.name,
                label: bike.name,
                level: 0,
                color: '#800000',
                font: { size: 25 }
            });

            Object.values(bike.categories).forEach(category => {
                const categoryId = `${bike.name}_${category.name}`;
                this.nodes.add({
                    id: categoryId,
                    label: category.name,
                    level: 1,
                    color: '#000080'
                });

                category.upgrades.forEach(upgrade => {
                    this.nodes.add({
                        id: upgrade.id,
                        label: `${upgrade.name}\n$${upgrade.cost}`,
                        level: 2,
                        color: this.getStageColor(upgrade.stage),
                        upgrade: upgrade
                    });
                });
            });
        });
    }

    createEdges() {
        Object.values(motorcycleData.bikes).forEach(bike => {
            Object.values(bike.categories).forEach(category => {
                const categoryId = `${bike.name}_${category.name}`;
                this.edges.add({
                    from: bike.name,
                    to: categoryId
                });

                category.upgrades.forEach(upgrade => {
                    this.edges.add({
                        from: categoryId,
                        to: upgrade.id
                    });
                });
            });
        });
    }

    getStageColor(stage) {
        const colors = {
            1: '#000080',
            2: '#800000',
            3: '#4A0404'
        };
        return colors[stage] || '#808080';
    }

    bindEvents() {
        this.network.on("click", params => {
            if (params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                const node = this.nodes.get(nodeId);
                
                if (node.upgrade) {
                    this.handleUpgradeSelection(node);
                }
            }
        });

        this.network.on("hoverNode", params => {
            const node = this.nodes.get(params.node);
            if (node.upgrade) {
                this.showUpgradeDetails(
