// create a graph class with a constructor and weight
class Graph {
    constructor() {
        this.nodes = [];
        this.adjacencyList = {};
    }
    addVertex(node) {
        this.adjacencyList[node] = [];
        this.nodes.push(node);
    }
    addEdge(node1, node2, weight) {
        this.adjacencyList[node1].push({ node: node2, weight });
        this.adjacencyList[node2].push({ node: node1, weight });
    }
    // DFS method with start and end node
    DFS(start, end) {
        const visited = new Set();
        const stack = [start];
        while (stack.length > 0) {
            const node = stack.pop();
            if (node === end) {
                return true;
            }
            if (!visited.has(node)) {
                visited.add(node);
                stack.push(...this.adjacencyList[node].map(n => n.node));
            }
        }
        return false;
    }
}
// export the graph class
export default Graph;
