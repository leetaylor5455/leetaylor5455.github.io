const search = {

  /**
   * @param {int} searchFor
   * @param {array<int>} searchIn must be ordered lowest to highest, must not contain duplicate values
   * @returns {boolean} whether the searchFor exists in the searchIn array
   */
  binarySearch: function(searchFor, searchIn) {

    // if searchIn is an empty array we haven't found it
    if (searchIn.length === 0) {
      return false;
    }

    // if array only contains one value, test if it's searchFor
    if (searchIn.length === 1) {
      return (searchIn[0] === searchFor);
    }

    // get midway point of array (rounded up)
    const midwayIndex = search.getMidIndex(searchIn);

    // get value at midway point
    const midwayVal = searchIn[midwayIndex];

    // if value === searchFor we've found it
    if (midwayVal === searchFor) {
      return true;
    } else {
      if (midwayVal > searchFor) {
        // value is in the left half of the array
        const leftHalfOfArr = searchIn.splice(0, midwayIndex);
        return search.binarySearch(searchFor, leftHalfOfArr);
      } else {
        // value is in right half of the array
        const rightHalfOfArr = searchIn.splice(midwayIndex);
        return search.binarySearch(searchFor, rightHalfOfArr);
      }
    }
  },

  linearSearch: function(searchFor, searchIn) {
    // Iterates through all items in array
    for (var i=0; i < searchIn.length-1; i++) {
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

// tests (usually you'd use a test framework but I just want really simple tests)

let getMidIndexResult = search.getMidIndex([])

if (getMidIndexResult !== 0) {
  throw new Error('getMidIndex should return zero. Actual: ' + getMidIndexResult)
} else {
  console.log('✓ getMidIndex empty array test passed')
}

getMidIndexResult = search.getMidIndex([1])
if (getMidIndexResult !== 0) {
  throw new Error('getMidIndex should return zero. Actual: ' + getMidIndexResult)
} else {
  console.log('✓ getMidIndex single element test passed')
}

getMidIndexResult = search.getMidIndex([1, 2, 3, 4])
if (getMidIndexResult !== 2) {
  throw new Error('getMidIndex should return two. Actual: ' + getMidIndexResult)
} else {
  console.log('✓ getMidIndex even amount of elements test passed')
}

getMidIndexResult = search.getMidIndex([1, 2, 3, 4, 5, 6])
if (getMidIndexResult !== 3) {
  throw new Error('getMidIndex should return three. Actual: ' + getMidIndexResult)
} else {
  console.log('✓ getMidIndex more even amount of elements test passed')
}

getMidIndexResult = search.getMidIndex([1, 2, 3, 4, 5, 6, 7])
if (getMidIndexResult !== 3) {
  throw new Error('getMidIndex should return three. Actual: ' + getMidIndexResult)
} else {
  console.log('✓ getMidIndex odd amount of elements test passed')
}

// actual search tests
console.log() // new line

let searchResult = search.binarySearch(2, [2])
if (searchResult !== true) {
  throw new Error('searchResult should be true. Actual: ' + searchResult)
} else {
  console.log('✓ binarySearch single element test passed')
}

searchResult = search.binarySearch(2, [])
if (searchResult !== false) {
  throw new Error('searchResult should be false. Actual: ' + searchResult)
} else {
  console.log('✓ binarySearch no elements test passed')
}

searchResult = search.binarySearch(3, [2])
if (searchResult !== false) {
  throw new Error('searchResult should be false. Actual: ' + searchResult)
} else {
  console.log('✓ binarySearch single element not found test passed')
}

searchResult = search.binarySearch(3, [1, 2, 3, 4, 5])
if (searchResult !== true) {
  throw new Error('searchResult should be true. Actual: ' + searchResult)
} else {
  console.log('✓ binarySearch found in middle of array test passed')
}

searchResult = search.binarySearch(3, [1, 2, 3, 4, 5, 6, 7, 8])
if (searchResult !== true) {
  throw new Error('searchResult should be true. Actual: ' + searchResult)
} else {
  console.log('✓ binarySearch found in left side of array passed')
}

searchResult = search.binarySearch(7, [1, 2, 3, 4, 5, 6, 7, 8])
if (searchResult !== true) {
  throw new Error('searchResult should be true. Actual: ' + searchResult)
} else {
  console.log('✓ binarySearch found in right side of array passed')
}
