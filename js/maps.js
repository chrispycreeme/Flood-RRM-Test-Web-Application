var map = L.map('map').setView([14.53059281191111, 121.25890527068195], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

var startMarker = L.marker([14.53059281191111, 121.25890527068195], { draggable: true }).addTo(map);
var endMarker = L.marker([14.550213418404551, 121.13984262221717], { draggable: true }).addTo(map);

startMarker.on('click', function (e) {
    map.flyTo(e.target.getLatLng(), 18);
});

var avoidCircle = L.circle([14.484517990690076, 121.23355601413002], {
    color: 'red',
    radius: 1800
}).addTo(map);

var avoidCircleB = L.circle([14.521562952881709, 121.16702452092227], {
    color: 'red',
    radius: 1200
}).addTo(map);

var currentRouteLayer = null;

function isInsideAvoidArea(latlng) {
    var distance = map.distance(latlng, avoidCircle.getLatLng());
    var distanceB = map.distance(latlng, avoidCircleB.getLatLng());
    return distance < avoidCircle.getRadius() || distanceB < avoidCircleB.getRadius();
}

function updateRoute() {
    var plan = L.Routing.plan([startMarker.getLatLng(), endMarker.getLatLng()], {
        createMarker: function () { return null; }
    });

    var router = L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1'
    });

    router.route(plan.getWaypoints(), function (err, routes) {
        if (err || !routes) {
            alert('No routes found.');
            return;
        }

        var validRoutes = [];
        var invalidRoutes = [];

        for (var i = 0; i < routes.length; i++) {
            var route = routes[i];
            var shouldAvoid = false;

            for (var j = 0; j < route.coordinates.length; j++) {
                if (isInsideAvoidArea(route.coordinates[j])) {
                    shouldAvoid = true;
                    break;
                }
            }

            if (shouldAvoid) {
                invalidRoutes.push(route);
            } else {
                validRoutes.push(route);
            }
        }

        validRoutes.sort(function (a, b) {
            return a.summary.totalDistance - b.summary.totalDistance;
        });

        validRoutes = validRoutes.slice(0, 3);

        updateRouteList(validRoutes, invalidRoutes);
    });
}

function updateRouteList(validRoutes, invalidRoutes) {
    var container = document.querySelector('.route-list-container');
    container.innerHTML = '';

    validRoutes.forEach(function (route, index) {
        var routeElement = document.createElement('div');
        routeElement.className = 'route-list';
        routeElement.innerHTML = `
            <span class="material-symbols-outlined" style="font-size: 55px; margin-left: 35px">
                local_shipping
            </span>
            <div class="route-details">
                <p class="route-approx-distance">
                    ${(route.summary.totalDistance / 1000).toFixed(1)}km away
                </p>
                <p class="road-status">
                    Road has no detected blockage.
                </p>
            </div>
        `;

        routeElement.addEventListener('click', function () {
            highlightRoute(route, 'green');
            setActiveRouteElement(routeElement, (route.summary.totalDistance / 1000).toFixed(1), 'green');
        });

        container.appendChild(routeElement);
    });

    invalidRoutes.forEach(function (route) {
        var routeElement = document.createElement('div');
        routeElement.className = 'route-list unsafe';
        routeElement.innerHTML = `
            <span class="material-symbols-outlined" style="font-size: 55px; margin-left: 35px">
                local_shipping
            </span>
            <div class="route-details">
                <p class="route-approx-distance">
                    ${(route.summary.totalDistance / 1000).toFixed(1)}km away
                </p>
                <p class="road-status">
                    Road has detected blockage.
                </p>
            </div>
        `;

        routeElement.addEventListener('click', function () {
            highlightRoute(route, '#FF000D');
            setActiveRouteElement(routeElement, (route.summary.totalDistance / 1000).toFixed(1), '#FFBC42');
        });

        container.appendChild(routeElement);
    });
}

function highlightRoute(route, color) {
    if (currentRouteLayer) {
        map.removeLayer(currentRouteLayer);
    }

    currentRouteLayer = L.Routing.line(route, {
        styles: [{ color: color, opacity: 1, weight: 6 }]
    }).addTo(map);
}

function setActiveRouteElement(element, distance, color) {
    var routeElements = document.querySelectorAll('.route-list');
    routeElements.forEach(function (el) {
        el.classList.remove('active');
    });
    element.classList.add('active');

    var routeNameElement = document.querySelector('h1.route-name');
    routeNameElement.textContent = `${distance} km`;
    routeNameElement.style.color = color;

    var locationIconElement = document.querySelector('.route-selected-div .material-symbols-outlined');
    locationIconElement.style.color = color;
}

startMarker.on('dragend', updateRoute);
endMarker.on('dragend', updateRoute);

startMarker.on('drag', function () {
    var newPos = startMarker.getLatLng();
    avoidCircle.setLatLng(newPos);
    avoidCircleB.setLatLng(newPos);
});

updateRoute();