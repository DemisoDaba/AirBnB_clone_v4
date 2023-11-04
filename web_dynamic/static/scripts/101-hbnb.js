const link = "http://" + window.location.hostname;

$(document).ready(function () {
  let checkedAmenities = {};
  $(document).on('change', ".amenities li input[type='checkbox']", function () {
    if (this.checked) {
      checkedAmenities[$(this).data('id')] = $(this).data('name');
    } else {
      delete checkedAmenities[$(this).data('id')];
    }
    let lst = Object.values(checkedAmenities);
    if (lst.length > 0) {
      $('div.amenities > h4').text(Object.values(checkedAmenities).join(', '));
    } else {
      $('div.amenities > h4').html('&nbsp;');
    }
  });

  //states checkbox handling
  let checkedStates = {};
  $(document).on('change', ".locations li input[type='checkbox']:first", function () {
    if (this.checked) {
      checkedStates[$(this).data('id')] = $(this).data('name');
    } else {
      delete checkedStates[$(this).data('id')];
    }
    let statelist = Object.values(checkedStates);
    if (statelist.length > 0) {
      $('div.locations > h4').text(Object.values(checkedStates).join(', '));
    } else {
      $('div.locations > h4').html('&nbsp;');
    }
  });

  //cities checkbox handling
  let checkedCities = {};
  $(document).on('change', ".locations li input[type='checkbox']:eq(1)", function () {
    if (this.checked) {
      checkedCities[$(this).data('id')] = $(this).data('name');
    } else {
      delete checkedCities[$(this).data('id')];
    }
    let citylist = Object.values(checkedCities);
    if (citylist.length > 0) {
      $('div.locations > h4').text(Object.values(checkedCities).join(', '));
    } else {
      $('div.locations > h4').html('&nbsp;');
    }
  });

  $(function () {
    const apiUrl = link + ":5001/api/v1/status/";
    $.get(apiUrl, function (data, status) {
      if (data.status === "OK" && status === "success") {
        $("#api_status").addClass("available");
      } else {
        $("#api_status").removeClass("available");
      }
    });
  });

  // fetch places
  $.ajax({
    url: link + ":5001/api/v1/places_search/",
    method: "POST",
    data: "{}",
    contentType: "application/json",
    dataType: "json",
    success: fillPlaces,
  });
  //handle the search button
  $("BUTTON").click(() => {
    $("SECTION.places").empty();
    $.ajax({
      url: link + ":5001/api/v1/places_search/",
      method: "POST",
      data: JSON.stringify({
        'amenities': Object.keys(checkedAmenities),
        'states': Object.keys(checkedStates),
        'cities': Object.keys(checkedCities)
      }),
      contentType: "application/json",
      dataType: "json",
      success: fillPlaces,
    });
  });
});

function fillPlaces(data) {
  $("SECTION.places").append(data.map(place => {
    return `
          <article>
<h2>${place.name}</h2>
<div class="price_by_night">
<p>${place.price_by_night}</p>
</div>
<div class="information">
<div class="max_guest">
<div class="guest_image"></div>
<p>${place.max_guest}</p>
</div>
<div class="number_rooms">
<div class="bed_image"></div>
<p>${place.number_rooms}</p>
</div>
<div class="number_bathrooms">
<div class="bath_image"></div>
<p>${place.number_bathrooms}</p>
</div>
</div>
<div class="user">
</div>
<div class="description">
<p>${place.description}</p>
</div>
<div class="reviews"><h2>
          <span id="${place.id}n" class="treview">Reviews</span>
          <span id="${place.id}" onclick="show_reviews(this)" class="revBtn">Show</span></h2>
          <ul id="${place.id}r"></ul>
          </div>
</article>`
  }))
};

// display place's reviews
function show_reviews(element) {
  if (element === undefined) {
    return;
  }
  if (element.textContent === 'Show') {
    element.textContent = 'Hide';
    $.get(`${link}:5001/api/v1/places/${element.id}/reviews`, (data, textStatus) => {
      if (textStatus === 'success') {
        $(`#${element.id}n`).html(data.length + ' Reviews');
        for (const review of data) {
          print_review(review, element);
        }
      }
    });
  } else {
    element.textContent = 'Show';
    $(`#${element.id}n`).html('Reviews');
    $(`#${element.id}r`).empty();
  }
}

// print place's reviews
function print_review(review, element) {
  const date = new Date(review.created_at);
  const month = date.toLocaleString('en', { month: 'long' });
  const day = Ordinal(date.getDate());

  if (review.user_id) {
    $.get(`${link}:5001/api/v1/users/${review.user_id}`, (data, textStatus) => {
      if (textStatus === 'success') {
        $(`#${element.id}r`).append(
          `<li>
            <h3>
              From ${data.first_name} ${data.last_name} the ${day + ' ' + month + ' ' + date.getFullYear()}
            </h3>
            <p>${review.text}</p>
          </li>`);
      }
    });
  }
}
function Ordinal(date) {
  if (date === 31 || date === 21 || date === 1)
    return date + 'st';
  else if (date === 22 || date === 2)
    return date + 'nd';
  else if (date === 23 || date === 3)
    return date + 'rd';
  else
    return date + 'th';
}
