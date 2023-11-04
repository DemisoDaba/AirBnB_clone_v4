const HOST = '0.0.0.0';
$(document).ready(function () {
  const amenities = {};
  $("input[type='checkbox']").on('change', function () {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');
    if ($(this).prop('checked')) {
      amenities[amenityId] = amenityName;
    } else {
      delete amenities[amenityId];
    }
    const amenityNames = Object.values(amenities);
    const amenityText = amenityNames.join(', ');
    $('div.amenities H4').text(amenityText);
  });
  apiStat();
});

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
