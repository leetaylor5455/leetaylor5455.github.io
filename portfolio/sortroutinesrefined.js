const sort = {

  /**
   * @param {array<int>}
   * @returns {array}
   */
  bubbleSort: function(unsortedList) {

    // If unsortedList is an empty array or one item array it is returned
    if (unsortedList.length <= 1) {
      return unsortedList;
    }

    // Declare variable before looping
    var swapped;
    do {
      // To break the do loop after all swaps have been completed
      swapped = false;
      // Runs a pass for each item in the list
      for (var i = 0; i < unsortedList.length - 1; i++) {
        if (unsortedList[i] > unsortedList[i + 1]) {
          // Swap function
          var temp = unsortedList[i];
          unsortedList[i] = unsortedList[i + 1];
          unsortedList[i + 1] = temp;
          // To remain in the do loop
          swapped = true;
        }
      }
    // Exits when last swap is complete
    } while (swapped);
    // For clarity of naming
    var sortedList = unsortedList;
    return sortedList;
  }

  /**
   * @param {array<int>}
   * @returns {array}
   */
  insertionSort: function(unsortedList) {

    // If unsortedList is an empty array or one item array it is returned
    if (unsortedList.length <= 1) {
      return unsortedList;
    }

    // Indexing starts on second list item
    for (var i=1; i < unsortedList.length; i++) {
      // Create temporary variable to be inserted later
      var temp = list[i];
      // Second loop for checking values in sorted side
      for (var j=i-1; j >= 0 && list[j] > temp; j--) {
        list[j+1] = list[j];
      }
      list[j+1] = temp;
    }
    return list;
  }

  }

}
