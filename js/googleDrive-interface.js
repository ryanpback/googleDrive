var vehicleApi = require('./../.env').vehicleApi;
var googleApi = require('./../.env').googleApi;
var GoogleDrive = require('./../js/googleDrive.js').driveModule;
// OAuth.initialize('GT6-nudPxa2C0KhPDe_9TRE4zmg');
var map;


window.initMap = function() {
      var myLatLng = {lat: 45.072350, lng: -122.401209};
      directionsService = new google.maps.DirectionsService();
      var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 7,
          minZoom: 3,
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
//   OAuth.popup('github').done(function(results) {
//     var token = results.access_token;
//     $.ajax({
//       type: 'GET',
//       url: 'https://api.github.com/?access_token='+token
//       }).done(function(response) {
//         debugger;
//         console.log(response);
//     });
//     // $.get('https://api.github.com/users?' + token).then(function(response){
//     //   newDrive.userName = response.login;
//     // });
// }).fail(function(err) {
//   //todo when the OAuth flow failed
// });

  var originLat;
  var originLong;
  var destLat;
  var destLong;
  $make = $("select[name='make']");
  $model = $("select[name='model']");

  // $("<option value='' disabled selected>Select Model</option>").appendTo($make);
  $.each(makes, function (index, value){
    $("<option>" + value + "</option>").appendTo($make)
  });
  $('select').material_select();

  $.each(acura, function(index, value) {
    $("<option>" + value + "</option>").appendTo($model)
  });
  $('select').material_select();


  $make.change(function() {
      $("select[name='model'] option").remove();
      // $("<option value='' disabled selected>Select Model</option> required").appendTo($model);
      $.each(eval($(this).val().toLowerCase()), function(index, value) {
        $("<option>" + value + "</option>").appendTo($model)
      });
      $('select').material_select();
  });


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
    $.get('https://api.edmunds.com/api/editorial/v2/' + make + '/' + model + '/' + year + '?view=basic&fmt=json&api_key=' + vehicleApi).then(function(data) {
      newDrive.mpg = parseInt(data.powertrain.substring(data.powertrain.match(/mpg/).index-4,data.powertrain.match(/mpg/).index-1));
      $('#output').text('It will take you ' + newDrive.time + ' to travel ' + newDrive.dist.toFixed(2) + ' miles from ' + toTitleCase(origin.replace('+', ' ')) + ' to ' + toTitleCase(dest.replace('+', ' ')) + ' in your ' + newDrive.year + ' ' + newDrive.make + ' ' + toTitleCase(newDrive.model) + '. Your trip will cost you $' + newDrive.getCost().toFixed(2) + " in gas");
      calculateAndDisplayRoute(directionsService, directionsDisplay, $('input#origin').val(), $('input#destination').val());
    });
    $.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + origin + '&key=' + googleApi).then(function(originResponse) {
      originLat = originResponse.results[0].geometry.viewport.southwest.lat;
      originLong = originResponse.results[0].geometry.viewport.southwest.lng;
      $.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + dest + '&key=' + googleApi).then(function(destResponse) {
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
            // debugger;
              var distance = response.rows[0].elements[0].distance.text;
              var dist = parseFloat(response.rows[0].elements[0].distance.text.slice(0, -3).replace(",",""));
              var duration = response.rows[0].elements[0].duration.text;
              newDrive.dist = dist/ 1.609344;
              newDrive.time = duration;
          }
      });
    });


  }); // end submit
}); //end function
