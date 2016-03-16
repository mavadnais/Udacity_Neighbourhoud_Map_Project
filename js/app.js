
var g_markersArray = [
    {
        title: "Schwartz's Deli",
        address: '3895 Boul St-Laurent, Montréal, QC H2W 1X9',
        marker: null
    }, 
    {
        title: 'Vol De Nuit',
        address: '14 Rue Prince Arthur E, Montréal, QC H2X 1S3',
        marker: null
    }, 
    {
        title: 'Café Saint Laurent Frappé',
        address: '3900 Boul St-Laurent, Montréal, QC H2W 1Y2',
        marker: null
    }, 
    {
        title: 'Bar Bifteck St-Laurent',
        address: '3702 Boul St-Laurent, Montréal, QC H2X 2V4',
        marker: null
    }, 
    {
        title: 'La Belle Province',
        address: '3608, boul Saint-Laurent, Montréal, QC H2X 2V4',
        marker: null
    }      
];

$(function(){
    var mapWidth = $(window).width() * 0.85;
    var mapHeight = $(window).height() * 0.9;
    console.log("width: " + mapWidth + ", height: " + mapHeight);
    $('#map_container').width(mapWidth + 'px');
    $('#map_container').height(mapHeight + 'px');
    
    for (var i = 0; i < g_markersArray.length; i++) {
        $('#main_menu').append(
            '<div class="menu_item pointer_cursor"> - ' + g_markersArray[i].title + '</div>'  
        );
    }
});

function toggleMenuContainer() {
    //$('#menu_container').toggle()
}

function updateFilter() {
    console.log('in updateFilter: ' + $('#filter_text_field').val());
}

