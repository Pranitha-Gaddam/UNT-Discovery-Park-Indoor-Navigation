
function dijkstra(graph, start, end) {
    console.log("start: ", start);
    console.log("end: ", end);
    let distances = {}, previous = {}, unvisited = new Set();
    for (let node in graph) {
        distances[node] = node === start ? 0 : Infinity;
        unvisited.add(node);
        //farthestNode[node] = node;
    }


    while (unvisited.size) {
        let closestNode = null;
        for (let node of unvisited) {
            if (!closestNode || distances[node] < distances[closestNode]) {
                closestNode = node;
            }
        }

        if (distances[closestNode] === Infinity) break;
        if (closestNode === end) break;

        for (let neighbor in graph[closestNode]) {
            let newDistance = distances[closestNode] + graph[closestNode][neighbor];
            if (newDistance < distances[neighbor]) {
                distances[neighbor] = newDistance;
                previous[neighbor] = closestNode;
                //farthestNode[neighbor] = farthestNode[closestNode];
            }
        }
        unvisited.delete(closestNode);
    }

    let path = [], node = end;
    while (node) {
        path.push(node);
        node = previous[node];
    }
    path.reverse();


    return { shortestPath: path, totalCost: distances[end] };
}

// const result = dijkstra(paths, '1', '3');
// console.log(result.shortestPath);
// console.log(result.totalCost);

