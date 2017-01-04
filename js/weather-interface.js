var apiKey = require('./../.env').apiKey;

$(function() {
   $('select').material_select();
    $('#car-select').submit(function(event) {
      event.preventDefault();
      var make = $('#make').val();
      var model = $('#model').val();
      var year = $('#year').val();
      $('#location').val("");
      $.get('https://api.edmunds.com/api/editorial/v2/' + make + '/' + model + '/' + year + '?view=basic&fmt=json&api_key=' + apiKey, function(response) {
        newResponse = parseInt(response.powertrain.substring(response.powertrain.match(/mpg/).index-3,response.powertrain.match(/mpg/).index-1));
      $('#results-body').text('The mpg for the ' + year + ' ' + make + ' ' + model + ' is ' + newResponse + '.');
    });
  });
});
