$(document).ready(function() {

  $('.content').on('click', 'h3', function() {
    $(this).toggleClass('strikethrough');
  });



  var exerciseData = {};

  var todayFullDate = new Date();
  var todayDay = String(todayFullDate).substring(0, 3);
  var tomorrowFullDate = new Date(new Date().getTime() + (24 * 60 * 60 * 1000));
  var tomorrowDay = String(tomorrowFullDate).substring(0, 3);

  $.get('js/json/days.json', function(data) {
    exerciseData = data;
  }).then(function() {

    function populateHTML(id, day) {
      jqueryId = '#' + id;
      $(jqueryId).find('.exercise').text(exerciseData[day].exercise);

      var $exercises = $(jqueryId).find('.exercises');

      if (exerciseData[day].exercises.length > 0) {
        for (var i = 0; i <= exerciseData[day].exercises.length - 1; i++) {

          var exerciseTitle = document.createElement('h3');
          exerciseTitle.appendChild(document.createTextNode(exerciseData[day].exercises[i][0]));

          var exerciseContent = document.createElement('li');
          exerciseContent.appendChild(document.createTextNode(exerciseData[day].exercises[i][1]));

          $exercises[0].appendChild(exerciseTitle);
          $exercises[0].appendChild(exerciseContent);
        }
      }


    }

    populateHTML('today', todayDay);
    populateHTML('tomorrow', tomorrowDay);

  });

});
