(function ($) {
    // Get some variables
    var googleapi, googlekey, class_data, baseurl;
    googleapi = 'https://maps.googleapis.com/maps/api';
    googlekey = 'AIzaSyAbNE0YwjOz0AU_USrIgSMYzl7DhZb185Q';

    // Grab some data from a hidden input fields
    class_data = JSON.parse( $('#class_data').val() );
    baseurl    = $('#baseurl').val();


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
    $('#pickday').find('button').click(function() {
        window.location.href = baseurl + '/' + $(this).attr('data-value');
        return false;
    });


    // Highlight the relevant day button
    var day = $('h2').text();
    $('#btn'+day).addClass('btn-success').removeClass('btn-primary');


    // Let's find our location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(gotPos, gotError, {
            maximumAge: 0,
            timeout: 5000,
            enableHighAccuracy: true
        });
    } else {
        $('#gps-status').removeClass().addClass('fa fa-times');
        $('#map_canvas').html('<p>Your browser does not support geo-location</p>');
    }

    function gotPos(position) {
        var latitude, longitude;
        latitude  = position.coords.latitude;
        longitude = position.coords.longitude;

        console.log('LonLat: ' + longitude + ', ' + latitude);
        $('#gps-status').removeClass().addClass('fa fa-map-marker');

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

            if (status === 'OK') {
                i=0;
                console.log('DistanceMatrix: ' + status);
                $('.travel-info').each(function() {
                    travel   = data.rows[0].elements[i].distance.text;
                    duration = data.rows[0].elements[i].duration.text;

                    $(this).html('Distance from you: ' + travel + ' (' + duration + ')');
                    i++
                });

            } else {
                console.log('getDistanceMatrix Error: ' + status);
            }
        }
    }


    function gotError(msg) {
        console.log(msg);
        $('#gps-status').removeClass().addClass('fa fa-times');
    }

}) (jQuery);