$(document).ready(function() {

    var skuNumbers = {};
    var swiper = new Swiper('.swiper-container');
    
    // gets list from skunumbers.json and assigns to list variable
    $.getJSON('skunumbers.json')
    .done( function(rawSkus) {

        skuNumbers = rawSkus;
        populateList(skuNumbers);

    });
    
    // sorts object and populates list
    function populateList(skusObj) {
        // converts json into array
        var arraySkus = Object.entries(skusObj);

        // compares name values
        arraySkus.sort(function(a, b){
            if(a[1].productName < b[1].productName) { return -1; }
            if(a[1].productName > b[1].productName) { return 1; }
            return 0;
        });

        for (var i = 0; i < arraySkus.length-1; i++) {
            var name = arraySkus[i][1].productName;
            var key = arraySkus[i][0];

            // appends list with item with sku number as id (always unique)
            $('#nameList').append('<li class="list-item" id="' + key + '">' + name + '</li>');
            $('#' + key).append('<h6>' + key + '</h6>');            
        }
        

    };


    // list item click listener (delegation necessary due to appended elements)
    $('#nameList').on('click', '.list-item', function() {

        // gets sku number from element id
        var sku = $(this).attr('id');

        $('#' + sku).toggleClass('stocked');

        // toggles 'stocked' boolean
        console.log()
        if (skuNumbers[sku].inStock) {
            skuNumbers[sku].inStock = false;
        } else {
            skuNumbers[sku].inStock = true;
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

            // if not in stock
            if (!skuNumbers[key].inStock) {

                // id will return as sku number with Barcode concatted, e.g. 1234567Barcode
                $('#barcodes').append('<div class="swiper-slide"><div class="barcode-holder" id="' + key + 'Barcode"></div></div>');
                $('#' + key + 'Barcode').barcode(key, 'code39', {output: "svg"});
                $('#' + key + 'Barcode').append('<h2>' + skuNumbers[key].productName + '</h2>');
            
            }

        }
        swiper.update();

    });
        

});