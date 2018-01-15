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
      return i;                   // List index is returned
    }
    else if (i >= len-1) {        // If end of list is reached
      return null;                // Null is returned
    }
  }
}

function binarySearch(list, left, right, target) {
  var split = ((right - left) / 2).toFixed();       // Middle point between left and right
  if (list[split] > target) {                       // If this value is larger than target
    binarySearch(list, left, list[split], target);  // Right side of list is cut out of search
  } else if (list[split] < target) {                // If this value is smaller than target
    binarySearch(list, list[split], right, target); // Left side of list is cut out of search
  } else {                                          // If this value is target
    return split;                                   // Index is returned
  }
}
