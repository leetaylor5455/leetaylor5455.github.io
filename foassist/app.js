$(document).ready(function() {

    var skuNumbers = {};
    var swiper = new Swiper('.swiper-container');
    
    // gets list from skunumbers.json and assigns to list variable
    $.getJSON('skunumbers.json')
    .done( function(rawSkus) {

        generateList(rawSkus);

    });

    
    function generateList(rawSkus) {

        // converts json into array
        var arraySkus = Object.entries(rawSkus);
        //console.log(arraySkus)

        // compares name values
        arraySkus.sort(function(a, b){
            if(a[1][0] < b[1][0]) { return -1; }
            if(a[1][0] > b[1][0]) { return 1; }
            return 0;
        });


        //console.log(arraySkus)
        var sortedSkus = JSON.stringify(arraySkus)
        console.log(sortedSkus);
        
        skuNumbers = rawSkus;

        // console.log(skuNumbers)

        for (var key in skuNumbers) {

            // key values in the JSON file are stored as single length arrays
            var name = skuNumbers[key][0];
            // false pushed to indicate no stock
            skuNumbers[key].push(false)
            
            // appends list with item with sku number as id (always unique)
            $('#nameList').append('<li class="list-item" id="' + key + '">' + name + '</li>');
            $('#' + key).append('<h6>' + key + '</h6>');

        }
            
        // assigns altered skus to public variable

    };


    // list item click listener (delegation necessary due to appended elements)
    $('#nameList').on('click', '.list-item', function() {

        // gets sku number from element id
        var sku = $(this).attr('id');

        $('#' + sku).toggleClass('stocked');

        // toggles 'stocked' boolean
        console.log()
        if (skuNumbers[sku][1]) {
            skuNumbers[sku][1] = false;
        } else {
            skuNumbers[sku][1] = true;
        }

    });

    // generates bar codes on OK button click
    $('#btnOk').click(function() {

        var textContent = $(this).text();
        if (textContent === 'OK') {
            $(this).text('Back');
        } else {
            $(this).text('OK');
        }

        $('.list').toggle();
        $('#barcodes').toggle();


        for (var key in skuNumbers) {

            if (!skuNumbers[key][1]) {

                // id will return as sku number with Barcode concatted, e.g. 1234567Barcode
                $('#barcodes').append('<div class="swiper-slide"><div class="barcode-holder" id="' + key + 'Barcode"></div></div>');
                $('#' + key + 'Barcode').barcode(key, 'code39', {output: "svg"});
                $('#' + key + 'Barcode').append('<h2>' + skuNumbers[key][0] + '</h2>');
            
            }

        }
        swiper.update();

    });
        

});