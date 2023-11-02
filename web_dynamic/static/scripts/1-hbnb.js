const checkedAmenities = {};

$(document).ready(function () {
  $('.amenities input[type="checkbox"]').on('change', function () {
    if ($(this).is(':checked')) {
      checkedAmenities[this.getAttribute('data-id')] = this.getAttribute('data-name');
    } else {
      delete checkedAmenities[this.getAttribute('data-id')];
    }
    $('.amenities h4').text(Object.values(checkedAmenities).join(', '));
  });
});