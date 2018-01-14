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

  $('#btnGen').click(function() {
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
    // quickSort(listGen, 0, listGen.length-1);
    // $('#sortedList').text(listGen);
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
