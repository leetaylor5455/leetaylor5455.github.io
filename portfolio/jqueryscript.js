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
  // $(window).scroll(function() {
  //   if ($(this).scrollTop() > 150) {
  //     $('.navbar-fade').fadeIn();
  //   } else {
  //     $('.navbar-fade').fadeOut();
  //   }
  // });

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

  $(document).ready(function() {

    function bubbleSort(list) {
      var len = list.length;
      var swapped;
      do {
        swapped = false;                 // To break the 'do while' when all passes have finished
        for (var i=0; i < len-1; i++) {  // For loop runs a pass for each item in the list
          if (list[i] > list[i+1]) {
            var temp = list[i];          // Temporary variable must be created for swap function
            list[i] = list[i+1];
            list[i+1] = temp;
            swapped = true;              // To indicate there can been a swap
          }
        }
      } while (swapped);                 // Loop runs until all passes are complete
      return list;
    }


    function insertionSort(list) {
      var len = list.length;
      for (var i=1; i < len; i++) {     // Indexing starts on second list item
        var temp = list[i];             // Create temporary variable to be inserted later
        for (var j=i-1; j >= 0 && list[j] > temp; j--) {
          list[j+1] = list[j];          // If temp is smaller than comparison, comparison value shifted
        }                               // Loop exits when temp is larger or reached the back
        list[j+1] = temp;               // temp value inserted
      }
      return list;
    }

    function quickSort(list) {
      var len = list.length;
      if (len <= 1) {
        return list;                    // List is returned if there is 1 or less items
      }
      var pivot = list[0];              // Pivot is selected as first item
      var left = [];
      var right = [];                   // Left right values defined
      for (var i=1; i < len; i++) {
        if (list[i] < pivot) {
          left.push(list[i]);
        } else {
          right.push(list[i]);
        }
      }                                 // Values are pushed either side of the pivot depending on size
      return quickSort(left).concat(pivot, quickSort(right));
    };                                  // Concatenates values back together

    $('.try-it').click(function() {
      array = split.arrayInput.val();

    });

    function calculate(callback, input) {
      var list = input.split(",");
      alert('Sorted list: ' + callback(list));
    }

    $('form').submit(function() {
      calculate($(this).arrayInput, $(this).attr('data-function'));
    });

  });

  // var list = [7, 2, 9, 1, 3];
  //
  // alert(quickSort(list));


});
