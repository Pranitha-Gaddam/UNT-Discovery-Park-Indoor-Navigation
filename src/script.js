function applyColorAdjustments(brightness, contrast, saturate, hue) {
    const body = document.body;
    body.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) hue-rotate(${hue}deg)`;

    updateBackgroundColor(saturate);
    console.log("color applied");
}

function updateBackgroundColor(saturate) {
    const body = document.body;
    const saturationValue = saturate / 100; // Convert to a value between 0 and 1
    const yellowSaturationThreshold = 1.5; // Threshold for determining yellow background
    const backgroundColor = saturationValue >= yellowSaturationThreshold ? 'yellow' : '';
    body.style.backgroundColor = backgroundColor;
}



function updateSliders() {
    // Retrieve slider values
    const brightness = document.getElementById('brightnessSlider').value;
    const contrast = document.getElementById('contrastSlider').value;
    const saturate = document.getElementById('saturateSlider').value;
    const hue = document.getElementById('hueSlider').value;

    // Update percentage labels for sliders
    document.getElementById('brightnessLabel').innerText = `${brightness}%`;
    document.getElementById('contrastLabel').innerText = `${contrast}%`;
    document.getElementById('saturateLabel').innerText = `${saturate}%`;
    document.getElementById('hueLabel').innerText = `${hue}%`;

    // Apply color adjustments
    applyColorAdjustments(brightness, contrast, saturate, hue);

    console.log("Im okay"); // Just for debugging
}

function saveColorPreferences(brightness, contrast, saturate, hue) {
    // Check if preferences are already stored in cookies
    const existingBrightness = getCookie('brightness');
    const existingContrast = getCookie('contrast');
    const existingSaturate = getCookie('saturate');
    const existingHue = getCookie('hue');

    // Update existing cookies or create new ones
    document.cookie = `brightness=${existingBrightness !== null ? existingBrightness : brightness}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
    document.cookie = `contrast=${existingContrast !== null ? existingContrast : contrast}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
    document.cookie = `saturate=${existingSaturate !== null ? existingSaturate : saturate}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
    document.cookie = `hue=${existingHue !== null ? existingHue : hue}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;

    // Log the saved preferences to the console
    console.log('Saved preferences:', { brightness, contrast, saturate, hue });
    alert('Saved Successfully!');
}

// Function to get cookie value by name
function getCookie(name) {
    const cookieName = `${name}=`;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith(cookieName)) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return null;
}



function createSliders() {
    const adjustmentButtons = document.getElementById('adjustmentButtons');
    adjustmentButtons.innerHTML = ''; // Clear previous buttons

    const adjustments = ['brightness', 'contrast', 'saturate', 'hue'];

    adjustments.forEach(adjustment => {
        const sliderDiv = document.createElement('div');
        sliderDiv.className = 'd-flex align-items-center';

        const label = document.createElement('label');
        label.innerText = `${adjustment.charAt(0).toUpperCase() + adjustment.slice(1)}: `;

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '200'; // Adjust the max value based on your preference
        slider.value = adjustment === 'hue' ? '0' : '100'; // Default value
        slider.id = `${adjustment}Slider`; // Unique ID for each slider

        const percentageLabel = document.createElement('span');
        percentageLabel.id = `${adjustment}Label`;
        percentageLabel.innerText = '100%';

        slider.addEventListener('input', () => {
            const percentage = slider.value;
            percentageLabel.innerText = `${percentage}%`;

            const brightness = document.getElementById('brightnessSlider').value;
            const contrast = document.getElementById('contrastSlider').value;
            const saturate = document.getElementById('saturateSlider').value;
            const hue = document.getElementById('hueSlider').value;

            applyColorAdjustments(brightness, contrast, saturate, hue);
        });

        sliderDiv.appendChild(label);
        sliderDiv.appendChild(slider);
        sliderDiv.appendChild(percentageLabel);

        adjustmentButtons.appendChild(sliderDiv);
    });
    console.log("Sliders created.");
}

function resetPreferences() {
    // Reset sliders to default values
    document.getElementById('brightnessSlider').value = '100';
    document.getElementById('contrastSlider').value = '100';
    document.getElementById('saturateSlider').value = '100';
    document.getElementById('hueSlider').value = '0';

    // Update slider labels
    updateSliders();
    window.location.reload();
}

function savePreferences() {
    const brightness = document.getElementById('brightnessSlider').value;
    const contrast = document.getElementById('contrastSlider').value;
    const saturate = document.getElementById('saturateSlider').value;
    const hue = document.getElementById('hueSlider').value;

    applyColorAdjustments(brightness, contrast, saturate, hue);
    saveColorPreferences(brightness, contrast, saturate, hue);
}

document.getElementById('searchbar').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    var query = document.getElementById('searchInput').value; // Get the search query

    // Get the current map center coordinates
    var center = map.getCenter();

    // unpkg.com/mapbox-gl-indoorequal@latest/ to search for the query around the current map center
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?proximity=${center.lng},${center.lat}&access_token=${mapboxgl.accessToken}`)
    .then(response => response.json())
    .then(data => {
        // Extract coordinates from the first result
        var coordinates = data.features[0].center;

        // Update the map to center on the coordinates obtained from the Geocoding API
        map.flyTo({center: coordinates, zoom: 19.7}); // You can adjust the zoom level as needed
    })
    .catch(error => {
        console.error('Error:', error);
    });
});


// Submit feedback function
function submitFeedback() {
    alert('Thank you for your feedback!');


     window.location.reload();
    const feedbackText = document.getElementById('feedbackTextarea').value;
/*
    fetch('/submit-feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ feedback: feedbackText })
    })
    .then(response => {
        if (response.ok) {
            alert('Thank you for your feedback!');
        } else {
            alert('Failed to submit feedback. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while submitting feedback. Please try again later.');
    });
    */
}
