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
});
