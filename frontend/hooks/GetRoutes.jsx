import buildGraph from "./BuildGraph";

const getRoutes = async (start_location, end_location, trip_type) => {
  new Promise((resolve, reject) => {
    resolve(buildGraph(start_location, end_location, trip_type));
  }).then((graph) => {
    let start= null;
    let end = null;
    graph.nodes.forEach((node) => {
      if (node.name == "start_location") {
        start = node;
      }
      if (node.name == "end_location") {
        end = node;
      }
    })
    console.log(graph);
    // set 1 second delay 
    debugger;
    console.log(end)
    const paths = graph.DFS(start, end);
    return paths;
  })
}


export default getRoutes;