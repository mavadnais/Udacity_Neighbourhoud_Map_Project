function initMap() {
    //var myLatLng = {lat: -25.363, lng: 131.044};
    
    // Create a map object and specify the DOM element for display.
    var map = new google.maps.Map(document.getElementById('map'), {
        center: markersArray[0].globalPosition,
        zoom: 8
    });
    
    for (var i = 0;  i < markersArray.length; i++) {
        markersArray[i].marker = new google.maps.Marker({
            position: markersArray[i].globalPosition,
            map: map,
            title: markersArray[i].title
        });
    }
}