# Flood RRM: Rerouting for Resilient Mobility

Flood RRM is a web-based application built to demonstrate a routing system designed for resilient mobility during flooding events. It uses the Leaflet.js library for interactive maps and the Open Source Routing Machine (OSRM) for efficient route calculations.

## Project Features ⭐

- **Interactive Map**: Displays the area of interest, allowing user interaction 🗺️
- **Draggable Markers**: Easily set start and end locations with draggable map markers 📍
- **Flood Avoidance Areas**: Red circles represent areas to avoid, which the routing algorithm considers during calculations ❌
- **Optimal Route Calculation**: Up to 3 optimal routes are generated, considering distance and avoidance zones 📊
- **Route Visualization**: Clear visual representation of routes directly on the map 👁️
- **Route Information**: Detailed stats about each route, including approximate distances 🕵️

## How to Use

1. Open the web application in a modern web browser.
2. **Note**: Open the browser's developer tools and set the screen size to **720x1600** for proper display of the user interface.
3. Drag the start and end markers to your desired locations on the map.
4. The application will automatically calculate and display up to 3 optimal routes, prioritizing those that avoid the defined areas.
5. Click on any route from the list to highlight it on the map.

---

## Modifying the Map Configuration

Customize the behavior and appearance of the map by editing the `maps.js` file:

### 1. **Starting View of the Map**
   - Modify the map's initial view by changing the `LATITUDE` and `LONGITUDE` on **line 1**:
     ```javascript
     var map = L.map('map').setView([LATITUDE, LONGITUDE], 13);
     ```
   - **Tip**: You can get LAT and LONG coordinates from Google Maps.

### 2. **Adjusting Location Markers**
   - Configure the start and end markers on **lines 7 and 8**:
     ```javascript
     var startMarker = L.marker([14.53059281191111, 121.25890527068195], { draggable: true }).addTo(map);
     ```
   - To make the markers draggable, set `{ draggable: true }`. Change `true` to `false` if you want fixed markers.

### 3. **Customizing Avoidance Circles**
   - Edit the radius and color of the avoid circles:
     ```javascript
     var avoidCircle = L.circle([14.484517990690076, 121.23355601413002], { color: 'red', radius: 1800 }).addTo(map);
     ```
   - Use simple color names (e.g., red, blue, green) and adjust the `radius` to set the circle's size.

### 4. **Adding Additional Avoid Circles**
   - Create more avoidance zones by adding more circle variables:
     ```javascript
     var avoidCircleName = L.circle([LAT, LONG], { color: 'red', radius: 1200 }).addTo(map);
     ```
   - Update the function `isInsideAvoidArea(latlng)`:
     ```javascript
     var distanceLetter = map.distance(latlng, avoidCircleName.getLatLng());
     ```
   - Include the new variable in the `return` statement:
     ```javascript
     return distance < avoidCircle.getRadius() || distanceB < avoidCircleB.getRadius() || distanceLetter < avoidCircleName.getRadius();
     ```
   - On **line 161**, add the variable for repositioning:
     ```javascript
     avoidCircleName.setLatLng(newPos);
     ```

---

Project Made by chrispycreeme.
