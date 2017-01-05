var vehicleApi = require('./../.env').vehicleApi;
var googleApi = require('./../.env').googleApi;
var GoogleDrive = require('./../js/googleDrive.js').driveModule;
var map;
var honda = ["accord", "accord-crosstour", "accord-hybrid", "accord-plug-in-hybrid", "cr-v", "cr-z", "civic", "civic-crx", "civic-del-sol", "clarity", "crosstour", "element", "fit", "fit-ev", "hr-v", "insight", "odyssey", "passport", "pilot", "prelude", "ridgeline", "s2000"];


var toyota = ["4runner", "86", "avalon", "avalon-hybrid", "c-hr", "camry", "camry-hybrid", "camry-solara", "celica", "corolla", "corolla-im", "cressida", "echo", "fj-cruiser", "highlander", "highlander-hybrid", "land-cruiser", "mr2", "mr2-spyder", "matrix", "mirai", "paseo", "pickup", "previa", "prius", "prius-plug-in", "prius-prime", "prius-c", "prius-v", "rav4", "rav4-ev", "rav4-hybrid", "sequoia", "sienna", "supra", "t100", "tacoma", "tercel", "tundra", "venza", "yaris", "yaris-ia"];

var ford = ["aerostar", "aspire", "bronco", "bronco-ii", "c-max-energi", "c-max-hybrid", "contour", "contour-svt", "crown-victoria", "e-150", "e-250", "e-350", "e-series-van", "e-series-wagon", "econoline-cargo", "econoline-wagon", "edge", "escape", "escape-hybrid", "escort", "excursion", "expedition", "expedition-el", "explorer", "explorer-sport", "explorer-sport-trac", "f-150", "f-150-heritage", "f-150-svt-lightning", "f-250", "f-250-super-duty", "f-350", "f-350-super-duty", "f-450-super-duty", "festiva", "fiesta", "five-hundred", "flex", "focus", "focus-rs", "focus-st", "freestar", "freestyle", "fusion", "fusion-energi", "fusion-hybrid", "gt", "ltd-crown-victoria", "mustang", "mustang-svt-cobra", "probe", "ranger", "shelby-gt350", "shelby-gt500", "taurus", "taurus-x", "tempo", "thunderbird", "transit-connect", "transit-van", "transit-wagon", "windstar", "windstar-cargo"];

var audi = ["100", "200", "80", "90", "a3", "a3-sportback-e-tron", "a4", "a4-allroad", "a5", "a6", "a7", "a8", "cabriolet", "coupe", "q3", "q5", "q7", "q7-e-tron", "r8", "rs-4", "rs-5", "rs-6", "rs-7", "s3", "s4", "s5", "s6", "s7", "s8", "sq5", "tt", "tt-rs", "tts", "v8", "allroad", "allroad-quattro"];

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


  $make = $("select[name='make']");
  $model = $("select[name='model']");

  $make.change(function() {
      $("select[name='model'] option").remove();
      $("<option value='' disabled selected>Select Model</option>").appendTo($model);
      $.each(eval($(this).val()), function(index, value) {
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
      newDrive.mpg = parseInt(data.powertrain.substring(data.powertrain.match(/mpg/).index-3,data.powertrain.match(/mpg/).index-1));
      $('#test').html(parseInt(data.powertrain.substring(data.powertrain.match(/mpg/).index-3,data.powertrain.match(/mpg/).index-1)));
      // debugger;
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



    $('#results-body').text(originLat);
  }); // end submit
}); //end function
