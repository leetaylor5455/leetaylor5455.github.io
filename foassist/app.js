$(document).ready(function() {

    function mouseDown() {
        alert('mouse down')
    }

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

            // li html to be appended
            var listItem = `<li class="list-item" id="` + key + `">
                                <span class="liSku">` + key + `</span>
                                <span class="liName">` + name + `</span>
                                <div id="` + key + `DDBarcode" class="ddbarcode ddbarcode-hidden" style="display: none;"></div>
                            </li>`;

            $('#nameList').append(listItem);
            $('#' + key + 'DDBarcode').barcode(key, 'code39', {output: "svg"});
            //$('#' + key).append('<span class="liSku">' + key + '</span>');            
        }
        

    };

    // declare timer
    var timeoutId = null;


    // list item mousedown listener (delegation necessary due to appended elements)
    $('#nameList').on('touchstart', '.list-item', function() {

        // gets sku for list item
        var productKey = $(this).attr('id');

        timeoutId = setTimeout(function() {
            onProductDropdown(productKey);
        }, 600);

    });
    
    // list item mouseup listener (delegation necessary due to appended elements)
    $('#nameList').on('touchend', '.list-item', function() {

        // if tap (not hold)
        if (timeoutId != null) {
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
        }

        clearTimeout(timeoutId);
        timeoutId = null;

    });

    $('#nameList').on('mousedown', '.ddBtn', function(e) {
        e.stopPropagation();
        var productKey = $(this).closest('li').attr('id');
        onProductDropdown(productKey);
    })

    function onProductDropdown(productKey) {
        clearTimeout(timeoutId);
        timeoutId = null;

        // fixes stuck width issue
        $('#' + productKey + 'DDBarcode').css('width', '80%');

        if ($('#' + productKey + 'DDBarcode').hasClass('ddbarcode-hidden')) {
            $('#' + productKey + 'DDBarcode').removeClass('ddbarcode-hidden');
            $('#' + productKey + 'DDBarcode').slideDown(200);

        } else {
            $('#' + productKey + 'DDBarcode').addClass('ddbarcode-hidden');
            $('#' + productKey + 'DDBarcode').slideUp(200);
        }

    }

    

    // generates bar codes on OK button click
    $('#btnOk').click(function() {

        var textContent = $(this).text();

        // list page
        if (textContent === 'OK') {
            $(this).text('Back');

        // barcode page
        } else {
            $(this).text('OK');
        }

        $('#list').toggle();
        $('#barcodes').toggle();

        var slideNumber = 0;

        for (var key in skuNumbers) {

            // if not in stock
            if (!skuNumbers[key].inStock) {

                slideNumber++;

                // id will return as sku number with Barcode concatted, e.g. 1234567Barcode
                $('#barcodes').append('<div class="swiper-slide"><div class="swiper-barcode barcode-holder" id="' + key + 'Barcode"></div></div>');
                $('#' + key + 'Barcode').barcode(key, 'code39', {output: "svg"});
                $('#' + key + 'Barcode').append('<h2>' + skuNumbers[key].productName + '</h2>');
                $('#' + key + 'Barcode').append('<h2 style="font-weight: 100; color: #444">' + slideNumber + '</h2>');
            }

        }
        swiper.update();

    });

    // search listener
    $("#inputString").keyup(function () {
        var filter = $(this).val();
        $("ul li").each(function () {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).hide();
            } else {
                $(this).show()
            }
        });
    });
        

});