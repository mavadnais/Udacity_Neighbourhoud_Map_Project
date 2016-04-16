'use strict';

// Initial array of marker objects
var g_markersArray = [
    {
        index: 0,
        title: "Schwartz's Deli",
        address: '3895 Boul St-Laurent, Montréal, QC H2W 1X9',
        description: 'World Famous Original Smoked Meat! Over 80 years of tradition - A Montreal classic. The oldest deli in Canada. A true Montreal landmark situated on the historic "Main".',
        website: 'http://www.schwartzsdeli.com',
        yelpBusinessID: 'schwartzs-montreal-2',
        yelpInfo: '', 
        infoContent: '',
        mapMarker: null,
        geoLocation: null,
        infoWindow: null
    }, 
    {
        index: 1, 
        title: 'Vol De Nuit',
        address: '14 Rue Prince Arthur E, Montréal, QC H2X 1S3',
        description: 'Good bar with a juke box, TVs and video gampbling machines. Student hangout.',
        website: '',
        yelpBusinessID: 'vol-de-nuit-montreal-2',
        yelpInfo: '', 
        infoContent: '',
        mapMarker: null,
        geoLocation: null,
        infoWindow: null
    }, 
    {
        index: 2, 
        title: 'Café Saint Laurent Frappé',
        address: '3900 Boul St-Laurent, Montréal, QC H2W 1Y2',
        description: 'Spacious sports bar featuring pool tables, foosball & a patio, plus straightforward pub grub.',
        website: 'http://www.barstlaurentfrappe.com',
        yelpBusinessID: 'cafe-saint-laurent-frappe-le-montreal-4',
        yelpInfo: '', 
        infoContent: '',
        mapMarker: null,
        geoLocation: null,
        infoWindow: null
    }, 
    {
        index: 3, 
        title: 'Bar Bifteck St-Laurent',
        address: '3702 Boul St-Laurent, Montréal, QC H2X 2V4',
        description: 'Good student/hipster bar with pool tables and TVs',
        website: '',
        yelpBusinessID: 'st-laurent-bifteck-montreal-4',
        yelpInfo: '', 
        infoContent: '',
        mapMarker: null,
        geoLocation: null,
        infoWindow: null
    }, 
    {
        index: 4, 
        title: 'La Belle Province',
        address: '3608, boul Saint-Laurent, Montréal, QC H2X 2V4',
        description: 'La Belle Province is a well-known fast food restaurant chain in the province of Quebec, Canada. It is also known as La Belle Pro, Belle Pro, or La Belle as nicknames. Each location is independently franchised; some are open 24 hours a day.',
        website: 'http://restaurantlabelleprovince.com/fr/accueil/',
        yelpBusinessID: 'belle-province-montreal-2',
        yelpInfo: '', 
        infoContent: '',
        mapMarker: null,
        geoLocation: null,
        infoWindow: null
    }     
];

// Base HTML for the different parts of the info window
var g_infoTitleHTMLBase = '<div class="info_title">%info_title%</div>';
var g_infoAddressHTMLBase = '<div class="info_address">%info_address%</div>';
var g_infoDescriptionHTMLBase = '<div class="info_description">%info_description%</div>';
var g_infoWebsiteHTMLBase = '<div class="info_website"><a href="%info_website%">%info_website%</a></div>';
var g_infoImageHTMLBase = '<div class="info_image"><img src="http://maps.googleapis.com/maps/api/streetview?size=150x100&location=%info_image_location%"/></div>';
var g_infoYelpHTMLBase = '<div class="info_yelp">%info_yelp%</div>';

var g_testFailures = {
    testGeocodeFailure: false  
};

var g_selectedMarkers = [];
var g_displayMessage = '';

// Class for knockout markers
var Marker = function(p_data) {
    this.index = ko.observable(p_data.index);
    this.title = ko.observable(p_data.title);
    this.data = p_data;      
};

// Knockout view model
var ViewModel = function() {
    var self = this;
    
    this.markerList = ko.observableArray([]);
    
    g_markersArray.forEach(function(p_markerItem) {
        self.markerList.push(new Marker(p_markerItem));
    });
    
    this.selectCurrentMarker = function(p_selectedMarker) {
        openInfoWindowByIndex(p_selectedMarker.index());
        //TODO REMOVE: selectMarkerByIndex(p_selectedMarker.index());
        animateMarkerByIndex(p_selectedMarker.index());
    };    
};

ko.applyBindings(new ViewModel());

function displayMessage(p_message, p_messageType) {
    // Display the message
    var messageDisplay = $('#message_display');
    messageDisplay.show();
    if (g_displayMessage) {
        g_displayMessage += '<br>' + p_message;
    }
    else {
        g_displayMessage = p_message;
    }
    messageDisplay.html(g_displayMessage);
    
    // Change text color depending on type of message
    switch (p_messageType) {
        case 'negative':
            messageDisplay.addClass('negative_message');
            break;
        case 'positive':
            messageDisplay.addClass('positive_message');
            break;
        default:
            messageDisplay.addClass('neutral_message');
    }
    
    // In 10 seconds hide the message
    window.setTimeout(function() {
        messageDisplay.hide();
        g_displayMessage = '';
        messageDisplay.html(g_displayMessage);
        messageDisplay.removeClass('negative_message');
        messageDisplay.removeClass('positive_message');
        messageDisplay.removeClass('neutral_message');
    }, 10000);
}

