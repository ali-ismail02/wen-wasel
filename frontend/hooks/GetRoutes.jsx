import buildGraph from "./BuildGraph";

const getRoutes = async (start_location, end_location, trip_type) => { 
  const graph = await buildGraph(start_location, end_location, trip_type)
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
    let paths = await graph.DFS(start, end);
    // sort paths by total time
    paths.forEach((path) => {
      let time = 0;
      for(let i = 0; i < path.length; i++) {
        if(i != path.length - 1) {
          path[i].cost = parseInt(path[i+1].cost/60);
        }else {
          path[i].cost = 0;
        }
        time += path[i].cost;
      }
      path.time = time
    })
    paths.sort((a, b) => {
      return a.time - b.time;
    })
    return paths;
}

export default getRoutes;