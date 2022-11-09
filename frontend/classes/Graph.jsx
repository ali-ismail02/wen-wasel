// create a graph class with a constructor and weight
class Graph {
    constructor() {
        this.nodes = [];
        this.adjacencyList = {};
        this.log = "";
    }
     addVertex(node) {
        this.adjacencyList[node.name] = [];
        this.nodes.push(node);
    }
     addEdge(node1, node2, weight) {
        this.adjacencyList[node1.name].push({ node: node2, weight });
        this.log += "Added edge ";
    }
    // DFS method with start and end node returns paths
    async DFS(start, end) {
        this.log += "Ran DFS ";
        let paths = [];
        let currentPath = [];
        const _traverse = (node, cost) => {
            if (!node) {
                return null;
            }
    
            if (node.hasOwnProperty("element")) {
                // check if node.name contains "end"
                if (node.name.includes("end")) {
                    currentPath.push({name: node.name, location: node.element.end_location, cost, type: node.type});
                }
                else {
                    currentPath.push({name: node.name, location: node.element.start_location, cost, type: node.type});
                }
            }else 
            {
                currentPath.push({name: node.name, location: node.location, cost, type: node.type});
            }
            if (node.name === end.name) {
                paths.push(currentPath.slice());
            }
            else {
                for(let i = 0; i < this.adjacencyList[node.name].length; i++) {
                    _traverse(this.adjacencyList[node.name][i].node, this.adjacencyList[node.name][i].weight);
                }
            }
            currentPath.pop();
        };
        _traverse(start, 0);
        return paths;
    }
}
// export the graph class
export default Graph;