// Code to get yelp reviews is mainly taken from: https://github.com/levbrie/mighty_marks/blob/master/yelp-business-sample.html
// Although it was adapted to be object-oriented and reusable
var YelpRetriever = function() {
    this.auth = {
        // These secret keys shouldn't be exposed, but since everything in this app is client-side, here they are
        consumerKey : "ER90mCERioR9vSegdPALVg",
		consumerSecret : "gacwUcrNK_0FZX_waSd4UwMwZNI",
		accessToken : "v0lPLknf1qnjY1GP1b8SHybFvtWBMH-a",
		accessTokenSecret : "isyO1TCmRcyBqddfw-0XIdk_nuM",
		serviceProvider : {
		    signatureMethod : "HMAC-SHA1"
		}
	};
    
	this.accessor = {
	    consumerSecret : this.auth.consumerSecret,
		tokenSecret : this.auth.accessTokenSecret
	};
	
    this.parameters = [];
	this.parameters.push(['callback', 'cb']);
	this.parameters.push(['oauth_consumer_key', this.auth.consumerKey]);
	this.parameters.push(['oauth_consumer_secret', this.auth.consumerSecret]);
	this.parameters.push(['oauth_token', this.auth.accessToken]);
	this.parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
};

YelpRetriever.prototype.getYelpInfo = function(p_marker) {
    var yelpURLBase = 'http://api.yelp.com/v2/business/';
    var message = {
	    'action' : yelpURLBase + p_marker.yelpBusinessID,
		'method' : 'GET',
		'parameters' : this.parameters
	};
    
	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign(message, this.accessor);
			
    var parameterMap = OAuth.getParameterMap(message.parameters);
	parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);
    
    // Make the Ajax Call
	$.ajax({
	    'url' : message.action,
		'data' : parameterMap,
		'cache' : true,
		'dataType' : 'jsonp',
        'timeout' : 3000,
		'success' : function(p_data, p_textStats, p_XMLHttpRequest) {
            p_marker.yelpInfo = p_data;
            
            // Add the Yelp review to the info window
            var yelpReview = '<br>Yelp Review: ' + p_marker.yelpInfo.rating + '<br>';
            yelpReview += '<img src="' + p_marker.yelpInfo.rating_img_url + '"/>';
            p_marker.infoContent += g_infoYelpHTMLBase.replace('%info_yelp%', yelpReview);
            p_marker.infoWindow.setContent(p_marker.infoContent);
		},
        'error' : function(p_XMLHttpRequest, p_textStatus, p_errorThrown) {
            displayMessage('Could not get yelp info for: ' + p_marker.title + 
                ', textStatus: ' + p_textStatus +
                ', errorThrown: ' + p_errorThrown, 'negative');
        }
	});
};

var g_yelpRetriever = new YelpRetriever();

$(function(){
    // Set map container width and height relative to the window width and height
    // Couldn't figure out how to do it with css percentages.
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var mapWidth;
    var mapHeight;

    if (windowWidth >= 700)
    {
        mapWidth = windowWidth * 0.85;
        mapHeight = windowHeight * 0.9;
        
    }
    else {
        mapWidth = windowWidth;
        mapHeight = windowHeight * 0.87;
        
        toggleMenuContainer();
    }
    $('#map').width(mapWidth + 'px');
    $('#map').height(mapHeight + 'px');
});

function toggleMenuContainer() {
    $('#menu_container').toggle();
}

function updateFilter() {
    var filterValue = $('#filter_text_field').val();
    
    g_selectedMarkers = [];
    
    // Iterate through all the markers and see if the filter is a substring of the title{
    for (var i = 0; i < g_markersArray.length; i++) {
        var lowerCaseTitle = g_markersArray[i].title.toLowerCase();
        var lowerCaseFilterValue = filterValue.toLowerCase();
            
        if (lowerCaseFilterValue && lowerCaseTitle.indexOf(lowerCaseFilterValue) > -1) {
            g_selectedMarkers.push(g_markersArray[i]);
            $('#marker_menu_item_' + i).addClass('selected_marker');
            g_markersArray[i].mapMarker.setVisible(true);    
        }
        else {
            $('#marker_menu_item_' + i).removeClass('selected_marker');
            g_markersArray[i].mapMarker.setVisible(false);  
        }    
    }
    
    // If there is only one selected marker, open its info window    
    if (g_selectedMarkers.length == 1) {
        openInfoWindowByMarker(g_selectedMarkers[0]);
        animateMarkerByMarker(g_selectedMarkers[0]);
    }
    
    // If there is nothing in the filter, make sure they are all visible   
    if (! filterValue) {
        setAllMapMarkersVisible(true);
    }
}

function clearFilter() {
    $('#filter_text_field').val('');
    
    // Close all info windows
    closeAllInfoWindows();   
    // TODO REMOVE: deselectAllMarkers();
    
    // Clear the selected marker array
    g_selectedMarkers = [];
    
    // Remove selected_marker class from all markers since none are selected
    for (var i = 0; i < g_markersArray.length; i++) {
        $('#marker_menu_item_' + i).removeClass('selected_marker');   
    }
    
    // Set all map markers visible
    setAllMapMarkersVisible(true);
}

function generateInfoContent(p_marker) {
    // Generate info window content html
    p_marker.infoContent = g_infoTitleHTMLBase.replace('%info_title%', p_marker.title);
    p_marker.infoContent += '<br>';
    p_marker.infoContent += g_infoAddressHTMLBase.replace('%info_address%', p_marker.address);
    p_marker.infoContent += '<br>';
    p_marker.infoContent += g_infoDescriptionHTMLBase.replace('%info_description%', p_marker.description);
    p_marker.infoContent += '<br>';
    if (p_marker.website) {
        p_marker.infoContent += g_infoWebsiteHTMLBase.replace(new RegExp('%info_website%', 'g'), p_marker.website);
        p_marker.infoContent += '<br>';
    }
    p_marker.infoContent += g_infoImageHTMLBase.replace('%info_image_location%', p_marker.address);
    
    g_yelpRetriever.getYelpInfo(p_marker);
}