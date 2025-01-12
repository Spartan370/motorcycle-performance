class MotorcycleNetwork {
    constructor() {
        this.container = document.getElementById('mynetwork');
        this.network = new vis.Network(this.container, graphData, networkOptions);
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.network.on("click", (params) => this.handleNodeClick(params));
        this.network.on("hoverNode", (params) => this.handleNodeHover(params));
    }

    handleNodeClick(params) {
        if (params.nodes.length > 0) {
            const nodeId = params.nodes[0];
            const node = graphData.nodes.find(n => n.id === nodeId);
            this.updateNodeInfo(node);
        }
    }

    handleNodeHover(params) {
        const nodeId = params.node;
        const node = graphData.nodes.find(n => n.id === nodeId);
        this.container.style.cursor = node.level === 2 ? 'pointer' : 'default';
    }

    updateNodeInfo(node) {
        const nodeInfo = document.getElementById('nodeInfo');
        const nodeName = document.getElementById('nodeName');
        const nodeDetails = document.getElementById('nodeDetails');
        const performanceBar = document.getElementById('performanceBar');

        if (node.level === 2) {
            const performance = Math.floor(Math.random() * 15) + 5;
            nodeName.textContent = node.label.split('\n')[0];
            nodeDetails.textContent = `Stage ${Math.floor(Math.random() * 3) + 1} Upgrade
                                     Installation Time: ${Math.floor(Math.random() * 5) + 1} hours
                                     Performance Gain: +${performance}%`;
            performanceBar.style.width = `${performance * 3}px`;
            nodeInfo.style.display = 'block';
        }
    }
}

const motorcycleNetwork = new MotorcycleNetwork();
