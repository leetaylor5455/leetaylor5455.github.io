var open = false;

$(document).ready(function() {

  // Nav links hover handle
  $('nav li:not(.btn-nav-toggle)').mouseenter(function(){
    clearTimeout($(this).data('timeoutId'));
    $(this).addClass('active-page', 200);
  }).mouseleave(function(){
    var someElement = $(this),
      timeoutId = setTimeout(function(){
        someElement.removeClass('active-page', 200);
      }, 300);
    // Set the timeoutId, allowing us to clear this trigger if the mouse comes back over
    someElement.data('timeoutId', timeoutId);
  });

  // Navbar fade in/out handle
  $(window).scroll(function() {
    if ($(this).scrollTop() > 150) {
      $('.navbar-fade').fadeIn();
    } else {
      $('.navbar-fade').fadeOut();
    }
  });

  // Mobile nav menu handle
  $('.btn-nav-toggle').click(function() {
    // Checks whether the mobile nav is open or closed to it can act accordingly
    if (open == true) {
      closeNav();
      setTimeout(function() {
        location.reload();
      }, 420);
      open = false;
    } else {
      openNav();
      open = true;
    }
  });

  $('section').click(function() {
    if (open == true) {
      closeNav();
      setTimeout(function() {
        location.reload();
      }, 420);
      open = false;
    }
  });

  $('.btn-nav-close').click(function() {
    closeNav();
    // Temporary fix for navbar-fade not working after return to page
    setTimeout(function() {
      location.reload();
    }, 420);
  });

  function openNav() {
    $('.overlay a').css('opacity', '0');
    $('#nav-overlay').fadeIn(300);
    $('#content').css({
      'transform': 'translateX(-75%)',
      '-webkit-transform': 'translateX(-75%)',
      'box-shadow': '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
    });
    setTimeout(function(){
      $('#content').addClass('return');
    }, 400);
    setTimeout(function() {
      $(".overlay a").each(function(i) {
        var $item = $(this)
        // Store the item around for use in the 'timeout' function
        setTimeout(function(){
          $item.css({
            'transform': 'translateX(0)',
            '-webkit-transform': 'translateX(0)',
            'opacity': '1'
          }, 100);
        }, 120*i);
      });
    }, 200);

  }

  function closeNav() {
    $('#content').removeClass('return');
    $('#content').css({
      'transform': 'translateX(0)',
      '-webkit-transform': 'translateX(0)',
      'box-shadow': 'none'
    });
    $('#nav-overlay').fadeOut(100);
    setTimeout(function() {
      $(".overlay a").css({
        'transform': 'translateX(10%)',
        '-webkit-transform': 'translateX(10%)'
      });
    }, 420);

    $('.btn-nav-toggle').show(0);
  }

  $('.overlay a').click(function (e) {
    closeNav();
    e.preventDefault();                   // Prevent default anchor behavior
    var goTo = this.getAttribute("href"); // Store anchor href
    setTimeout(function(){
         window.location = goTo;
    },350);
});

});
