import geojson from "./network.js";
import nearestPointOnLine from '@turf/nearest-point-on-line';
import { lineString, point, distance} from "@turf/turf";


// const startRoom = [ -97.15388509288465, 33.25476053520956 ]; // Example point coordinates
// const endRoom = [ -97.15353978483283, 33.254924324421239 ];
export function startRoute(startRoom, endRoom) {
var source = projectPoint(startRoom);
var destination = projectPoint(endRoom);


// The `nearestPoint` variable now contains the nearest point on the MultiLineString to the given point
console.log("source point: ",source.point);
console.log("destination point: ", destination.point);



// const r1 = new mapboxgl.Marker()
// .setLngLat(startRoom)
// .addTo(map);
console.log("checkpoint 1");
// Sample point

// Initialize variables to store the closest line and its projection point
function projectPoint(pointToCheck) {
    let closestLine = null;
    let closestProjection = null;
    let minDistance = Infinity;
    // Loop through each feature in your GeoJSON data
    geojson.features.forEach(feature => {
        // Check if the feature represents a LineString
        if (feature.geometry.type === 'LineString') {
            // Convert GeoJSON LineString to Turf LineString
            const turfLine = lineString(feature.geometry.coordinates);
            // Find the nearest projection of the sample point on the line
            const nearestPoint = nearestPointOnLine(turfLine, pointToCheck);
            // Calculate the distance between the original point and the projection point
            const dis = nearestPoint.properties.dist;
            // Update closestLine and closestProjection if this line's projection is closer
            if (dis < minDistance) {
                minDistance = dis;
                closestLine = turfLine;
                closestProjection = nearestPoint;
            }
        }
    });
    return {point: closestProjection, line: closestLine};
}

function findRoute(source, destination) {
    
    var bestPathCost = Infinity;
    var bestPath = [];

    for (var i=0; i<2; i++){
        for (var j=0; j<2; j++) {
            var result = dijkstra(paths, String(findNodeByCoordinate(source.line.geometry.coordinates[i])), String(findNodeByCoordinate(destination.line.geometry.coordinates[j])));
            //console.log("cost is: ", result.totalCost);
            if (result.totalCost < bestPathCost) {
                bestPathCost = result.totalCost;
                bestPath = result.shortestPath;
            }
        }
    }
    console.log("final path is: ", bestPath);
    return bestPath;
}




// Output the closest projection point
// console.log('Closest projection point:', closestProjection);
//console.log('Destination line: ', destination.line);

// const startMarker = new mapboxgl.Marker()
// .setLngLat(source.point.geometry.coordinates)
// .addTo(map);

// const endMarker = new mapboxgl.Marker()
// .setLngLat(destination.point.geometry.coordinates)
// .addTo(map);

function addPathsLayer(point1, point2) {
    map.addLayer({
        "id": String(point1)+String(point2),
        "type": "line",
        "source": {
            "type": "geojson",
            "data": {
                "type": "Feature", // GeoJSON feature type
                "geometry": {
                    "type": "LineString",
                    "coordinates": [point1, point2]
                }
            }
        },
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": "#0066ff", // Adjust color as needed
            "line-width": 8 // Adjust width as needed
        }
    });
    console.log('Paths layer added to the map.');
}

// Function to handle paths layer loading
function handlePathsLayer(point1, point2) {
    //console.log("p1: ", point1);
    //console.log("p2: ", point2);
    if (map.loaded()) {
        // Map has finished loading, add paths layer
        addPathsLayer(point1, point2);
    } else {
        // Map is still loading, wait for load event
        map.on('load', () => {
            // Map has finished loading, add paths layer
            addPathsLayer(point1, point2);
        });
    }
    addPathsLayer(point1, point2);
}


function drawRoute(path) {
    //int startNode = 1;
    var firstLoop = 1;
    var firstBearing = 1;
    var bearing1, bearing2;
    
    for (var i=0; i<path.length; i++) {
        //console.log("i is: ", i);
        if (firstLoop == 1) {
            var point1 = source.point.geometry.coordinates;
            var point2 = NodeToCoordinates[(parseInt(path[i]-1))];
            handlePathsLayer(point1, point2);
            bearing1 = calculateBearing(point1, point2);
            point1 = NodeToCoordinates[(parseInt(path[i]-1))];
            point2 = NodeToCoordinates[(parseInt(path[i+1]-1))];
            bearing2 = calculateBearing(point1,point2);
            firstLoop = 0;
            i--;
        }
        else if (i == (path.length-1)) {
            var point1 = NodeToCoordinates[(parseInt(path[i])-1)];
            var point2 = destination.point.geometry.coordinates;
            bearing1 = bearing2;
            bearing2= calculateBearing(point1, point2);
            handlePathsLayer((point1), point2);
        }
        else {
            var point1 = NodeToCoordinates[(parseInt(path[i]-1))];
            var point2 = NodeToCoordinates[(parseInt(path[i+1]-1))];
            handlePathsLayer(point1, point2);
            bearing1 = bearing2;
            bearing2 = calculateBearing(point1, point2);
        }
        //console.log("Bearing 1: ", bearing1);
        //console.log("Bearing 2: ", bearing2);
        var angle = bearing1-bearing2;
        console.log("Angle: ", angle);
        determineTurnType(angle);
    }
}
var finalPath = findRoute(source, destination);
drawRoute(finalPath);
}