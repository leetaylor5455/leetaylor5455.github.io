const sort = {

  /**
   * @param {array<int>} unsortedList
   * @returns {array<int>} the sorted array
   */
  bubbleSort: function(unsortedList) {

    // If unsortedList is an empty array or one item array it is returned
    if (unsortedList.length <= 1) {
      return unsortedList;
    }
    // Runs a pass for each item in the list
    for (var i = 0; i < unsortedList.length - 1; i++) {
      if (unsortedList[i] > unsortedList[i + 1]) {
        // Swap function
        var temp = unsortedList[i];
        unsortedList[i] = unsortedList[i + 1];
        unsortedList[i + 1] = temp;
      }
    }
    // For clarity of naming
    const sortedList = unsortedList;
    return sortedList;
  },

  /**
   * @param {array<int>} unsortedList
   * @returns {array<int>} the sorted array
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

      // Second loop for checking values in sorted side iterates backwards
      for (var j = i - 1; j >= 0 && unsortedList[j] > temp; j--) {
        // Comparison from sorted side is shifted upwards one position
        unsortedList[j + 1] = unsortedList[j];
      }
      // Item from unsorted side (temp) is inserted in correct position in sorted side
      unsortedList[j + 1] = temp;
    }

    // For clarity of naming
    const sortedList = unsortedList;
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

const search = {

  /**
   * @param {array<int>} searchIn must be ordered lowest to highest, must not contain duplicate values
   * @param {int} searchFor
   * @returns {boolean} whether the searchFor exists in the searchIn array
   */
  binarySearch: function(searchIn, searchFor, mostLeftOfArr = 0, mostRightOfArr = searchIn.length-1) {

    // if searchIn is an empty array we haven't found it
    if (searchIn.length === 0) {
      return false;
    }

    // if array only contains one value, test if it's searchFor
    if (searchIn.length === 1) {
      return (searchIn[0] === searchFor);
    }

    // Splits the targeted portion of the array in half and takes the index of the middle item
    const midwayIndex = parseInt(((mostLeftOfArr + mostRightOfArr) / 2).toFixed(), 10);

    // Gets the value of the midway item
    const midwayVal = searchIn[midwayIndex];

    // If targeted portion is reduced to 1 or less items and the element is not the target
    if (mostRightOfArr <= mostLeftOfArr && midwayVal != searchFor) {
      // Not found
      return false;
    }

    // If middle value is larger than target
    if (midwayVal > searchFor) {
      // Binary search is run on the portion excluding the right side (values are larger than target)
      return search.binarySearch(searchIn, searchFor, mostLeftOfArr, midwayIndex-1);

      // If middle value is smaller than target
    } else if (midwayVal < searchFor) {
      // Binary search is run on the portion excluding the left side (values are smaller than target)
      return search.binarySearch(searchIn, searchFor, midwayIndex+1, mostRightOfArr);

      // Only combination left is that midwayVal = the target
    } else {
      // Item found
      return true;
    }
  },


  /**
   * @param {array<int>} searchIn must be ordered lowest to highest, must not contain duplicate values
   * @param {int} searchFor
   * @returns {boolean} whether the searchFor exists in the searchIn array
   */
  linearSearch: function(searchIn, searchFor) {
    // Iterates through all items in array
    for (var i=0; i < searchIn.length; i++) {
      // If currently indexed item is the target
      if (searchIn[i] === searchFor) {
        // Found
        return true;
      }
    }
    // If it hasn't been found in the for loop it isn't existant in array
    return false;
  },

  /**
   * @param {array<any>} arr
   * @returns {int}
   */
  getMidIndex: function(arr) {
    if (arr.length === 0) {
      // handle empty arrays
      return 0;
    } else {
      return parseInt((arr.length) / 2, 10);
    }
  }
}

