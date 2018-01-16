const sort = {

  /**
   * @param {array<int>} unsortedList
   * @returns {array} the sorted array
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
    const sortedList = unsortedList;
    return sortedList;
  },

  /**
   * @param {array<int>} unsortedList
   * @returns {array} the sorted array
   */
  insertionSort: function(unsortedList) {

    // If unsortedList is an empty array or one item array it is returned
    if (unsortedList.length <= 1) {
      return unsortedList;
    }

    // Indexing starts on second list item
    for (var i = 1; i < unsortedList.length; i++) {
      // Create temporary variable to be inserted later
      var temp = unsortedList[i];
      // Second loop for checking values in sorted side
      for (var j = i - 1; j >= 0 && unsortedList[j] > temp; j--) {
        // Comparison from sorted side is shifted upwards one position
        unsortedList[j + 1] = unsortedList[j];
      }
      // Item from unsorted side (temp) is inserted in correct position in sorted side
      unsortedList[j + 1] = temp;
    }
    // For clarity of naming
    var sortedList = unsortedList;
    return sortedList;
  },

  /**
   * @param {array<int>} unsortedList
   * @param {int} *left most side of unsorted items
   * @param {int} *right most side of unsorted items
   * @returns {array<int>} the sorted array
   */
  quickSort: function(unsortedList, mostLeftOfArr = 0, mostRightOfArr = unsortedList.length-1) {

    // If unsortedList is an empty array or one item array it is returned
    if (unsortedList.length <= 1) {
      return unsortedList;
    }

    // Left and right boundaries of sorting (array items between are unsorted)
    var i = mostLeftOfArr;
    var j = mostRightOfArr;

    // For swapping later
    var temp;

    // Get midway point of array (rounded up)
    const midwayIndex = parseInt((mostLeftOfArr + mostRightOfArr) / 2, 10);

    // Get pivot value for comparisons
    const pivot = unsortedList[midwayIndex];

    // Until the pointers meet at same value
    while (i <= j) {
      // i is on left side, so values must be smaller than pivot, stops when array item is bigger than pivot
      while (unsortedList[i] < pivot) {
        // Increments through array items
        i++;
      }
      // j is on right side, so values must be larger than pivot, stops when array item is smaller than pivot
      while (unsortedList[j] > pivot) {
        // Decrements through array items
        j--;
      }

      // i and j must now be in wrong sides of array
      if (i <= j) {
        // i and j are swapped
        temp = unsortedList[i];
        unsortedList[i] = unsortedList[j];
        unsortedList[j] = temp;
        // Pointers moved inwards again for next swap check
        i++;
        j--;
      }
    }
    // Now the array has one side with items >= the pivot and one side with items <= the pivot

    // If there are items between the left side and j, they must also be sorted
    if (mostLeftOfArr < j) {
      sort.quickSort(unsortedList, mostLeftOfArr, j);
    }

    // If there are items between the right side and i, they must also be sorted
    if (i < mostRightOfArr) {
      sort.quickSort(unsortedList, i, mostRightOfArr);
    }

    // If partitions are 1 item long, they must be sorted so the list can be returned sorted
    // For clarity of naming
    const sortedList = unsortedList;
    return sortedList;
  }

}
