import geojson from "./network.js"
import nearestPointOnLine from '@turf/nearest-point-on-line';
import { lineString, point, distance} from "@turf/turf";

function startRoute(startRoom) {
//startRoom = [ -97.153695026143666, 33.254925293849006 ]; // Example point coordinates
//const startRoom = getStartRoom()
const endRoom = [ -97.153919413926175, 33.254797303550035 ];

var source = projectPoint(startRoom);
var destination = projectPoint(endRoom);


// The `nearestPoint` variable now contains the nearest point on the MultiLineString to the given point
console.log("source point: ",source.point);
console.log("destination point: ", destination.point);



const r1 = new mapboxgl.Marker()
.setLngLat(startRoom)
.addTo(map);

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
}



// Output the closest projection point
// console.log('Closest projection point:', closestProjection);
//console.log('Destination line: ', destination.line);

const startMarker = new mapboxgl.Marker()
.setLngLat(source.point.geometry.coordinates)
.addTo(map);

const endMarker = new mapboxgl.Marker()
.setLngLat(destination.point.geometry.coordinates)
.addTo(map);

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
}


function drawRoute(path) {
    //int startNode = 1;
    var firstLoop = 1;
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
console.log(startRoom);
//}
// var finalPath = findRoute(source, destination);
// drawRoute(finalPath);

// --------------------------------------------------
//import distance from "@turf/distance";
//var p1 = point([ -97.153596300418698, 33.255006102057202 ]);
//var p2 = point([ -97.153746869897418, 33.254798260752224 ]);
// var d78 = distance([ -97.153596300418698, 33.255006102057202 ], [ -97.153746869897418, 33.254798260752224 ], {units: 'miles'});
// console.log(d78);
// var d89 = distance([ -97.153746869897418, 33.254798260752224 ], [ -97.153836777354201, 33.254843605587141 ], {units: 'miles'});
// console.log(d89);
// var d9_10 = distance([ -97.153836777354201, 33.254843605587141 ], [ -97.153898436487168, 33.254759404405561 ], {units: 'miles'});
// console.log(d9_10);
// var d10_11 = distance([ -97.153898436487168, 33.254759404405561 ], [ -97.153920607540069, 33.254728906339793 ], {units: 'miles'});
// console.log(d10_11);
// var d11_12 = distance([ -97.153898436487168, 33.254759404405561 ], [ -97.153791695900466, 33.254704376872986 ], {units: 'miles'});
// console.log(d11_12);
// var d8_13 = distance([ -97.153746869897418, 33.254798260752224 ], [ -97.153730085935948, 33.254789848437815 ], {units: 'miles'});
// console.log(d8_13);
// var d12_13 = distance([ -97.153791695900466, 33.254704376872986 ], [ -97.153730085935948, 33.254789848437815 ], {units: "miles"});
// console.log(d12_13);