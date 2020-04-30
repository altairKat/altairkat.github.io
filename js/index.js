$(function () {

    var content = document.getElementById('tools');
    var btn3D = document.getElementById('infoDiv');
    var btnVolumen = document.getElementById('activarVoz');
    var viewDiv = document.getElementById('viewDiv');
    var footer = document.getElementById('footer');
    var panelIniciarRuta = document.getElementById('panelIniciarRuta');
    var panelDesplegable=document.getElementById('btnDesplegable');
    var btnHelp=document.getElementById('btnHelp');

    btnHelp.addEventListener('click', event => {
alert("click")
    })
    document.getElementById('back-btn').addEventListener('click', event => {
        $('.input-page-wrapper').show();
        $('.app-bar').hide();

        viewDiv.style.display = "none";
        content.style.display = "none";
        btn3D.style.display = "none";
        footer.style.display = "none";
        btnVolumen.style.display = "none";
        $('.seccionToggle').slideUp();
    });
    document.getElementById('btnBuscar').addEventListener('click', event => {
        if ($('input.search').val() != '') {
            $('.input-page-wrapper').hide();
            $('#viewDiv,.app-bar').show();
            btn3D.style.display = "block";
            btnVolumen.style.display = "block";
            footer.style.display = "block";
            panelIniciarRuta.style.display = "block";
            panelDesplegable.style.display = "none";
        } else {
            $('.input-page-wrapper').hide();
            $('#viewDiv,.app-bar').show();
            btn3D.style.display = "block";
            btnVolumen.style.display = "block";
        }
    });

    document.getElementById('btnIniciar').addEventListener('click', event => {
        content.style.display = "none";
        panelIniciarRuta.style.display = "none";
        panelDesplegable.style.display = "block";
    });

    document.getElementById('menu-nav-btn').addEventListener('click', event => {

        if (content.style.display === "flex") {
            content.style.display = "none";
        } else {
            content.style.display = "flex";
        }

    });

    document.getElementById('activarVoz').addEventListener('click', function () {
        //var icon = document.getElementById('fa-volume');
        $('#fa-volume').toggleClass('fas fa-volume-up').toggleClass('fas fa-volume-mute');

    })




    $('button.find-location, .menu-btn').on('click', function () {
        $('.input-page-wrapper').hide();
        $('#viewDiv,.app-bar').show();
        btn3D.style.display = "block";
        getUserLocation();
      
    });

    seccionDesplegable();

    function seccionDesplegable() {
        var estado = false;

        $('#btn-toggle').on('click', function () {
            $('.seccionToggle').slideToggle();
            $('#fa-caret').toggleClass('fas fa-caret-up').toggleClass('fas fa-caret-down');
            if (estado == true) {
                //	$(this).text("Abrir");
                $('body').css({
                    "overflow": "auto"
                });
                estado = false;
                btn3D.style.display = "block";
                btnVolumen.style.display = "block";
            } else {
                //	$(this).text("Cerrar");
                $('body').css({
                    "overflow": "hidden"
                });
                estado = true;
                btn3D.style.display = "none";
                btnVolumen.style.display = "none";
            }
        });
    }
});