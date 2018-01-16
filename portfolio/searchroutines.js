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

function linearSearch(list, target) {
  var len = list.length;
  for (var i=0; i < len-1; i++) { // Searches all elements
    if (list[i] == target) {      // If target is found at current list index
      return true;                // List index is returned
    }
    else if (i >= len-1) {        // If end of list is reached
      return false;               // False is returned
    }
  }
}

/*function binarySearch(list, left, right, target) {
  if (right - left <= 0 && list[left] != target) {
    return null;
    alert('not found');
  }
  var split = ((left + right) / 2).toFixed();       // Middle point between left and right
  if (list[split] > target) {                       // If this value is larger than target
    binarySearch(list, left, split-1, target);      // Right side of list is cut out of search
  } else if (list[split] < target) {                // If this value is smaller than target
    binarySearch(list, split+1, right, target);     // Left side of list is cut out of search
  } else {                                          // If this value is target
    return split;                                   // Index is returned
    alert(split);
  }
}*/

/*function binarySearch(list, target) {
  // This defines the index of the list (rounding up); for example, it will be the 3rd of a 5 item list
  var middleIndex = parseInt(((list.length) / 2).toFixed(), 10);    // Middle point between left and right
  //console.log('Split: ', split);
  //console.log('Split value: ', list[split]);
  console.log('Array: ', list);
  if (list[middleIndex] > target) {
    console.log('Left side: ', list.splice(0, middleIndex+1));        // If this value is larger than target
    if (binarySearch(list.splice(0, middleIndex+1), target) === true) {
      // found it!
      return true;
    }

  } else if (list[middleIndex] < target) {                          // If this value is smaller than target
    console.log('Right side: ', list.splice(middleIndex));
    if (binarySearch(list.splice(middleIndex), target) === true) {
      // found it!
      return true;
    }
    console.log('Right side: ', list);
  } else {
    if (list[middleIndex] === target) {
      return true;
    }
    console.log('NOT FOUND');
  }

  return false;
}*/

/*function binarySearch(list, target) {

  var middleIndex = parseInt((list.length / 2).toFixed(), 10);       // Middle point between left and right
  console.log('Array: ', list);
  console.log('middleIndex', middleIndex, '(', list[middleIndex], ')');
  if (list.length === 1 && list[0] != target) {
    console.log('NOT FOUND!');
    return false;
  } else {
    if (list[middleIndex] > target) {                       // If this value is larger than target
      list = list.splice(0, middleIndex);
      console.log('New Array = left side: ', list);
      binarySearch(list, target);      // Right side of list is cut out of search
    }
    else if (list[middleIndex] < target) {
      list = list.splice(middleIndex);                // If this value is smaller than target
      console.log('New Array = right side: ', list);
      binarySearch(list, target);     // Left side of list is cut out of search
    }
    else if (list[middleIndex] == target) {                                          // If this value is target
      console.log('FOUND!');
      return true;                                 // Index is returned
    }
  }
}*/

function binarySearch(list, left, right, target) {
  console.log('Left:', left, 'Right:', right);
  if (right <= left && list[left] != target) {
    console.log('NOT FOUND!');
    return false;                                         // Found = false
  }
  var middleIndex = parseInt(((left + right) / 2).toFixed(), 10);       // Middle point between left and right
  console.log('Middle Index: ', middleIndex, '(', list[middleIndex], ')');
  if (list[middleIndex] > target) {                       // If this value is larger than target
    console.log('Not in right side: ', list);
    return binarySearch(list, left, middleIndex-1, target);      // Right side of list is cut out of search
  } else if (list[middleIndex] < target) {                // If this value is smaller than target
    console.log('Not in left side: ', list);
    return binarySearch(list, middleIndex+1, right, target);     // Left side of list is cut out of search
  } else {                                                // If this value is target
    console.log('FOUND!');
    return true;                                          // Found = true
  }
}


function blah2(target) {
  var foundIt = binarySearch([1, 2, 4, 6, 9, 10, 56], 0, 6, target);

  console.log('### found it? ', foundIt);
}

function parseIntArray(list) {
  for (var i = 0; i < list.length; i++) {
    list[i] = parseInt(list[i]);
  }
}

$(document).ready(function() {
  $('input[type=radio]').change(function() {
    if ($('input:checked').val() == 'linearSearch') {
      $('#sortingMethod').text('None');
      $('#btnGenSearch').val('Generate and Search');
    } else {
      $('#sortingMethod').text('Quicksort');
      $('#btnGenSearch').val('Generate, Sort and Search');
    }
  });

  $('#btnSearch').click(function() {
    var target = $('#targetInput').val();
    var unsplitListInput = $('#arrayInputSearch').val();
    var listInput = unsplitListInput.split(/[\s,]+/);
    parseIntArray(listInput);
    if ($('input:checked').val() == 'linearSearch') {
      referToSearch(target, 'linear', listInput);
    } else {
      referToSearch(target, 'binary', listInput);
    }
  });

  $('#btnGenSearch').click(function() {
    var listGenLength = $('#genArraySizeInputSearch').val();
    generateSampleArray(listGenLength);
  });

  function generateSampleArray(size) {
    var target = $('#targetInput').val();
    var listGen = [];
    for (var i = 0; i <= size-1; i++) {
      listGen.push(Math.floor((Math.random() * 10) + 1));
    }
    if ($('input:checked').val() == 'linearSearch') {
      console.log('Linear referred')
      referToSearch(target, 'linear', listGen);
    } else {
      console.log('Binary referred')
      referToSearch(target, 'binary', quickSort(listGen, 0, listGen.length-1));
    }
  }

  function referToSearch(target, method, list) {
    if (list.length <= 1 && list[0] != target) {
      output(list, 'Not found', target, 'No procedure called');
      return;
    } else if (list.length <= 1 && list[0] == target) {
      output(list, 1, target, 'No procedure called');
      return;
    }
    var t0 = performance.now();
    if (method == 'binary') {
      console.log('Binary Search Called')
      var found = binarySearch(quickSort(list, 0, list.length-1), 0, list.length-1, target);
    } else {
      console.log('Linear Search Called')
      var found = linearSearch(list, target);
    }
    var t1 = performance.now();
    var timeTaken = (t1 - t0).toFixed(4) + 'ms';
    output(list, found, target, timeTaken);
  }

  function output(list, found, target, timeTaken) {
    $('#finalList').text(list);
    $('#found').text(found);
    $('#target').text(target);
    $('#timeCompleted').text(timeTaken);
  };

});
