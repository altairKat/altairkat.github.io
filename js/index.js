$(function () {

    var content = document.getElementById('tools');
    var btn3D = document.getElementById('infoDiv');
    var viewDiv = document.getElementById('viewDiv');
    var footer = document.getElementById('footer');
    
    document.getElementById('back-btn').addEventListener('click', event => {
        $('.input-page-wrapper').show();
        $('.app-bar').hide();
   
        viewDiv.style.display = "none";
        content.style.display = "none";
        btn3D.style.display = "none";
        footer.style.display = "none";

    });
    document.getElementById('btnBuscar').addEventListener('click', event => {
        if ($('input.search').val() != '') {
            $('.input-page-wrapper').hide();
            $('#viewDiv,.app-bar').show();
            btn3D.style.display = "block";
            footer.style.display = "block";
        } else {
            $('.input-page-wrapper').hide();
            $('#viewDiv,.app-bar').show();
            btn3D.style.display = "block";
        }
    });

    document.getElementById('btnIniciar').addEventListener('click', event => {
        content.style.display = "none";
            $('#footer').hide(); 
        
    });
  
    document.getElementById('menu-nav-btn').addEventListener('click', event => {

        if (content.style.display === "flex") {
            content.style.display = "none";
        } else {
            content.style.display = "flex";
        }

    });

    document.getElementById('activarVoz').addEventListener('click', function(){
        //var icon = document.getElementById('fa-volume');
        $('#fa-volume').toggleClass('fas fa-volume-up').toggleClass('fas fa-volume-mute');
        
      })

    $('button.find-location, .menu-btn').on('click', function () {
        $('#viewDiv,.app-bar').show();
        btn3D.style.display = "block";
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