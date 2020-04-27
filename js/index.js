$(function () {

    var content = document.getElementById('tools');
    var btn3D = document.getElementById('infoDiv');
    var viewDiv = document.getElementById('viewDiv');

    $('svg.back-btn').click(function () {
        $('.input-page-wrapper').show();
        $('.app-bar').hide();
        $('input.search').val('');
        viewDiv.style.display = "none";
        content.style.display = "none";
        btn3D.style.display = "none";


    });

    $('input.search').keypress(function (e) {
        if (e.which == 13) {
            $('button.sub-btn').click();
        }
    });

    $('button.sub-btn').click(function () {
        if ($('input.search').val() != '') {
            $('.input-page-wrapper').hide();
            $('#viewDiv,.app-bar').show();


        } else {
            $('.input-page-wrapper').hide();
            $('#viewDiv,.app-bar').show();
        }
    });

    $('.menu-nav-btn').click(function () {


        if (content.style.display === "flex") {
            content.style.display = "none";
            btn3D.style.display = "none";
        } else {
            content.style.display = "flex";
            btn3D.style.display = "block";
        }

    });

    $('button.find-location, .menu-btn').on('click', function () {
        $('#viewDiv,.app-bar').show();
        var Geo = {};
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
            $('button.find-location svg').addClass('btnClicked');
        } else {
            alert('Geolocation is not supported');
            $('button.find-location svg').removeClass('btnClicked');
        }

        function error() {
            $('button.find-location svg').removeClass('btnClicked');
            alert("That's weird! We couldn't find you!");
        }

        function success(position) {
            Geo.lat = position.coords.latitude;
            Geo.lng = position.coords.longitude;
            var key = '895ff6619f3b61beff40fae1c36905d4';
            var weather = "https://api.openweathermap.org/data/2.5/forecast?lat=" + Geo.lat + "&lon=" + Geo.lng + "&units=metric" + "&appid=" + key;
            // console.log(weather);

            $.ajax({
                url: weather,
                dataType: "jsonp",
                success: function (data) {

                    $('button.find-location svg').removeClass('btnClicked');
                    $('.route-name').html(data.city.name + ", " + data.city.country);


                    $('.input-page-wrapper').hide();

                }
            });
        }
    });


});