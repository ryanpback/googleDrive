var vehicleApi = require('./../.env').vehicleApi;
var googleApi = require('./../.env').googleApi;
var map;
window.initMap = function() {

  var chicago = {lat: 41.85, lng: -87.65};
  var indianapolis = {lat: 41.85, lng: -87.65};

  var map = new google.maps.Map(document.getElementById('map'), {
    center: chicago,
    scrollwheel: false,
    zoom: 7
  });

  var directionsDisplay = new google.maps.DirectionsRenderer({
    map: map
  });

  // Set destination, origin and travel mode.
  var request = {
    destination: indianapolis,
    origin: chicago,
    travelMode: 'DRIVING'
  };

  // Pass the directions request to the directions service.
  var directionsService = new google.maps.DirectionsService();
  directionsService.route(request, function(response, status) {
    if (status == 'OK') {
      // Display the route on the map.
      directionsDisplay.setDirections(response);
    }
  });
}

$(function() {
 $('select').material_select();
 var originLat;
 var originLong;
 var destLat;
 var destLong;
  $('#mpg').submit(function(event) {
    event.preventDefault();
    // var make = $('#make').val();
    // var model = $('#model').val();
    // var year = $('#year').val();
    var origin = $('input#origin').val().replace(' ', '+').replace(',', '');
    var dest = $('input#destination').val().replace(' ', '+').replace(',', '');

    // $.get('https://api.edmunds.com/api/editorial/v2/' + make + '/' + model + '/' + year + '?view=basic&fmt=json&api_key=' + vehicleApi, function(response) {
    //   newResponse = parseInt(response.powertrain.substring(response.powertrain.match(/mpg/).index-3,response.powertrain.match(/mpg/).index-1));
    // // $('#results-body').text('The mpg for the ' + year + ' ' + make + ' ' + model + ' is ' + newResponse + '.');
    // });
    $.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + origin + '&key=AIzaSyBfTldJELwTqc1w6_stwnFXgQPq5qgw2E8').then(function(originResponse) {
      originLat = originResponse.results[0].geometry.viewport.northeast.lat;
      originLong = originResponse.results[0].geometry.viewport.northeast.lng;
      $.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + dest + '&key=AIzaSyBfTldJELwTqc1w6_stwnFXgQPq5qgw2E8').then(function(destResponse) {
        destLat = destResponse.results[0].geometry.viewport.northeast.lat;
        destLong = destResponse.results[0].geometry.viewport.northeast.lng;
        var origin2 = new google.maps.LatLng(originLat, originLong);
        var destination2 = new google.maps.LatLng(destLat, destLong);

        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
          {
            origins: [origin2],
            destinations: [destination2],
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false,
          }, callback);

          function callback(response, status) {
            var distance = response.rows[0].elements[0].distance.text
            var duration = response.rows[0].elements[0].duration.text
            $('#output').text('It will take you ' + duration + ' to travel ' + distance + ' from ' + origin.replace('+', ' ') + ' to ' + dest.replace('+', ' ') + '.')
            // See Parsing the Results for
            // the basics of a callback function.
          }
      });
    });



    $('#results-body').text(originLat);
  }); // end submit
}); //end function
