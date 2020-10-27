$(document).ready(function() {

    var skuNumbers = {};
    var skusObj = {};
    //var editedSkus = {};
    var swiper = new Swiper('.swiper-container');

    // gets list from skunumbers.json and assigns to list variable
    $.getJSON('skunumbers.json')
    .done( function(rawSkus) {

        skuNumbers = rawSkus;

        //skusObj = JSON.parse(rawSkus);

        let arrSkus = Object.entries(rawSkus)

        arrSkus.forEach((product) => {
            product[1].inStock = false;
            product[1].units = 0;
        });

        let editedSkus = Object.fromEntries(arrSkus);
        
        
        populateList(editedSkus);

        

    });

    function sortData(obj) {
        // converts json into array
        var arraySkus = Object.entries(obj);

        arraySkus.sort(function(a, b){
            if(a[1].productName < b[1].productName) { return -1; }
            if(a[1].productName > b[1].productName) { return 1; }
            return 0;
        });

        return arraySkus;
    }

    // sorts object and populates list
    function populateList(skusObj) {
        

        var arraySkus = sortData(skusObj);
        

        for (var i = 0; i < arraySkus.length; i++) {
            var name = arraySkus[i][1].productName;
            var key = arraySkus[i][0];

            // li html to be appended
            var listItem = `<li class="list-item" id="` + key + `">
                                <div class="arrow-container">
                                    <i class="arrow down ddBtn"></i>
                                </div>
                                <span class="liName">` + name + `</span><span id="` + key + `subAmount"></span>
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
    $('#nameList').on('click', '.arrow-container', function(e) {
        var $ddBtn = $(this).find('.ddBtn')
        $ddBtn.toggleClass('down');
        $ddBtn.toggleClass('up');
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

        // clears barcode div to stop duplication
        $('#barcodes').html('');

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

        var sortedSkus = sortData(skuNumbers);

        // calculates gaps in total
        var gapsAmount = 0;
        for (var i = 0; i < sortedSkus.length; i++) {
            if (!sortedSkus[i][1].inStock) {
                gapsAmount++;
            }
        }

        var gapNum = 0;
        for (var i = 0; i < sortedSkus.length; i++) {

            var key = sortedSkus[i][0];
            if (!sortedSkus[i][1].inStock) {
                gapNum++;

                // id will return as sku number with Barcode concatted, e.g. 1234567Barcode
                $('#barcodes').append('<div class="swiper-slide"><div class="swiper-barcode barcode-holder" id="' + key + 'Barcode"></div></div>');
                $('#' + key + 'Barcode').barcode(key, 'code39', {output: "svg"});
                $('#' + key + 'Barcode').append('<h2>' + skuNumbers[key].productName + '</h2>');
                if (skuNumbers[key].units != 0) {
                    $('#' + key + 'Barcode').append('<h2 style="font-weight: bold; color: #e97f28;"> Units: ' + skuNumbers[key].units + '</h2>');
                }
                $('#' + key + 'Barcode').append('<h4 style="font-weight: 100; color: #444; margin-top: 1rem;">' + gapNum + ' / ' + gapsAmount + '</h4>');

            }

        }
        swiper.update();

    });

    // unit input listener (delegated)
    $('#nameList').on('keyup', '.input-amount', function() {
        var productKey = $(this).closest('.list-item').attr('id');

        var input = $(this).val();

        $('#' + productKey + 'subAmount').addClass('sub-amount-visible');

        if (input != "0") {
            $('#' + productKey + 'subAmount').text(input)
        }
        

        skuNumbers[productKey].inStock = false;
        $('#' + productKey).addClass('stocked');
        $('#' + productKey + ' .ddBtn').addClass('arrow-stocked');
        
        // returned to 0 if box is empty
        if (input == "" || input == "0") {
            input = 0;
            skuNumbers[productKey].inStock = false;
            $('#' + productKey).removeClass('stocked');
            $('#' + productKey + ' .ddBtn').removeClass('arrow-stocked');
            $('#' + productKey + 'subAmount').removeClass('sub-amount-visible');
        }

        skuNumbers[productKey].units = parseInt(input, 10);
        console.log(skuNumbers[productKey])
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
