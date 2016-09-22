(function ($) {
    // Get some variables
    var protocol, host, path, googleapi, googlekey, class_data;
    protocol  = window.location.protocol;
    host      = window.location.host;
    path      = window.location.pathname;
    googleapi = 'https://maps.googleapis.com/maps/api';
    googlekey = 'AIzaSyAbNE0YwjOz0AU_USrIgSMYzl7DhZb185Q';

    // Grab the class data from a hidden input field
    class_data = JSON.parse( $('#class_data').val() );


    // Download streetview image only when class details are shown
    $('.panel').on('show.bs.collapse', function(e) {
        var hdg    = '';
        var street = $(e.target).find('.street_view');
        var pos    = street.attr('data-latlon');

        if( street.attr('data-heading') != 'null' && street.attr('data-heading') != 0.00 )
            hdg = '&heading=' + street.attr('data-heading');

        var url ='https://maps.google.com/maps?q=' + pos;
        var img='<img src="' + googleapi + '/streetview?size=300x300&location=' + pos + hdg + '&key=' + googlekey + '" class="img-polaroid" />';

        street.replaceWith('<a target="_blank" href="' + url + '">' + img + '</a>');
    });


    // Action when a day button is clicked
    $('#pickday button').click(function() {
        //console.log('href = ' + protocol + '//' + host + path + '/' + $(this).attr('data-value'));
        window.location.href = protocol+'//'+ host + path + '/' + $(this).attr('data-value');
        return false;
    });


    // Highlight the relevant day button
    var day = $('h2').text();
    $('#btn'+day).addClass('btn-success').removeClass('btn-primary');


    // Let's find our location
    if (!navigator.geolocation) {
        $('#map_canvas').html('<p>Your browser does not support geo-location</p>');
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }

    function success(position) {
        var latitude, longitude;
        latitude  = position.coords.latitude;
        longitude = position.coords.longitude;

        var myLatLng = new google.maps.LatLng(latitude, longitude);

        // Lets try and find our distance from each class
        var destinations = [];
        for (i=0; i<class_data.length; i++) {
            destinations.push( str = class_data[i].address.loc.coordinates[1] + ',' + class_data[i].address.loc.coordinates[0] );
        }

        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix({
            origins: [ myLatLng ],
            destinations: destinations,
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.IMPERIAL
        }, displayTravelInfo);

        function displayTravelInfo(data, status) {
            var i, travel, duration;

            // Iterate through results and display on page
            if (status === 'OK') {
                i=0;
                $('.travel-info').each(function() {
                    travel = data.rows[0].elements[i].distance.text;
                    duration = data.rows[0].elements[i].duration.text;

                    $(this).html('Distance from you: ' + travel + ' (' + duration + ')');
                    i++
                });

            } else {
                console.log('getDistanceMatrix Error: ' + status);
            }
        }

        // Display the map
        var mapOptions = {
            zoom: 9,
            center: myLatLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

        // Set marker for our position
        var myPos = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: 'You are here',
            zIndex: 99
        });

        // Show some funky GKR icons on our map where the classes are running
        var markerBounds = new google.maps.LatLngBounds();
        markerBounds.extend(myLatLng);

        // Custom marker
        var gkrIcon = new google.maps.MarkerImage('/public/img/gkr-marker.png',
            new google.maps.Size(36,48),
            new google.maps.Point(0,0),
            new google.maps.Point(18,48)
        );

        var gkrShadow = new google.maps.MarkerImage('/public/img/gkr-marker-shadow.png',
            new google.maps.Size(64,48),
            new google.maps.Point(0,0),
            new google.maps.Point(18,48)
        );

        var gkrShape = {
            coord: [23,1,24,2,26,3,27,4,28,5,29,6,30,7,31,8,32,9,32,10,33,11,33,12,34,13,35,14,35,15,35,16,35,17,35,18,35,19,35,20,35,21,35,22,35,23,34,24,33,25,33,26,32,27,32,28,31,29,30,30,29,31,28,32,26,33,25,34,22,35,22,36,22,37,21,38,20,39,20,40,20,41,19,42,19,43,18,44,18,45,18,46,17,46,17,45,17,44,16,43,16,42,15,41,15,40,15,39,14,38,14,37,14,36,13,35,10,34,9,33,7,32,6,31,5,30,4,29,3,28,3,27,2,26,2,25,1,24,1,23,1,22,0,21,0,20,0,19,0,18,0,17,0,16,0,15,1,14,1,13,2,12,2,11,3,10,3,9,4,8,5,7,6,6,7,5,8,4,9,3,11,2,12,1,23,1],
            type: 'poly'
        };
        // Custom Marker


        // Set marker(s) for each class running
        for(var i = 0; i < class_data.length; i++) {
            var thisClass = new google.maps.LatLng( class_data[i].address.loc.coordinates[1], class_data[i].address.loc.coordinates[0] );
            var marker = new google.maps.Marker({
                position: thisClass,
                map: map,
                zIndex: 1,
                icon: gkrIcon,
                shadow: gkrShadow,
                shape: gkrShape,
                title: class_data[i].name + ' (Click for more info)',
                info: '[href="#timetable-id-' + class_data[i]._id + '"]'
            });
            markerBounds.extend(thisClass);

             // Show class details when class marker is clicked
             google.maps.event.addListener( marker, 'click', function() {
                 $(this.info).click();
             });
         }
         map.fitBounds( markerBounds );


        /**
        $.ajax({
            url: "http://localhost/api/v1/classes/closest/" + longitude + "/" + latitude,
            type: "GET",
            crossDomain: true
        }).then( function(data) {


        });
        **/
    }

    function error() {
        $('#map_canvas').html('<p>Your browser does not support geo-location</p>');
    }

}) (jQuery);