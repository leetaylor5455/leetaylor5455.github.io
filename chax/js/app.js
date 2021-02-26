$(function() {

    $.get('http://192.168.0.79', function(data) {
            if (data != null) {
                console.log('Online');
                $('#status').text('Online');
                $('#statusIndicator').css('background-color', '#00FF90')
            }
    });


    var colorPicker = new iro.ColorPicker("#picker", {
        // Set the size of the color picker
        width: 320,
        // Set the initial color to pure red
        color: "rgb(255, 255, 255)",
        borderWidth: 2,
        margin: 30
      });

      colorPicker.on('input:end', function(color) {
        console.log(color.rgb);
        let appendURL = `?r${color.rgb.r}g${color.rgb.g}b${color.rgb.b}&`;

        $.get('http://192.168.0.79/' + appendURL);
      })
});

