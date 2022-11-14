import Graph from "../classes/Graph";
import { jwt } from "../constants/JWT";
import Get from "./Get";
import getDirections from "./GetGoogleDirections";
import isLess from "./IsLess";

const buildServiceGraph = async (service, start_location, end_location, start, end, graph) => {
    for (let i = 0; i < service.length; i++) {
        const obj_start = {
            name: "service_" + service[i].id + "_start",
            element: { trip: service[i] },
            location: service[i].start_location,
        }
        const obj_end = {
            name: "service_" + service[i].id + "_end",
            element: { trip: service[i] },
            location: service[i].end_location,
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
            if (isLess(service[j].end_location, service[i].end_location, end_location)) {
                // find the nodes
                let node1 = null;
                let node2 = null;
                graph.nodes.forEach((node) => {
                    if (node.name == "service_" + service[i].id + "_end") {
                        node1 = node;
                    }
                    if (node.name == "service_" + service[j].id + "_start") {
                        node2 = node;
                    }
                });
                const direction = await getDirections(service[i].end_location, service[j].start_location, "walking");
                const time = direction.data.routes[0].legs[0].duration.value;
                graph.addEdge(node1, node2, time);
            }
        }
    }
}

const buildVanGraph = async (van, start_location, end_location, start, end, graph) => {
    for (let i = 0; i < van.length; i++) {
        const obj_start = {
            name: "van_" + van[i][0].id + "_start",
            element: { trip: van[i][0], driver: van[i][2] },
            location: van[i][0].location,
        }
        const obj_end = {
            name: "van_" + van[i][1].id + "_end",
            element: { trip: van[i][1], driver: van[i][2] },
            location: van[i][1].location,
        }
        graph.addVertex(obj_start);
        graph.addVertex(obj_end);
        // subtract van[i][1].arrival_time - van[i][0].departure_time (strings) and convert to timestamp
        let time = new Date(van[i][1].arrival_time) - new Date(van[i][0].arrival_time);
        time = time / 1000;
        // add edge to graph with weight of time
        graph.addEdge(obj_start, obj_end, time);
        // add walking edge to graph from start to start of service
        let direction = await getDirections(start_location, van[i][0].location, "walking");
        time = direction.data.routes[0].legs[0].duration.value;
        graph.addEdge(start, obj_start, time);
        // add walking edge to graph from end of service to end
        direction = await getDirections(van[i][1].location, end_location, "walking");
        time = direction.data.routes[0].legs[0].duration.value;
        graph.addEdge(obj_end, end, time);
    };
    // add edge from end of service to end of other service if the first end is before the second end
    for (let i = 0; i < van.length; i++) {
        for (let j = 0; j < van.length; j++) {
            if (i == j) continue;

            if (isLess(van[j][1].location, van[i][1].location, end_location)) {
                // find the nodes
                let node1 = null;
                let node2 = null;
                graph.nodes.forEach((node) => {
                    if (node.name == "van_" + van[j][1].id + "_end") {
                        node1 = node;
                    }
                    if (node.name == "van_" + van[i][0].id + "_start") {
                        node2 = node;
                    }
                });
                const direction = await getDirections(van[i][1].location, van[j][0].location, "walking");
                const time = direction.data.routes[0].legs[0].duration.value;
                graph.addEdge(node1, node2, time);
            }
        }
    }
}

const buildVanAndServiceGraph = async (service, van, start_location, end_location, start, end, graph) => {
    await buildServiceGraph(service, start_location, end_location, start, end, graph);
    await buildVanGraph(van, start_location, end_location, start, end, graph);
    for (let i = 0; i < service.length; i++) {
        for (let j = 0; j < van.length; j++) {
            if (isLess(van[j][1].location, service[i].end_location, end_location)) {
                // find the nodes
                let node1 = null;
                let node2 = null;
                graph.nodes.forEach((node) => {
                    if (node.name == "service_" + service[i].id + "_end") {
                        node1 = node;
                    }
                    if (node.name == "van_" + van[j][0].id + "_start") {
                        node2 = node;
                    }
                });
                const direction = await getDirections(service[i].end_location, van[j][0].location, "walking");
                const time = direction.data.routes[0].legs[0].duration.value;
                graph.addEdge(node1, node2, time);
            }
            if (isLess(service[i].end_location, van[j][1].location, end_location)) {
                // find the nodes
                let node1 = null;
                let node2 = null;
                graph.nodes.forEach((node) => {
                    if (node.name == "van_" + van[j][1].id + "_end") {
                        node1 = node;
                    }
                    if (node.name == "service_" + service[i].id + "_start") {
                        node2 = node;
                    }
                });
                const direction = await getDirections(van[j][1].location, service[i].start_location, "walking");
                const time = direction.data.routes[0].legs[0].duration.value;
                graph.addEdge(node1, node2, time);
            }
        }
    }
}

const buildGraph = async (start_location, end_location, trip_type) => {
    console.log(trip_type)
    // get the routes from the backend

    const response = await Get("user/get-possible-routes/" + start_location + "/" + end_location, jwt);
    let graph = new Graph();
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
    if (trip_type == 1) {
        // add all the possible routes to the graph
        let service = response.data.trips.service
        await buildServiceGraph(service, start_location, end_location, start, end, graph);
        return graph;
    }
    if (trip_type == 2) {
        let van = response.data.trips.van
        await buildVanGraph(van, start_location, end_location, start, end, graph);
        return graph;
    }
    if (trip_type == 3) {
        let service = response.data.trips.service
        let van = response.data.trips.van
        await buildVanAndServiceGraph(service, van, start_location, end_location, start, end, graph);
        return graph;
    }
    return null;
}

export default buildGraph;