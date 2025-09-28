// Munich Transport Client-side JavaScript
// Uses fetch() to call existing JSON endpoints

let selectedStationId = null;
let selectedStationName = null;

// Search for stations using the API
async function searchStations() {
    const query = document.getElementById('stationSearch').value.trim();
    const resultsDiv = document.getElementById('searchResults');
    
    if (!query) {
        resultsDiv.style.display = 'none';
        return;
    }
    
    try {
        // Show loading state
        resultsDiv.innerHTML = '<div class="loading">Searching stations...</div>';
        resultsDiv.style.display = 'block';
        
        // Call the API endpoint
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const stations = await response.json();
        
        // Display results
        displaySearchResults(stations);
        
    } catch (error) {
        console.error('Error searching stations:', error);
        resultsDiv.innerHTML = '<div class="error">Error searching stations. Please try again.</div>';
    }
}

// Display search results in the UI
function displaySearchResults(stations) {
    const resultsDiv = document.getElementById('searchResults');
    
    if (stations.length === 0) {
        resultsDiv.innerHTML = '<div>No stations found matching your search.</div>';
        return;
    }
    
    let html = '<h3>Search Results:</h3>';
    stations.forEach(station => {
        html += `
            <div class="result-item" onclick="selectStation('${station.id}', '${station.name}')">
                <strong>${station.name}</strong>
                <span style="color: #666;">${station.id}</span>
            </div>
        `;
    });
    
    resultsDiv.innerHTML = html;
}

// Select a station for getting departures
function selectStation(stationId, stationName) {
    selectedStationId = stationId;
    selectedStationName = stationName;
    
    // Update UI to show selected station
    document.getElementById('selectedStation').textContent = `Selected: ${stationName}`;
    document.getElementById('getDeparturesBtn').disabled = false;
    
    // Hide search results
    document.getElementById('searchResults').style.display = 'none';
    
    // Clear previous departure results
    document.getElementById('departureResults').style.display = 'none';
}

// Get departures for the selected station
async function getDepartures() {
    if (!selectedStationId) {
        alert('Please select a station first');
        return;
    }
    
    const resultsDiv = document.getElementById('departureResults');
    
    try {
        // Show loading state
        resultsDiv.innerHTML = '<div class="loading">Loading departures...</div>';
        resultsDiv.style.display = 'block';
        
        // Call the API endpoint
        const response = await fetch(`/api/departures/${encodeURIComponent(selectedStationId)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const departures = await response.json();
        
        // Display departures
        displayDepartures(departures);
        
    } catch (error) {
        console.error('Error getting departures:', error);
        resultsDiv.innerHTML = '<div class="error">Error getting departures. Please try again.</div>';
    }
}

// Display departures in the UI
function displayDepartures(departures) {
    const resultsDiv = document.getElementById('departureResults');
    
    if (departures.length === 0) {
        resultsDiv.innerHTML = '<div>No departures found for this station.</div>';
        return;
    }
    
    let html = `<h3>Departures from ${selectedStationName}:</h3>`;
    departures.forEach(departure => {
        html += `
            <div class="departure-item">
                <div>
                    <span class="line-badge ${departure.type}">${departure.line}</span>
                    <span>${departure.destination}</span>
                </div>
                <strong>${departure.departure}</strong>
            </div>
        `;
    });
    
    resultsDiv.innerHTML = html;
}

// Add keyboard support for search
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('stationSearch');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchStations();
            }
        });
        
        // Optional: Search as you type with debouncing
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const query = searchInput.value.trim();
                if (query.length >= 2) {
                    searchStations();
                } else if (query.length === 0) {
                    document.getElementById('searchResults').style.display = 'none';
                }
            }, 500); // Wait 500ms after user stops typing
        });
    }
});