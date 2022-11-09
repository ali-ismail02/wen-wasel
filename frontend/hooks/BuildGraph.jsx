import Graph from "../classes/Graph";
import Get from "./Get";
import calculateDistance from "./HelperFunctions";
import getDirections from "./GetGoogleDirections";

const buildGraph = async (start_location, end_location, trip_type) => {
    // get the routes from the backend
    const jwt = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE2Njc2NjUyMTIsImV4cCI6MTY2ODI3MDAxMiwibmJmIjoxNjY3NjY1MjEyLCJqdGkiOiJXOXFnNmRSajJoZFBLd0xtIiwic3ViIjoiMTUiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.i0O4BNcw8weGbhw81RDanJcpvXsde1xa1A2_uSsLtX8"
    const response = await Get("user/get-possible-routes/" + start_location + "/" + end_location, jwt);
    let graph = new Graph();
    if (trip_type == 1) {
        // add start location to graph as a node
        const start = {
            name: "start_location",
            location: start_location,
        }
        graph.addVertex(start);
        // add end location to graph as a node
        const end = {
            name: "end_location",
            location: end_location,
        }
        graph.addVertex(end);
        const directions = await getDirections(start_location, end_location, "walking");
        const time = directions.data.routes[0].legs[0].duration.value;

        // add edge between start and end
        graph.addEdge(start, end, time);
        // add all the possible routes to the graph
        let service = response.data.trips.service
        for (let i = 0; i < service.length; i++) {
            const obj_start = {
                name: service[i].id + "_start",
                element: service[i],
                location: start_location,
                type: "service",
            }
            const obj_end = {
                name: service[i].id + "_end",
                element: service[i],
                location: end_location,
                type: "service",
            }
            graph.addVertex(obj_start);
            graph.addVertex(obj_end);
            let direction = await getDirections(service[i].start_location, service[i].end_location, "driving");
            let time = direction.data.routes[0].legs[0].duration.value;
            // add edge to graph with weight of time
            graph.addEdge(obj_start, obj_end, time);
            // add walking edge to graph from start to start of service
            direction = await getDirections(start_location, service[i].start_location, "walking");
            time = direction.data.routes[0].legs[0].duration.value;
            graph.addEdge(start, obj_start, time);
            // add walking edge to graph from end of service to end
            direction = await getDirections(service[i].end_location, end_location, "walking");
            time = direction.data.routes[0].legs[0].duration.value;
            graph.addEdge(obj_end, end, time);
        };
        // add edge from end of service to end of other service if the first end is before the second end
        for (let i = 0; i < service.length; i++) {
            for (let j = 0; j < service.length; j++) {
                if (Math.abs(calculateDistance(service[j].end_location, end_location)) < Math.abs(calculateDistance(service[i].end_location, end_location))) {
                    // find the nodes
                    let node1 = null;
                    let node2 = null;
                    graph.nodes.forEach((node) => {
                        if (node.name == service[i].id + "_end") {
                            node1 = node;
                        }
                        if (node.name == service[j].id + "_start") {
                            node2 = node;
                        }
                    });
                    const direction = await getDirections(service[i].end_location, service[j].end_location, "walking");
                    const time = direction.data.routes[0].legs[0].duration.value;
                    graph.addEdge(node1, node2, time);
                }
            }
        }
        return graph;
    }
    if (trip_type == 2) {
    }
    if (trip_type == 3) {
    }
    return null;
}

export default buildGraph;