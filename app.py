from flask import Flask, render_template, request, jsonify
import requests
import json

app = Flask(__name__)

# Mock data for Munich transport stations
MOCK_STATIONS = [
    {"id": "de:09162:1", "name": "Hauptbahnhof", "type": "station"},
    {"id": "de:09162:2", "name": "Marienplatz", "type": "station"},
    {"id": "de:09162:3", "name": "Karlsplatz (Stachus)", "type": "station"},
    {"id": "de:09162:4", "name": "Odeonsplatz", "type": "station"},
    {"id": "de:09162:5", "name": "Sendlinger Tor", "type": "station"},
    {"id": "de:09162:6", "name": "Isartor", "type": "station"},
    {"id": "de:09162:7", "name": "Max-Weber-Platz", "type": "station"},
    {"id": "de:09162:8", "name": "Ostbahnhof", "type": "station"},
]

# Mock departure data
MOCK_DEPARTURES = [
    {"line": "U1", "destination": "Olympia-Einkaufszentrum", "departure": "2 min", "type": "subway"},
    {"line": "U2", "destination": "Messestadt Ost", "departure": "5 min", "type": "subway"},
    {"line": "S1", "destination": "Flughafen München", "departure": "8 min", "type": "sbahn"},
    {"line": "16", "destination": "Sendlinger Tor", "departure": "3 min", "type": "tram"},
    {"line": "100", "destination": "Arabellapark", "departure": "12 min", "type": "bus"},
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['GET', 'POST'])
def search():
    if request.method == 'POST':
        query = request.form.get('q', '')
        results = search_stations(query)
        return render_template('search_results.html', query=query, results=results)
    # For GET requests, just redirect to home page since we have the form there
    return render_template('index.html')

@app.route('/departures', methods=['GET', 'POST'])
def departures():
    if request.method == 'POST':
        station_id = request.form.get('station_id', '')
        station_name = request.form.get('station_name', 'Unknown Station')
        departures = get_departures(station_id)
        return render_template('departures.html', station_name=station_name, departures=departures)
    # For GET requests, just redirect to home page since we have the form there
    return render_template('index.html')

# API endpoints
@app.route('/api/search')
def api_search():
    query = request.args.get('q', '')
    results = search_stations(query)
    return jsonify(results)

@app.route('/api/departures/<station_id>')
def api_departures(station_id):
    departures = get_departures(station_id)
    return jsonify(departures)

def search_stations(query):
    """Search for stations matching the query."""
    if not query:
        return []
    
    query_lower = query.lower()
    results = []
    
    for station in MOCK_STATIONS:
        if query_lower in station['name'].lower():
            results.append(station)
    
    return results

def get_departures(station_id):
    """Get departure information for a station."""
    if not station_id:
        return []
    
    # In a real app, this would query the actual transport API
    # For now, return mock data
    return MOCK_DEPARTURES

if __name__ == '__main__':
    app.run(debug=True)