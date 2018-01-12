

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
    list[i] < pivot ? left.push(list[i]) : right.push(list[i]);
  }                                 // Values are pushed either side of the pivot depending on size
  return quickSort(left).concat(pivot, quickSort(right));
};                                  // Concatenates values back together

var list = [7, 2, 9, 1, 3];

insertionSort(list);
console.log(list);
