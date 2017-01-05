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

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
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
    newDrive.make = make;
    newDrive.model = model;
    newDrive.year = year;
    newDrive.origin = origin;
    newDrive.destination = dest;
    $.get('https://api.edmunds.com/api/editorial/v2/' + make + '/' + model + '/' + year + '?view=basic&fmt=json&api_key=9v6dagdj489rd4x5mwkm7mwq').then(function(data) {
      newDrive.mpg = parseInt(data.powertrain.substring(data.powertrain.match(/mpg/).index-3,data.powertrain.match(/mpg/).index-1));
      $('#test').html(parseInt(data.powertrain.substring(data.powertrain.match(/mpg/).index-3,data.powertrain.match(/mpg/).index-1)));
      // debugger;
      $('#output').text('It will take you ' + newDrive.time + ' to travel ' + newDrive.dist.toFixed(2) + ' miles from ' + toTitleCase(origin.replace('+', ' ')) + ' to ' + toTitleCase(dest.replace('+', ' ')) + ' in your ' + newDrive.year + ' ' + newDrive.make + ' ' + toTitleCase(newDrive.model) + '. Your trip will cost you $' + newDrive.getCost().toFixed(2) + "in gas");
      calculateAndDisplayRoute(directionsService, directionsDisplay, $('input#origin').val(), $('input#destination').val());

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
            if (status =="OK"){
              var distance = response.rows[0].elements[0].distance.text;
              var dist = parseFloat(response.rows[0].elements[0].distance.text.slice(0, -3).replace(",",""));
              var duration = response.rows[0].elements[0].duration.text;
              newDrive.dist = dist/ 1.609344;
              newDrive.time = duration;

            }

          }
      });
    });



    $('#results-body').text(originLat);
  }); // end submit
}); //end function