const utility = {

  // Converts string arrays into integer ones
  parseIntArray: function(list) {
    for (var i = 0; i < list.length; i++) {
      list[i] = parseInt(list[i]);
    }
    return list;
  },

  // Generates an array of random integers between 1 and 10
  generateSampleArray: function(arrLength) {
    var listGen = [];
    // Fills array with random integers between 1-10
    for (var i = 0; i <= arrLength-1; i++) {
      listGen.push(Math.floor((Math.random() * 10) + 1));
    }
    return listGen;
  },

  // Redirects list and target to relevant search routine
  referToSearch: function(list) {

    var found;
    var searchingMethod = $('.search-demo input:checked').val();
    // Stores value currently in the target input box and stores as integer
    var target = parseInt($('#targetInput').val(), 10);

    // Takes time before function call
    var t0 = performance.now();

    // Calls appropriate search algorithm
    if (searchingMethod == 'linearSearch') {
      found = search.linearSearch(list, target);
    } else {
      // Passes sorted array necessary for binary search
      found = search.binarySearch(sort.quickSort(list), target);
    }

    // Takes time after function call
    var t1 = performance.now();

    // Time taken calculated and assigned
    var timeTaken = (t1 - t0).toFixed(3) + 'ms';

    utility.searchOutput(list, found, target, timeTaken);

  },

  // Redirects list to relevant sort routine
  referToSort: function(unsortedList) {

    var sortedList;
    var sortingMethod = $(".sort-demo input:checked").val();

    // Takes time before function call
    var t0 = performance.now();

    if (sortingMethod == 'bubbleSort') {
      sortedList = sort.bubbleSort(unsortedList);
    } else if (sortingMethod == 'insertionSort') {
      sortedList = sort.insertionSort(unsortedList);
    } else {
      sortedList = sort.quickSort(unsortedList);
    }

    // Takes time after function call
    var t1 = performance.now();

    // Time taken calculated and assigned
    var timeTaken = (t1 - t0).toFixed(3) + 'ms';

    // Calls to output values on screen
    utility.sortOutput(sortedList, sortingMethod, timeTaken);

  },

  // Outputs the sorting data on screen
  sortOutput: function(sortedList, sortingMethod, timeTaken) {
    $('#sortedList').text(sortedList);
    $('#sortingMethod').text(sortingMethod);
    $('#timeCompleted').text(timeTaken);
  },

  // Outputs the searching data on screen
  searchOutput: function(sortedList, found, target, timeTaken) {
    $('#sortedList').text(sortedList);
    $('#found').text(found);
    $('#target').text(target);
    $('#timeCompleted').text(timeTaken);
  }

}


// Event listeners (main loop)
$(document).ready(function() {

  // Handle for selecting the different searching methods (changes text)
  $('.search-demo input[type=radio]').change(function() {
    if ($('input:checked').val() == 'linearSearch') {
      $('#sortingMethod').text('None');
      $('#btnGenSearch').val('Generate and Search');
      $('#sortedListWhole').slideUp(100);
    } else {
      $('#sortingMethod').text('quickSort');
      $('#btnGenSearch').val('Generate, Sort and Search');
      $('#sortedListWhole').slideDown(100);
    }

  });

  // Handle for searching items in custom array
  $('#btnCustomSearch').click(function() {

    // Takes user input of list
    var unsplitList = $('#arrayInputSearch').val();

    // Converts inputted list into real array
    var list = unsplitList.split(/[\s,]+/);
    // Converts all values to integers
    list = utility.parseIntArray(list);

    // Shows text for unsorted list before it is affected
    $('#unsortedList').text(list);

    utility.referToSearch(list);

  });

  // Handle for searching items in a generated array
  $('#btnGenSearch').click(function() {

    // Takes length inputted by user and asigns to a value
    var arrLength = parseInt($('#genArraySizeInputSearch').val(), 10);

    // Generates array of that length
    var list = utility.parseIntArray(utility.generateSampleArray(arrLength));

    // Shows text for unsorted list before it is affected
    $('#unsortedList').text(list);

    // Sends off to be appropriately sorted
    utility.referToSearch(list);

  });

  // Handle for custom list sorting button
  $('#btnCustomSort').click(function() {

    // Takes user input of list
    var unsplitList = $('#arrayInput').val();

    // Converts inputted list into real array
    var list = unsplitList.split(/[\s,]+/);

    // Converts all values to integers
    list = utility.parseIntArray(list);

    // Shows unsorted list text on screen
    $('#unsortedList').text(list);

    // Sends off to be appropriately sorted
    utility.referToSort(list);

  });

  // Handle for generated list sorting button
  $('#btnGenSort').click(function() {

    // Takes length inputted by user and asigns to a value
    var arrLength = $('#genArraySizeInputSort').val();

    // Generates array of that length
    var list = utility.parseIntArray(utility.generateSampleArray(arrLength));

    // Shows unsorted list text on screen
    $('#unsortedList').text(list);

    // Sends off to be appropriately sorted
    utility.referToSort(list);

  });

});
