var vehicleApi = require('./../.env').vehicleApi;
var googleApi = require('./../.env').googleApi;
var GoogleDrive = require('./../js/googleDrive.js').driveModule;
var map;

window.initMap = function() {
      var myLatLng = {lat: 45.072350, lng: -122.401209};
      directionsService = new google.maps.DirectionsService();
      var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 7,
          center: myLatLng
      });
      directionsDisplay = new google.maps.DirectionsRenderer();
      directionsDisplay.setMap(map);

  };
  function calculateAndDisplayRoute(directionsService, directionsDisplay, or, dest) {
      directionsService.route({
          origin: or,
          destination: dest,
          travelMode: google.maps.TravelMode.DRIVING
      }, function (response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(response);
          } else {
              window.alert('Directions request failed due to ' + status);
          }
      });
  }

$(function() {
 $('select').material_select();
 var originLat;
 var originLong;
 var destLat;
 var destLong;
 // const GASPRICE = 2.342;
  $('#mpg').submit(function(event) {
    event.preventDefault();
    var newDrive = new GoogleDrive();
    var make = $('#make').val();
    var model = $('#model').val();
    var year = $('#year').val();
    var origin = $('input#origin').val().replace(' ', '+').replace(',', '');
    var dest = $('input#destination').val().replace(' ', '+').replace(',', '');
    $.get('https://api.edmunds.com/api/editorial/v2/' + make + '/' + model + '/' + year + '?view=basic&fmt=json&api_key=' + vehicleApi, function(response) {
      mpg = parseInt(response.powertrain.substring(response.powertrain.match(/mpg/).index-3,response.powertrain.match(/mpg/).index-1));
      newDrive.mpg = mpg;

    });
    $.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + origin + '&key=AIzaSyBfTldJELwTqc1w6_stwnFXgQPq5qgw2E8').then(function(originResponse) {
      originLat = originResponse.results[0].geometry.viewport.southwest.lat;
      originLong = originResponse.results[0].geometry.viewport.southwest.lng;
      $.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + dest + '&key=AIzaSyBfTldJELwTqc1w6_stwnFXgQPq5qgw2E8').then(function(destResponse) {
        destLat = destResponse.results[0].geometry.viewport.southwest.lat;
        destLong = destResponse.results[0].geometry.viewport.southwest.lng;
        origin2 = new google.maps.LatLng(originLat, originLong);
        destination2 = new google.maps.LatLng(destLat, destLong);

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
            var distance = response.rows[0].elements[0].distance.text;
            var dist = parseFloat(response.rows[0].elements[0].distance.text.slice(0, -3));
            var duration = response.rows[0].elements[0].duration.text;
            newDrive.dist = dist;
            $('#output').text('It will take you ' + duration + ' to travel ' + distance + ' from ' + origin.replace('+', ' ') + ' to ' + dest.replace('+', ' ') + ' in your ' + year + ' ' + make + ' ' + model + '. Your trip will cost you ' + newDrive.getCost());
            debugger;
            calculateAndDisplayRoute(directionsService, directionsDisplay, $('input#origin').val(), $('input#destination').val());
            // $('#results-body').text('The mpg for the ' + year + ' ' + make + ' ' + model + ' is ' + newResponse + '.');
            // See Parsing the Results for
            // the basics of a callback function.
          }
      });
    });



    $('#results-body').text(originLat);
  }); // end submit
}); //end function
