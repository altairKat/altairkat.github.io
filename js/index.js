var panelBusqueda;

$(function () {

   // var content = document.getElementById('tools');
   var content = document.getElementById('panelDeslizante');
   
    var btn3D = document.getElementById('infoDiv');
    var btnVolumen = document.getElementById('activarVoz');
    var viewDiv = document.getElementById('viewDiv');
    var footer = document.getElementById('footer');
    var panelIniciarRuta = document.getElementById('panelIniciarRuta');
    var panelDesplegable = document.getElementById('btnDesplegable');
    var btnHelp = document.getElementById('btnHelp');
    let btnBack = 'back-btn';

    seccionDesplegable();
    seccionAyuda();
    panelSlider();



    document.getElementById('back-btn').addEventListener('click', event => {
        mostrarOcultarPaneles(false);
    });




    document.getElementById('btnBuscar').addEventListener('click', event => {
        mostrarOcultarPaneles(true);
        footer.style.display = "block";
    });

    $('button.find-location, .menu-btn').on('click', function () {
        mostrarOcultarPaneles(true);
        // $('.input-page-wrapper').hide();
        // $('.seccionAyuda').hide();
        // $('#viewDiv,.app-bar').show();
        // btn3D.style.display = "block";
        getUserLocation();

    });

    document.getElementById('btnIniciar').addEventListener('click', event => {
        content.style.display = "none";
        panelIniciarRuta.style.display = "none";
        panelDesplegable.style.display = "block";
    });

    document.getElementById('menu-nav-btn').addEventListener('click', event => {

        if (content.style.display === "none") {
            content.style.display = "block";
             //panelBusqueda.close();
         } else {
            content.style.display = "none";
          
         }
        //panelBusqueda.hide();
       // crearPanelBusquedaRuta();
        //selecionarRuta();

    });

    document.getElementById('activarVoz').addEventListener('click', function () {
        //var icon = document.getElementById('fa-volume');
        $('#fa-volume').toggleClass('fas fa-volume-up').toggleClass('fas fa-volume-mute');

    })


    function mostrarOcultarPaneles(mostrar) {
        if (!mostrar) {
            $('.input-page-wrapper').show();
            $('.app-bar').hide();
            $('#menu-nav-btn').show();
            $('.seccionAyuda').hide();
            viewDiv.style.display = "none";
            content.style.display = "none";
            btn3D.style.display = "none";
            footer.style.display = "none";
            btnVolumen.style.display = "none";
            $('.seccionToggle').slideUp();
        } else {
            $('.input-page-wrapper').hide();
            $('#viewDiv,.app-bar').show();
            btn3D.style.display = "block";
            btnVolumen.style.display = "block";
            // footer.style.display = "block";
            panelIniciarRuta.style.display = "block";
            panelDesplegable.style.display = "none";
            $('.seccionAyuda').hide();
        }

    }


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

    function seccionAyuda() {

        //SECCION AYUDA
        var current_fs, next_fs, previous_fs; //fieldsets
        var left, opacity, scale; //fieldset properties 
        var animating;

        btnHelp.addEventListener('click', event => {
            // alert("click")
            $('.input-page-wrapper').hide();
            $('.app-bar').show();
            $('.seccionAyuda').show();
            $('.route-name').hide();
            $('#menu-nav-btn').hide();

        });

        $(".next").click(function () {
            if (animating) return false;
            animating = true;

            current_fs = $(this).parent();
            next_fs = $(this).parent().next();

            //activate next step on progressbar using the index of next_fs
            $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

            //show the next fieldset
            next_fs.show();
            //hide the current fieldset with style
            current_fs.animate({ opacity: 0 }, {
                step: function (now, mx) {
                    //as the opacity of current_fs reduces to 0 - stored in "now"
                    //1. scale current_fs down to 80%
                    scale = 1 - (1 - now) * 0.2;
                    //2. bring next_fs from the right(50%)
                    left = (now * 50) + "%";
                    //3. increase opacity of next_fs to 1 as it moves in
                    opacity = 1 - now;
                    current_fs.css({
                        'transform': 'scale(' + scale + ')',
                        'position': 'absolute'
                    });
                    next_fs.css({ 'left': left, 'opacity': opacity });
                },
                duration: 800,
                complete: function () {
                    current_fs.hide();
                    animating = false;
                },
                //this comes from the custom easing plugin
                easing: 'easeInOutBack'
            });
        });

        $(".previous").click(function () {
            if (animating) return false;
            animating = true;

            current_fs = $(this).parent();
            previous_fs = $(this).parent().prev();

            //de-activate current step on progressbar
            $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

            //show the previous fieldset
            previous_fs.show();
            //hide the current fieldset with style
            current_fs.animate({ opacity: 0 }, {
                step: function (now, mx) {
                    //as the opacity of current_fs reduces to 0 - stored in "now"
                    //1. scale previous_fs from 80% to 100%
                    scale = 0.8 + (1 - now) * 0.2;
                    //2. take current_fs to the right(50%) - from 0%
                    left = ((1 - now) * 50) + "%";
                    //3. increase opacity of previous_fs to 1 as it moves in
                    opacity = 1 - now;
                    current_fs.css({ 'left': left });
                    previous_fs.css({ 'transform': 'scale(' + scale + ')', 'opacity': opacity });
                },
                duration: 800,
                complete: function () {
                    current_fs.hide();
                    animating = false;
                },
                //this comes from the custom easing plugin
                easing: 'easeInOutBack'
            });
        });

        $(".submit").click(function () {
            return false;
        })
    }
function crearPanelBusquedaRuta(){
    panelBusqueda = jsPanel.modal.create({
        header: true,
        headerTitle: 'Busqueda',
        headerLogo: '<span class="fa fa-bars" style="margin-left:8px;cursor:pointer;"></span>',
        headerControls: 'closeonly xs',

        onwindowresize: true,
        maximizedMargin: 5,
        syncMargins: true,
        dragit: { snap: true },
        content: `<div id="panelBusqueda" style="display:block">
        <span class="input-title">Selecciona una ruta </span>
        <select id="routeSelector" class="input-title">
           
            <option data-route="1.kml">1</option>
            <option data-route="2.kml">2</option>
            <option data-route="3.kml">3</option></select>
        <br>
    
        <span class="input-title">Selecciona el tipo de movilidad </span>
        <div id="typeTransport">
            <i class="fas fa-walking"></i>
            <i class="fas fa-biking"></i>
            <select id="kmSelector" class="input-title">
           
            <option data-metros="100">100</option>
            <option data-metros="200">200</option>
            <option data-metros="300">300</option></select>
        <br>
        </div>
       
        <div id="divBusquedaRuta">
     
        

        <button class="sub-btn" type="button" id="btnBusquedaRuta">
        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="#000000" d="M2,21L23,12L2,3V10L17,12L2,14V21Z"></path>
        </svg>
        <span class="btn-title">Buscar</span>
<button class="sub-btn" type="button" id="removeRoutes">
        <i class="far fa-times-circle"></i>
        <span class="btn-title">Limpiar</span>
        </div>
    </button>
    </div>`,
        contentSize: {
            width: $(window).width() * 0.99,
            height: $(window).height() * 0.35
        },
       /* closeOnBackdrop: true,*/
        position: 'center-bottom',
        theme: 'light',
        borderRadius: '0.5rem'
    });
}


function panelSlider(){
    let block = document.querySelector(".block-1"),
    block2 = document.querySelector(".block-2"),
     slider = document.querySelector(".slider");
   
   // on mouse down (drag start)
   slider.onmousedown = function dragMouseDown(e) {
     // get position of mouse
     let dragX = e.clientY;
     // register a mouse move listener if mouse is down
     document.onmousemove = function onMouseMove(e) {
       // e.clientY will be the position of the mouse as it has moved a bit now
       // offsetHeight is the height of the block-1
   if(block.style.height!="340px"){
      block.style.height = block.offsetHeight + e.clientY - dragX + "px";
   block2.style.height =  window.innerHeight - dragX + "px";
   }
    
   
       // update variable - till this pos, mouse movement has been handled
       dragX = e.clientY;
     }
     // remove mouse-move listener on mouse-up (drag is finished now)
     document.onmouseup = () => document.onmousemove = document.onmouseup = null;
   }
 }
});