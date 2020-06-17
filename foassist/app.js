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

        for (var i = 0; i < arraySkus.length; i++) {
            var name = arraySkus[i][1].productName;
            var key = arraySkus[i][0];

            // li html to be appended
            var listItem = `<li class="list-item" id="` + key + `">
                                <i class="arrow down ddBtn"></i>
                                <span class="liName">` + name + `</span>
                                <div id="` + key + `DDContent" class="ddcontent ddcontent-hidden" style="display: none;">
                                <span style="font-weight: normal;">Units: </span><input id="` + key + `Amount" type="number" class="input-amount" placeholder="0">
                                    <div id="` + key + `DDBarcode" class="ddbarcode"></div>
                                </div>
                            </li>`;

            $('#nameList').append(listItem);
            $('#' + key + 'DDBarcode').barcode(key, 'code39', {output: "svg"});
            //$('#' + key).append('<span class="liSku">' + key + '</span>');            
        }


    };

    // dropdown button listener
    $('#nameList').on('click', '.ddBtn', function(e) {
        $(this).toggleClass('down');
        $(this).toggleClass('up');
        e.stopPropagation();
        var productKey = $(this).closest('li').attr('id');
        productDropdown(productKey);
    });

    $('#nameList').on('click', '.list-item', function() {

        // gets sku number from element id
        var sku = $(this).attr('id');
        
        if (skuNumbers[sku].units == 0) {
            $('#' + sku).toggleClass('stocked');
            $('#' + sku + ' .ddBtn').toggleClass('arrow-stocked');
    
            // toggles 'stocked' boolean
            if (skuNumbers[sku].inStock) {
                skuNumbers[sku].inStock = false;
            } else {
                skuNumbers[sku].inStock = true;
            } 
        }

        
        

    });


    function productDropdown(productKey) {

        // fixes stuck width issue
        $('#' + productKey + 'DDBarcode').css('width', '80%');

        if ($('#' + productKey + 'DDContent').hasClass('ddcontent-hidden')) {
            $('#' + productKey + 'DDContent').removeClass('ddcontent-hidden');
            $('#' + productKey + 'DDContent').slideDown(200);

        } else {
            $('#' + productKey + 'DDContent').addClass('ddcontent-hidden');
            $('#' + productKey + 'DDContent').slideUp(200);
        }

    };


    $('#nameList').on('click', '.input-amount', function(e) {
        e.stopPropagation();
    });

    


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
                if (skuNumbers[key].units != 0) {
                    $('#' + key + 'Barcode').append('<h2 style="font-weight: bold; color: #e97f28;"> Units: ' + skuNumbers[key].units + '</h2>');
                }
                $('#' + key + 'Barcode').append('<h2 style="font-weight: 100; color: #444">' + slideNumber + '</h2>');
                
                
                
            }

        }
        swiper.update();

    });

    // unit input listener (delegated)
    $('#nameList').on('keyup', '.input-amount', function() {
        var productKey = $(this).closest('.list-item').attr('id');
        
        var input = $(this).val();

        skuNumbers[productKey].inStock = true;
        $('#' + productKey).removeClass('stocked');
        $('#' + productKey + ' .ddBtn').removeClass('arrow-stocked');
        
        // returned to 0 if box is empty
        if (input == "") {
            input = 0;
            skuNumbers[productKey].inStock = false;
        }

        skuNumbers[productKey].units = parseInt(input, 10);

    });

    // search listener
    $("#inputString").keyup(function() {
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
