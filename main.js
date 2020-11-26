//variables globales
var popup;
var map;
var wmsSource;
var currentLng;
var iniciando = true;
var iniciandasCapasPS = false;



$(document).ready(function () {
  //console.log("LISTO!")

  $("#componetes").hide();
 /*----------IDIOMA------------ */
  currentLng = getIdiomaSesion();
  if(getIdiomaSesion()==undefined){
    currentLng = 'es';
  }
 // console.log(currentLng)
  cambiarIdioma(currentLng)
/*--------------------------- */

  setTimeout(() => {

    loadComponents();
    w3.includeHTML(htmlsCargados);

    function htmlsCargados() {
      try {
       
        cambiarIdiomaA();
        init();
        cargarModales();
        //addLeyenda();
        cargarPlaneamiento();

      } catch (e) {
        //console.log('Error iniciando componentes');
        //console.log(e);
      } finally {

      }
    }

    function loadComponents() {
      $('html').find('component').each(function (ind, val) {
        //console.log($(val).attr('name'));
        var component = $(val).attr('name');
        $('<link rel="stylesheet" href="components/' + component + '/' + component + '.css">').appendTo('head');

        $(val).replaceWith('<div w3-include-html="components/' + component + '/' + component + '.html"></div>');
        $('<script type="text/javascript" src="components/' + component + '/' + component + '.js">').appendTo('body');
      });
    }


  }, 100);



})


// function loadIdioma(currentLng) {
//   var translate = new Translate();
//   var attributeName = 'data-tag';
//   translate.init(attributeName, currentLng);
//   translate.process();

// }

function cambiarIdiomaA() {
  $("#idioma a").click(function () {
    $("#idioma a").removeClass("active");
    $(this).addClass("active");
    currentLng = this.id;
    setIdiomaSesion(currentLng);
    cambiarIdioma(currentLng);
    if (table != undefined) {
      table.setLocale(currentLng);
      columnaSegunIdioma();
    }
    if (tableInfo != undefined) crearFicha(featureDatos,origen);
  });
}

function cargarPlaneamiento() {
  capaSubParcelaTotal = obtenerSubParcelaLayer()
  capaParcelaTotal = obtenerParcelaLayer();
  map.addLayer(capaSubParcelaTotal);
  map.addLayer(capaParcelaTotal);
  
  iniciandasCapasPS=true;
}

function getIdiomaSesion() {
  var lang=undefined;
  //console.log(localStorage)
  // Check browser support
  if (typeof (Storage) !== "undefined") {
    // Retrieve
    lang = localStorage.getItem("lang");

   
  } else {
    console.log("Sorry, your browser does not support Web Storage...");
  }
  return lang;
}

function setIdiomaSesion(idioma) {
  // Check browser support
  
  if (typeof (Storage) !== "undefined") {
    // Store
    localStorage.setItem("lang", idioma);
  } else {
    console.log("Sorry, your browser does not support Web Storage...");
  }
}