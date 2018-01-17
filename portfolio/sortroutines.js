$(document).ready(function() {

  function bubbleSort(list) {
    let len = list.length;
    let swapped;
    do {                               // Runs until there are no more swaps necessary
      swapped = false;                 // To exit to do loop when code after if statement isn't run
      for (var i=0; i < len; i++) {    // Runs check for each item in list
        if (list[i] > list[i+1]) {
          var temp = list[i];          // Temporary variable must be created for swap function
          list[i] = list[i+1];
          list[i+1] = temp;
          swapped = true;              // Remain in the do loop
        }                              // If no swap occurs, all items must be sorted
      }
      len--;                           // Items at end will be sorted so no need to check them
    } while (swapped);
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

  /*function quickSort(list) {
    var len = list.length;
    if (len <= 1) {
      return list;                    // List is returned if there is 1 or less items
    }
    var pivot = list[Math.floor(Math.random() * len)];
    var left = [];                    // Pivot selected as random item
    var right = [];                   // Empty lists for left and right
    for (var i=1; i < len; i++) {
      if (list[i] < pivot) {          // If selected item is less than pivot
        left.push(list[i]);           // Item is placed in left list
      } else {
        right.push(list[i]);          // Else, item is placed in right hand list
      }
    }                                 // Left and right lists are pushed back either side
    return quickSort(left).concat(pivot, quickSort(right));
  }; */                               // Recursion

  function  quickSort(list, left, right) {
  	var i = left;
  	var j = right;                   // Pointers for either side of the list created
  	var temp;                        // For swapping later
  	median = (left + right) / 2;     // Selecting a median and creating the pivot
  	var pivot = list[median.toFixed()];
  	while (i <= j) {                 // Until the pointers 'collide'
  		while (list[i] < pivot) {
        i++;
      }
  		while (list[j] > pivot) {      // Pointers iterate towards middle until incorrect sort found
        j--;
      }
  		if (i <= j) {                  // Values should both be on incorrect sides of the pivot at this point
  			temp = list[i];              // Therefore, they are swapped
  			list[i] = list[j];
  			list[j] = temp;
  			i++;
  			j--;                         // Pointers continue to iterate
  		}
  	}

  	if (left < j) {
      quickSort(list, left, j);      // Recursion called on new unsorted partitions
    }
  	if (i < right) {
  		quickSort(list, i, right);
    }
  	return list;
  }

  $('#btnSort').click(function() {
    var unsplitListInput = $('#arrayInput').val();
    var listInput = unsplitListInput.split(/[\s,]+/);
    referToSort(listInput);
  });

  $('#btnGenSort').click(function() {
    var listGenLength = $('#genArraySizeInput').val();
    generateSampleArray(listGenLength);
  });

  function referToSort(list) {
    $('#unsortedList').text(list);
    var functionCall = $("input[type=radio][name=sort]:checked").val();
    if (functionCall == 'bubbleSort') {
      calculate(list, bubbleSort, 'Bubble Sort');
    } else if (functionCall == 'insertionSort') {
      calculate(list, insertionSort, 'Insertion Sort');
    } else if (functionCall == 'quickSort') {
      calculate(list, quickSort, 'Quicksort');
    } else {
      alert('Invalid Choice, try again')
    }
  }

  function generateSampleArray(size) {
    var listGen = [];
    for (var i = 0; i <= size-1; i++) {
      listGen.push(Math.floor((Math.random() * 10) + 1));
    }
    referToSort(listGen);
  }

  function calculate(input, callback, method) {
    var unsorted = input;
    var t0 = performance.now();
    if (method == 'Quicksort') {
      var sorted = callback(input, 0, input.length-1);
    } else {
      var sorted = callback(input);
    }
    var t1 = performance.now();
    var timeTaken = (t1 - t0).toFixed(4) + 'ms'
    output(method, unsorted, sorted, timeTaken);
  };

  function output(method, unsorted, sorted, timeTaken) {
    $('#sortingMethod').text(method);
    $('#sortedList').text(sorted);
    $('#timeCompleted').text(timeTaken);
  };

});
