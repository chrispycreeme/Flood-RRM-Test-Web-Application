document.addEventListener('DOMContentLoaded', function () {
    const possibleRoutesLink = document.querySelector('.item-list[href="#"]:first-child');
    const parametersLink = document.querySelector('.item-list[href="#"]:nth-child(2)');
    const locationDiv = document.querySelector('.location-div');
    const routeListContainer = document.querySelector('.route-list-container');
    const routedeadend = document.querySelector('.route-deadend');
    const resetroute = document.querySelector('.reset-reroute');

    possibleRoutesLink.addEventListener('click', function (event) {
        event.preventDefault();
        locationDiv.style.display = 'none';
        routeListContainer.style.display = 'block';
        possibleRoutesLink.classList.add('active');
        parametersLink.classList.remove('active');
        routedeadend.style.display = 'block';
        resetroute.style.display = 'block';
    });

    parametersLink.addEventListener('click', function (event) {
        event.preventDefault();
        locationDiv.style.display = 'block';
        routeListContainer.style.display = 'none';
        parametersLink.classList.add('active');
        possibleRoutesLink.classList.remove('active');
        routedeadend.style.display = 'none';
        resetroute.style.display = 'none';
    });
});