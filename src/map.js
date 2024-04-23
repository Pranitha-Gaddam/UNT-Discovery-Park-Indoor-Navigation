import { startRoute } from "./routing.js";

mapboxgl.accessToken = 'pk.eyJ1Ijoia2ltdm8yMTExIiwiYSI6ImNsdGcwYmhoajB2czcyanA3YWlpZGh6dHQifQ.Niu8tgHPbGDSq09zYRBAFg';
let startRoom = {coordinates: undefined, floor: undefined};
let endRoom = {coordinates: undefined, floor: undefined};
console.log("start: ", startRoom);
console.log("end: ", endRoom);
    window.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11', // Example style, replace with your own
        center: [-97.153715, 33.254811], // Example center coordinates
        zoom: 19.7 // Example zoom level
    });

    map.on('style.load', function() {
        const indoorEqual = new IndoorEqual(map, { apiKey: 'iek_WQaPa637GiMUujPIMZtRAm1FbHsX' });
        indoorEqual.loadSprite('./node_modules/mapbox-gl-indoorequal/sprite/indoorequal');
        
        // Function to handle changing the level based on the selected option
        function changeLevel() {
            // Get the selected value from the floor selector
            const selectedLevel = document.getElementById('floorSelector').value;

            // Call a function to change the level based on the selected option
            indoorEqual.setLevel(selectedLevel);
        }

        
        map.addControl(indoorEqual);
        
        // Add zoom and rotation controls to the map.
        const nav = new mapboxgl.NavigationControl({
            visualizePitch: true
        });
        map.addControl(nav, 'top-right');
        
        // Add geolocate control to the map.
        // map.addControl(
        //     new mapboxgl.GeolocateControl({
        //         positionOptions: {
        //             enableHighAccuracy: true
        //         },
        //         // When active the map will receive updates to the device's location as it changes.
        //         trackUserLocation: true,
        //         // Draw an arrow next to the location dot to indicate which direction the device is heading.
        //         showUserHeading: true
        //     }),
        //     'bottom-left'
        // ); 
        
        
        // Add event listener for 'result' event outside of geolocate function
        
        // Fetch the data.json file
        fetch('data/data.geojson')
            .then(response => response.json()) // Parse the JSON data
            .then(data => {
                // Use the data as needed
                console.log(data); // Logging the fetched data
                // Pass the fetched data to the forwardGeocoder function
                initializeMap(data);
            })
            .catch(error => console.error('Error fetching data:', error));

        function initializeMap(data) {
            // Your forwardGeocoder function using the fetched data
            function forwardGeocoder(query) {
                const matchingFeatures = [];
                navigator.geolocation.getCurrentPosition(function(position) {
                    const currentLocation = {
                        place_name: 'Use Current Location',
                        center: [position.coords.longitude, position.coords.latitude],
                        place_type: ['current_location']
                    };
                    matchingFeatures.push(currentLocation);
                    console.log("Current Location:", currentLocation.center);
                }, function(error) {
                    console.error("Error getting current location:", error);
                });
                for (const feature of data.features) {
                    // Handle queries with different capitalization
                    // than the source data by calling toLowerCase().
                    if (feature.id.toLowerCase().includes(query.toLowerCase())) {
                        // Add a room emoji as a prefix for custom
                    if (feature.id === 'restroom' || feature.id === 'stair' || feature.id === 'elevator') {
                        let name = feature.id;
                        if (feature.properties.type !== null) {
                            name += `: ${feature.properties.type}`;
                        }
                        feature['place_name'] = name;
                    } else {
                        feature['place_name'] = `🏠 Room ${feature.id}`;
                    }
                    feature['center'] = feature.geometry.coordinates;
                    feature['place_type'] = ['room'];


                        matchingFeatures.push(feature);
                        

                        // Check if the room is on floor 2 and switch the level accordingly
                        if (feature.properties.level === 2) {
                            indoorEqual.setLevel('2');
                        } else if (feature.properties.level === 1) {
                            indoorEqual.setLevel('1');
                        }
                    
                    }
                }
                return matchingFeatures;
            }

            
            // Add the control to the map.
            const geocoder = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                localGeocoder: forwardGeocoder,
                zoom: 25,
                placeholder: 'Search for rooms',
                mapboxgl: mapboxgl,
            });

            const geocoder1 = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                localGeocoder: forwardGeocoder,
                mapboxgl: mapboxgl,
                placeholder: 'Starting Point',
                zoom: 20,  
                container: 'geocoder1-container'             
            });

            const geocoder2 = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl,
                placeholder: 'Destination',
                localGeocoder: forwardGeocoder,  
                localGeocoderOnly: true,
                        
            });
                        
    
            // Add the geocoder to your existing searchbar form
            document.getElementById('searchbar').appendChild(geocoder.onAdd(map));
            document.getElementById('start').appendChild(geocoder1.onAdd(map));
            document.getElementById('end').appendChild(geocoder2.onAdd(map));

            geocoder1.on('result', function (e) {
                startRoom.coordinates = e.result.geometry.coordinates;
                startRoom.floor = e.result.properties.level;
                console.log("start in func: ", startRoom);
                updateMapBounds();
            });

            geocoder2.on('result', function (e) {
                endRoom.coordinates = e.result.geometry.coordinates;
                endRoom.floor = e.result.properties.level;
                console.log("end in func: ", endRoom);
                updateMapBounds();

                const openTurnbyTurn = document.getElementById('turnbyturn-info');
                openTurnbyTurn.style.display = "block";
            });

            geocoder1.on('clear', function() {
                startRoom.coordinates = undefined;
                window.layerids.forEach(layerId => {
                    if (map.getLayer(layerId)) {
                        map.removeLayer(layerId);
                        map.removeSource(layerId);
                    }
                })
                window.layerids = [];
                var eachTurnDivs = document.querySelectorAll('#eachturn');
                eachTurnDivs.forEach(function(div) {
                    div.remove(); // Remove each div
                });

                var turnByTurnDir = document.getElementById('turnbyturn-info');
                turnByTurnDir.style.display = 'none'; // Hide the div
            })

            geocoder2.on('clear', function() {
                endRoom.coordinates = undefined; 
                window.layerids.forEach(layerId => {
                    if (map.getLayer(layerId)) {
                        map.removeLayer(layerId);
                        map.removeSource(layerId);
                    }
                })
                window.layerids = [];
                var eachTurnDivs = document.querySelectorAll('#eachturn');
                eachTurnDivs.forEach(function(div) {
                    div.remove(); // Remove each div
                });

                var turnByTurnDir = document.getElementById('turnbyturn-info');
                turnByTurnDir.style.display = 'none'; // Hide the div
            })

            function resetMapboxGeocoder() {
                geocoder1.clear(); // Clear the geocoder input
                geocoder2.clear(); // Clear the geocoder input
                startRoom = {coordinates: undefined, floor: undefined};
                endRoom = {coordinates: undefined, floor: undefined};
            }
            
            // Event listener for back button click
            document.getElementById('backbutton').addEventListener('click', function() {
                resetMapboxGeocoder(); // Reset the Mapbox Geocoder
            });
            
            function updateMapBounds() {
                if (startRoom && endRoom) {
                    var bounds = new mapboxgl.LngLatBounds();
                    bounds.extend(startRoom.coordinates);
                    bounds.extend(endRoom.coordinates);
                    map.fitBounds(bounds, { padding: 50 });
                    if (startRoom.coordinates != undefined && endRoom.coordinates != undefined) {
                        // console.log(findNodeByCoordinate([ -97.15387406945061, 33.25485939795162 ]));
                        startRoute(startRoom, endRoom);
                    }
                }
            }

            const addMarkers = (features, map, markersArray) => {
                features.forEach(feature => {
                    const marker = new mapboxgl.Marker().setLngLat(feature.center).addTo(map);
                    markersArray.push(marker);
                });
            };
            const removeAllMarkers = (markersArray) => {
                markersArray.forEach(marker => marker.remove());
                markersArray.length = 0;
            };
            const handleSearchButtonClick = (query, map, markersArray) => {
                removeAllMarkers(markersArray); // Remove all markers first
                const matchingFeatures = forwardGeocoder(query);
                const selectedLevel = parseInt(1);
                const featuresOnSelectedLevel = matchingFeatures.filter(feature => feature.properties.level === selectedLevel);
                addMarkers(featuresOnSelectedLevel, map, markersArray);
            };

            const markers = [];

            document.getElementById('searchRestRoomButton').addEventListener('click', () => {
                handleSearchButtonClick('restroom', map, markers);
            });

            document.getElementById('searchElevatorButton').addEventListener('click', () => {
                handleSearchButtonClick('elevator', map, markers);
            });

            document.getElementById('searchStairsButton').addEventListener('click', () => {
                handleSearchButtonClick('stair', map, markers);
            });
            
            // Add event listener to the search bar
            geocoder.on('result', (e) => {
                const query = e.result.text;
                handleSearchButtonClick(query, map, markers);
            });
        }
        indoorEqual.setLevel('1');
    });
    document.getElementById('recenter').addEventListener('click', () => {
        // Fly to a center location
        map.flyTo({
            center: [-97.153474, 33.254411], 
            zoom: 18, // Example zoom level
            essential: true // prevents user from cancelling the transition
        });
        indoorEqual.setLevel('1');
    });

    document.getElementById('geolocate').addEventListener('click', () => {
        findUserCoords();
    });
    
    let firstTime = true;
    let userMarker;
    function findUserCoords() {
    if ("geolocation" in navigator) {
        // Get the user's current position
        navigator.geolocation.watchPosition(function(position) {
            // Access the latitude and longitude coordinates
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            var projectedCoordinates;
            
            // Use the coordinates as needed
            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);
            projectedCoordinates = projectLiveCoordinates({ coordinates:[longitude, latitude], floor: 1 });
            if (firstTime) {
                userMarker = new mapboxgl.Marker().setLngLat(projectedCoordinates).addTo(map);
                firstTime = false;
            }
            //projectedCoordinates = projectLiveCoordinates({ coordinates:[longitude, latitude], floor: 1 });
            userMarker.setLngLat(projectedCoordinates).addTo(map);
            userMarker.setColor("red");
            
            // const marker = new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map)
            // Update your map or perform other actions with the coordinates
        }, function(error) {
            // Handle errors
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    console.error("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    console.error("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    console.error("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    console.error("An unknown error occurred.");
                    break;
            }
        });
    } else {
        // Geolocation is not supported by the browser
        console.error("Geolocation is not supported.");
    }
    };


        
