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

              matchingCities = matchingCities.concat(matchingCitiesInCountry);
            }
          }

          response(matchingCities);
        },
      });
    },
    minLength: 3, // Set the minimum number of characters required to trigger the autocomplete
    appendTo: "#autocompleteResults",
    select: function (event, ui) {},
    _renderItem: function (ul, item) {
      return $("<li>")
        .attr({ "data-value": item.value, class: "list-group-item" })
        .append(item.label)
        .appendTo(ul);
    }, // Replace with the ID or selector of the container where you want to append the suggestions list
  });
});
