mapboxgl.accessToken = 'pk.eyJ1Ijoia2ltdm8yMTExIiwiYSI6ImNsdGcwYmhoajB2czcyanA3YWlpZGh6dHQifQ.Niu8tgHPbGDSq09zYRBAFg';

        const map = new mapboxgl.Map({
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
            
            //goBackToCenter() and map.addcontrol() moved to script.js



            // Add zoom and rotation controls to the map.
            const nav = new mapboxgl.NavigationControl({
                visualizePitch: true
            });
            map.addControl(nav, 'top-right');
        

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
                    mapboxgl: mapboxgl
                });

                const geocoder1 = new MapboxGeocoder({
                    accessToken: mapboxgl.accessToken,
                    localGeocoder: forwardGeocoder,
                    mapboxgl: mapboxgl,
                    placeholder: 'Starting Point',
                    zoom: 20,                
                });

                const geocoder2 = new MapboxGeocoder({
                    accessToken: mapboxgl.accessToken,
                    mapboxgl: mapboxgl,
                    placeholder: 'Destination',
                    localGeocoder: forwardGeocoder,  
                            
                });
        
                // Add the geocoder to your existing searchbar form
                document.getElementById('searchbar').appendChild(geocoder.onAdd(map));
                document.getElementById('start').appendChild(geocoder1.onAdd(map));
                document.getElementById('end').appendChild(geocoder2.onAdd(map));

                geocoder1.on('result', function (e) {
                    var coordinates = e.result.geometry.coordinates;
                    startRoom = coordinates;
                    updateMapBounds();
                });
                geocoder2.on('result', function (e) {
                    var coordinates = e.result.geometry.coordinates;
                    endRoom = coordinates;
                    updateMapBounds();
                });
                
                function updateMapBounds() {
                    if (startRoom && endRoom) {
                        var bounds = new mapboxgl.LngLatBounds();
                        bounds.extend(startRoom);
                        bounds.extend(endRoom);
                        map.fitBounds(bounds, { padding: 50 });
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
                    const selectedLevel = parseInt(floorSelector.value);
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

        map.on('load', () => {
            map.addSource("route", {
                    "type": "geojson",
                    "data": "data/k1_path.geojson"
            });

            map.addLayer({
                    "id": "routes-layer",
                    "type": "line",
                    "source": "route",
                    "layout": {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    "paint": {
                            'line-color': '#888',
                            'line-width': 8
                    }
            });
        });

        