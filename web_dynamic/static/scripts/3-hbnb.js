const HOST = '127.0.0.1';
$(document).ready(function () {
  const amenityDict = {};
  $('.amenities .popover input').change(function () {
    if ($(this).is(':checked')) {
      amenityDict[$(this).attr('data-name')] = $(this).attr('data-id');
    } else if ($(this).is(':not(:checked)')) {
      delete amenityDict[$(this).attr('data-name')];
    }
    const amenKeys = Object.keys(amenityDict);
    $('.amenities h4').text(amenKeys.sort().join(', '));
  });
  apiStat();
  placeSearch();
});

function placeSearch () {
  const placeURL = `http://${HOST}:5001/api/v1/places_search/`;
  $.ajax({
    url: placeURL,
    type: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({}),
    success: function (res) {
      for (const r of res) {
        const article = `<article>
          <div class="title_box">
            <h2>${r.name}</h2>
            <div class="price_by_night">$${r.price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest">${r.max_guest} Guest(s)</div>
            <div class="number_rooms">${r.number_rooms} Bedroom(s)</div>
            <div class="number_bathrooms">${r.number_bathrooms} Bathroom(s)</div>
          </div>
          <div class="description">${r.description}</div>
        </article>`;
        $('section.places').append(article);
      }
    },
    error: function (err) {
      console.log(err);
    }
  });
}

function apiStat () {
  const API_URL = `http://${HOST}:5001/api/v1/status/`;
  $.get(API_URL, (data, textStatus) => {
    if (textStatus === 'success' && data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });
}
