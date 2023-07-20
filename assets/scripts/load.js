//function to autocomplete cities

$(document).ready(function () {
  $("#cityInput").autocomplete({
    source: function (request, response) {
      $.ajax({
        url: "https://raw.githubusercontent.com/russ666/all-countries-and-cities-json/master/countries.json",
        dataType: "json",
        success: function (data) {
          var term = request.term.toLowerCase();
          var matchingCities = [];

          for (var country in data) {
            if (data.hasOwnProperty(country)) {
              var cities = data[country];
              var matchingCitiesInCountry = cities.filter(function (city) {
                return city.toLowerCase().startsWith(term);
              });

              var formattedCities = matchingCitiesInCountry.map(function (city) {
                return {
                  label: city + ", " + country,
                  value: city,
                };
              });
              matchingCities = matchingCities.concat(formattedCities);
            }
          }

          response(matchingCities);
        },
      });
    },
    minLength: 3, // Set the minimum number of characters required to trigger the autocomplete
    appendTo: "#autocompleteResults",
    select: function (event, ui) {
      $("#cityInput").val(ui.item.value);
      return false;
    },
    _renderItem: function (ul, item) {
      return $("<li>")
        .attr({ "data-value": item.value, class: "list-group-item" })
        .append(item.label)
        .appendTo(ul);
    },
  });
});
