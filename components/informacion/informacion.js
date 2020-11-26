var obtenerFeatureInfo;
var displayFeatureInfo;
var wmsSourceP;
var vectorLayer;
var highlightStyle;
var highlight;
var featureOverlay;
var feature;
var tableInfo;
var defTabla;
var domImagen;
var base64Img, logoUrkiola;
var nombrePDF;
var origen;
function addCapaInfo() {
  //geoJsonPrueba()

  imagenLogo();
  displayFeatureInfo = function (evt) {
   
    map.removeLayer(vectorOVER);
    var pixel = map.getEventPixel(evt.originalEvent)
    //console.log(pixel)
    /////////////////////////
    $("#map").css("cursor", "crosshair");
    feature = map.forEachFeatureAtPixel(pixel, function (feature) {
     // console.log(feature.values_)
      if (feature.values_.MUNICIPIO != undefined) return feature;

    });
    //console.log(feature)
    var info = document.getElementById('info');
    if (feature) {
      //document.getElementById('info').innerHTML = "";
      $("#info_click").hide();
      featureDatos=feature;
      origen=undefined;
      crearFicha(feature);
      ///ZOOM A LA PARCELA SELECCIONADA
      ext = feature.values_.geometry.extent_;
      map.getView().fit(ext, {
        padding: [170, 50, 30, 150],
        size: map.getSize(),
        duration: 1000
      });

    } else {
      $("#info").empty()
      $("#info").append('<div id="tabla-info"></div>');
      $("#info").append('<p id="info_click" data-i18n="MENSAJE_CLICK_MAPA">Para ver la ficha de una parcela haga click en la PARCELA en el mapa</p>');
      $("#info_click").show();
   
    }
    quitarOverlay(feature);
    cambiarIdioma(currentLng)
  };

  map.on('click', displayFeatureInfo)

}

function quitarOverlay(feature) {
  try {
    //if(table!=undefined)table.deselectRow();

 //   map.removeLayer(vectorOVER);
    if (feature !== highlight) {
      if (highlight) {
        featureOverlay.getSource().removeFeature(highlight);
      }
      if (feature) {
        featureOverlay.getSource().addFeature(feature)
  
        setTimeout(function () {
          domImagen = obtenerImagen();
        }, 3500);
  
  
      }
      highlight = feature;
    }
  } catch (error) {
    
  }
 
}

// function mostrarElementosTabla(feature) {




// }

function crearFicha(feature,origen) {
  console.log('crearFicha')
  var data;
  var datosGenerales;
  var mun, distFuente, distCarretera, nombreLITOLO, pendMedia,nombreEvapo;


  //COMPROBAMOS QUE ES UNA COSULTA A UNA PARCELA 
  try {
    if (feature.get('RECINTO') == undefined) {
      mun = obtenerNombreMunicipio(feature.get('MUNICIPIO')) + "";
      
      if(origen=="tabla" ){
        nombreLITOLO = feature.get('COD_LITOLO')
        distFuente = feature.get('DIST_FUEN')
        distCarretera = feature.get('DIST_CARR')
        pendMedia = feature.get('PEND_MED')
        nombreEvapo=feature.get('EVAPO');
        nombreORI_MED=i18n.t(feature.get('ORI_MED'));
      }else{
        nombreLITOLO = obtenerNombreLitologia(feature.get('COD_LITOLO'));
        distFuente = obtenerDistanciaFormato(feature.get('DIST_FUEN'));
        distCarretera = obtenerDistanciaFormato(feature.get('DIST_CARR'));
        pendMedia = obtenerPendienteMedia(feature.get('PEND_MED'), "med");
        nombreEvapo=obtenerNombreEvapo(feature.get('EVAPO'));
        nombreORI_MED=i18n.t(feature.get('ORI_MED'));
      }
     
   
  
      $("#info").empty()
      $("#info").append('<div id="tabla-info"></div>');
      if (currentLng == "eu") {
        datosGenerales = "Datu orokorrak";
        data = [
  
          { id: 1, name: "Datu orokorrak", atributo: "Udalerria", i18n: "MUNICIPIOS", dato: mun, tipo: "texto" },
          { id: 1, name: "Datu orokorrak", atributo: "Poligonoa", i18n: "POLIGONO", dato: feature.get('POLIGONO'), tipo: "entero" },
          { id: 1, name: "Datu orokorrak", atributo: "Partzela", i18n: "PARCELA", dato: feature.get('PARCELA'), tipo: "entero" },
          { id: 1, name: "Datu orokorrak", atributo: "Azalera (m2)", i18n: "AREA_M2", dato: feature.get('POLY_AREA'), tipo: "m2" },
          { id: 1, name: "Datu orokorrak", atributo: "X koordenatua (m)", i18n: "COORD_X", dato: feature.get('INSIDE_X'), tipo: "float" },
          { id: 1, name: "Datu orokorrak", atributo: "Y koordenatua (m)", i18n: "COORD_Y", dato: feature.get('INSIDE_Y'), tipo: "float" },
  
  
          { id: 2, name: "Ezaugarri funtzionalak", atributo: "Errepide izena", i18n: "NOMBRE_CARRETERA", dato: feature.get('NOMBRE_EUS'), tipo: "texto" },
          { id: 2, name: "Ezaugarri funtzionalak", atributo: "Iturburuaren izena", i18n: "TIPO_FUENTE", dato: feature.get('NOMFUENTE'), tipo: "texto" },
          { id: 2, name: "Ezaugarri funtzionalak", atributo: "Distantzia errepidera (km)", i18n: "DISTANCIA_CARRETERA", dato: distCarretera, tipo: "float" },
          { id: 2, name: "Ezaugarri funtzionalak", atributo: "Distantzia iturburua (km)", i18n: "DISTANCIA_FUENTE", dato: distFuente, tipo: "float" },
          { id: 2, name: "Ezaugarri funtzionalak", atributo: "Batez besteko altuera (m)", i18n: "ALTURA_MEDIA", dato: feature.get('ALT_MED'), tipo: "entero" },
          { id: 2, name: "Ezaugarri funtzionalak", atributo: "Batez besteko malda", i18n: "PENDIENTE_MEDIA", dato: pendMedia, tipo: "texto" },
          { id: 2, name: "Ezaugarri funtzionalak", atributo: "Batez besteko orientazioa", i18n: "ORIENTACION_MEDIA", dato: nombreORI_MED, tipo: "texto" },
  
  
  
          { id: 3, name: "Litologia eta Ebapotranspirazioa", atributo: "Lur mota", i18n: "TIPO_SUELO", dato: nombreLITOLO, tipo: "texto" },
          { id: 3, name: "Litologia eta Ebapotranspirazioa", atributo: "Lurraren ebapotranspirazio balioak", i18n: "VALORES_EVAPOTRANS_SUELO", dato: nombreEvapo, tipo: "texto" },
  
  
          { id: 4, name: "Hirigintza", atributo: "Jarduera ekonomikoak (%)", i18n: "ACT_ECONOMICAS", dato: feature.get('ACT_ECON'), tipo: "porcentaje" },
          { id: 4, name: "Hirigintza", atributo: "Sistema orokorrak (%)", i18n: "SIST_GENERALES", dato: feature.get('SIST_GEN'), tipo: "porcentaje" },
          { id: 4, name: "Hirigintza", atributo: "Lurzoru urbanizaezina (%)", i18n: "SUELO_NO_URB", dato: feature.get('NO_URBAN'), tipo: "porcentaje" },
          { id: 4, name: "Hirigintza", atributo: "Bizitegirako lurzorua (%)", i18n: "SUELO_RESIDENCIONAL", dato: feature.get('RESI'), tipo: "porcentaje" },
  
          { id: 5, name: "Baso inbentarioa", atributo: "Landarerik gabekoak (%)", i18n: "AFLORAMIENTOS_ROC", dato: feature.get('AFLOR'), tipo: "porcentaje" },
          { id: 5, name: "Baso inbentarioa", atributo: "Sastrakak (%)", i18n: "ARBUSTEDOS", dato: feature.get('ARBUS'), tipo: "porcentaje" },
          { id: 5, name: "Baso inbentarioa", atributo: "Baso naturala (%)", i18n: "BOSQUE", dato: feature.get('BOS_11'), tipo: "porcentaje" },
          { id: 5, name: "Baso inbentarioa", atributo: "Energia (%)", i18n: "ENERGIA", dato: feature.get('ENERGIA'), tipo: "porcentaje" },
          { id: 5, name: "Baso inbentarioa", atributo: "Ekipamenduak (%)", i18n: "EQUIPAMIENTO", dato: feature.get('EQUIP'), tipo: "porcentaje" },
          { id: 5, name: "Baso inbentarioa", atributo: "Larrea (%)", i18n: "HERBAZAL", dato: feature.get('HERBAZ'), tipo: "porcentaje" },
  
          { id: 5, name: "Baso inbentarioa", atributo: "Urmaela (%)", i18n: "LAGUNAS", dato: feature.get('LAGUNA'), tipo: "porcentaje" },
          { id: 5, name: "Baso inbentarioa", atributo: "Padura (%)", i18n: "MARISMAS", dato: feature.get('MARISMA'), tipo: "porcentaje" },
          { id: 5, name: "Baso inbentarioa", atributo: "Nekazaritza (%)", i18n: "MOSAICO_AGRIC", dato: feature.get('MOSAICO'), tipo: "porcentaje" },
          { id: 5, name: "Baso inbentarioa", atributo: "Artifiziala (%)", i18n: "O_SUPERF_ARTIF", dato: feature.get('ARTIF'), tipo: "porcentaje" },
          { id: 5, name: "Baso inbentarioa", atributo: "Hezetasunak eta ura (%)", i18n: "PANTANO", dato: feature.get('PANTANO'), tipo: "porcentaje" },
          { id: 5, name: "Baso inbentarioa", atributo: "Sastraka (%)", i18n: "PASTIZAL_MATORRAL", dato: feature.get('MATORRAL'), tipo: "porcentaje" },
          { id: 5, name: "Baso inbentarioa", atributo: "Zelaiak (%)", i18n: "PRADOS", dato: feature.get('PRADO'), tipo: "porcentaje" },
          { id: 5, name: "Baso inbentarioa", atributo: "Zelaia heskaiekin (%)", i18n: "PRADOS_SETOS", dato: feature.get('P_SETO'), tipo: "porcentaje" },
          { id: 5, name: "Baso inbentarioa", atributo: "Ibaiertzeko basoa (%)", i18n: "BOSQUES_D_GALERIA", dato: feature.get('B_GAL'), tipo: "porcentaje" },
          { id: 5, name: "Baso inbentarioa", atributo: "Telekomunikazioak (%)", i18n: "TELECOMUNICACIONES", dato: feature.get('TELECOM'), tipo: "porcentaje" },
          { id: 5, name: "Baso inbentarioa", atributo: "Landatze basoa (%)", i18n: "BOSQUES_D_PLANTACION", dato: feature.get('B_PLA'), tipo: "porcentaje" },
        
          { id: 5, name: "Baso inbentarioa", atributo: "Ur-lasterrak (%)", i18n: "CURSOS_D_AGUA", dato: feature.get('CUR_AGU'), tipo: "porcentaje" },
          { id: 5, name: "Baso inbentarioa", atributo: "Laborea (%)", i18n: "CULTIVOS", dato: feature.get('CULTI'), tipo: "porcentaje" },
  
  
          { id: 6, name: "SIGPAC lur erabilerak", atributo: "Ur korronteak eta azalerak (%)", i18n: "CORRIENTES_AGUA_SUPERF", dato: feature.get('AG'), tipo: "porcentaje" },
          { id: 6, name: "SIGPAC lur erabilerak", atributo: "Bideak (%)", i18n: "BIALAK", dato: feature.get('CA'), tipo: "porcentaje" },
          { id: 6, name: "SIGPAC lur erabilerak", atributo: "Eraikuntza (%)", i18n: "EDIFICIOS", dato: feature.get('ED'), tipo: "porcentaje" },
          { id: 6, name: "SIGPAC lur erabilerak", atributo: "Basoa (%)", i18n: "FORESTAL", dato: feature.get('FO'), tipo: "porcentaje" },
          { id: 6, name: "SIGPAC lur erabilerak", atributo: "Fruta/arbolak (%)", i18n: "FRUTALES", dato: feature.get('FY'), tipo: "porcentaje" },
          { id: 6, name: "SIGPAC lur erabilerak", atributo: "Ez emankorra (%)", i18n: "IMPRODUCTIVOS", dato: feature.get('IM'), tipo: "porcentaje" },
          { id: 6, name: "SIGPAC lur erabilerak", atributo: "Negutegi eta plastiko azpiko laborea (%)", i18n: "INVERNADERO", dato: feature.get('IV'), tipo: "porcentaje" },
          { id: 6, name: "SIGPAC lur erabilerak", atributo: "Zuhaixka erako larrea (%)", i18n: "PASTO_ARBUSTOS", dato: feature.get('PR'), tipo: "porcentaje" },
          { id: 6, name: "SIGPAC lur erabilerak", atributo: "Larrea arboladiarekin (%)", i18n: "PASTO_ARBOLES", dato: feature.get('PA'), tipo: "porcentaje" },
          { id: 6, name: "SIGPAC lur erabilerak", atributo: "Lur goldagarria (%)", i18n: "TIERRAS_ARABLES", dato: feature.get('TA'), tipo: "porcentaje" },
          { id: 6, name: "SIGPAC lur erabilerak", atributo: "Larrea (%)", i18n: "PASTIZAL", dato: feature.get('PS'), tipo: "porcentaje" },
          { id: 6, name: "SIGPAC lur erabilerak", atributo: "Baratzea (%)", i18n: "HUERTO", dato: feature.get('TH'), tipo: "porcentaje" },
          { id: 6, name: "SIGPAC lur erabilerak", atributo: "Mahastia (%)", i18n: "VINEDOS", dato: feature.get('VI'), tipo: "porcentaje" },
          { id: 6, name: "SIGPAC lur erabilerak", atributo: "Hiri eremua (%)", i18n: "ZONA_URBANA", dato: feature.get('ZU'), tipo: "porcentaje" },
  
  
        ];
      } else {
        datosGenerales = "Datos generales";
        data = [
  
          { id: 1, name: "Datos generales", atributo: "Municipio", i18n: "MUNICIPIOS", dato: mun, tipo: "texto" },
          { id: 1, name: "Datos generales", atributo: "Poligono", i18n: "POLIGONO", dato: feature.get('POLIGONO'), tipo: "entero" },
          { id: 1, name: "Datos generales", atributo: "Parcela", i18n: "PARCELA", dato: parseInt(feature.get('PARCELA')), tipo: "entero" },
          { id: 1, name: "Datos generales", atributo: "Superficie (m2)", i18n: "AREA_M2", dato: feature.get('POLY_AREA'), tipo: "m2" },
          { id: 1, name: "Datos generales", atributo: "Coordenada X (m)", i18n: "COORD_X", dato: feature.get('INSIDE_X'), tipo: "float" },
          { id: 1, name: "Datos generales", atributo: "Coordenada Y (m)", i18n: "COORD_Y", dato: feature.get('INSIDE_Y'), tipo: "float" },
  
  
          { id: 2, name: "Características funcionales", atributo: "Tipo carretera", i18n: "NOMBRE_CARRETERA", dato: feature.get('NOMBRE_CAS'), tipo: "texto" },
          { id: 2, name: "Características funcionales", atributo: "Nombre fuente", i18n: "TIPO_FUENTE", dato: feature.get('NOMFUENTE'), tipo: "texto" },
          { id: 2, name: "Características funcionales", atributo: "Distancia carretera (km)", i18n: "DISTANCIA_CARRETERA", dato: distCarretera, tipo: "float" },
          { id: 2, name: "Características funcionales", atributo: "Distancia fuente (km)", i18n: "DISTANCIA_FUENTE", dato: distFuente, tipo: "float" },
          { id: 2, name: "Características funcionales", atributo: "Altura media (m)", i18n: "ALTURA_MEDIA", dato: feature.get('ALT_MED'), tipo: "entero" },
          { id: 2, name: "Características funcionales", atributo: "Pendiente media", i18n: "PENDIENTE_MEDIA", dato: pendMedia, tipo: "texto" },
          { id: 2, name: "Características funcionales", atributo: "Orientación media", i18n: "ORIENTACION_MEDIA", dato: nombreORI_MED, tipo: "texto" },
  
  
  
          { id: 3, name: "Litología y evapotranspiración", atributo: "Tipo de suelo", i18n: "TIPO_SUELO", dato: nombreLITOLO, tipo: "texto" },
          { id: 3, name: "Litología y evapotranspiración", atributo: "Valores de la evapotranspiración", i18n: "VALORES_EVAPOTRANS_SUELO", dato: nombreEvapo, tipo: "texto" },
  
  
          { id: 4, name: "Urbanismo", atributo: "Actividades económicas (%)", i18n: "ACT_ECONOMICAS", dato: feature.get('ACT_ECON'), tipo: "porcentaje" },
          { id: 4, name: "Urbanismo", atributo: "Sistemas generales (%)", i18n: "SIST_GENERALES", dato: feature.get('SIST_GEN'), tipo: "porcentaje" },
          { id: 4, name: "Urbanismo", atributo: "Suelo no urbanizable (%)", i18n: "SUELO_NO_URB", dato: feature.get('NO_URBAN'), tipo: "porcentaje" },
          { id: 4, name: "Urbanismo", atributo: "Suelo residencial (%)", i18n: "SUELO_RESIDENCIONAL", dato: feature.get('RESI'), tipo: "porcentaje" },
  
          { id: 5, name: "Inventario Bosques", atributo: "Afloramientos rocosos (%)", i18n: "AFLORAMIENTOS_ROC", dato: feature.get('AFLOR'), tipo: "porcentaje" },
          { id: 5, name: "Inventario Bosques", atributo: "Arbustedos (%)", i18n: "ARBUSTEDOS", dato: feature.get('ARBUS'), tipo: "porcentaje" },
          { id: 5, name: "Inventario Bosques", atributo: "Bosques (%)", i18n: "BOSQUE", dato: feature.get('BOS_11'), tipo: "porcentaje" },
          { id: 5, name: "Inventario Bosques", atributo: "Energía (%)", i18n: "ENERGIA", dato: feature.get('ENERGIA'), tipo: "porcentaje" },
          { id: 5, name: "Inventario Bosques", atributo: "Equipamiento/ dotacional (%)", i18n: "EQUIPAMIENTO", dato: feature.get('EQUIP'), tipo: "porcentaje" },
          { id: 5, name: "Inventario Bosques", atributo: "Herbazal-Pastizal (%)", i18n: "HERBAZAL", dato: feature.get('HERBAZ'), tipo: "porcentaje" },
          { id: 5, name: "Inventario Bosques", atributo: "Lagunas (%)", i18n: "LAGUNAS", dato: feature.get('LAGUNA'), tipo: "porcentaje" },
          { id: 5, name: "Inventario Bosques", atributo: "Marismas (%)", i18n: "MARISMAS", dato: feature.get('MARISMA'), tipo: "porcentaje" },
          { id: 5, name: "Inventario Bosques", atributo: "Mosaico agrícola (%)", i18n: "MOSAICO_AGRIC", dato: feature.get('MOSAICO'), tipo: "porcentaje" },
          { id: 5, name: "Inventario Bosques", atributo: "Artificiales (%)", i18n: "O_SUPERF_ARTIF", dato: feature.get('ARTIF'), tipo: "porcentaje" },
          { id: 5, name: "Inventario Bosques", atributo: "Pantano, embalse (%)", i18n: "PANTANO", dato: feature.get('PANTANO'), tipo: "porcentaje" },
          { id: 5, name: "Inventario Bosques", atributo: "Pastizal-Matorral (%)", i18n: "PASTIZAL_MATORRAL", dato: feature.get('MATORRAL'), tipo: "porcentaje" },
          { id: 5, name: "Inventario Bosques", atributo: "Prados (%)", i18n: "PRADOS", dato: feature.get('PRADO'), tipo: "porcentaje" },
          { id: 5, name: "Inventario Bosques", atributo: "Prados con setos (%)", i18n: "PRADOS_SETOS", dato: feature.get('P_SETO'), tipo: "porcentaje" },
          { id: 5, name: "Inventario Bosques", atributo: "Bosques de Galería (%)", i18n: "BOSQUES_D_GALERIA", dato: feature.get('B_GAL'), tipo: "porcentaje" },
          { id: 5, name: "Inventario Bosques", atributo: "Telecomunicaciones (%)", i18n: "TELECOMUNICACIONES", dato: feature.get('TELECOM'), tipo: "porcentaje" },
          { id: 5, name: "Inventario Bosques", atributo: "Bosques de Plantación (%)", i18n: "BOSQUES_D_PLANTACION", dato: feature.get('B_PLA'), tipo: "porcentaje" },
          { id: 5, name: "Inventario Bosques", atributo: "Cursos de agua (%)", i18n: "CURSOS_D_AGUA", dato: feature.get('CUR_AGU'), tipo: "porcentaje" },
          { id: 5, name: "Inventario Bosques", atributo: "Cultivos (%)", i18n: "CULTIVOS", dato: feature.get('CULTI'), tipo: "porcentaje" },
  
  
          { id: 6, name: "SIGPAC usos suelo", atributo: "Corrientes y superficies de agua (%)", i18n: "CORRIENTES_AGUA_SUPERF", dato: feature.get('AG'), tipo: "porcentaje" },
          { id: 6, name: "SIGPAC usos suelo", atributo: "Viales (%)", i18n: "BIALAK", dato: feature.get('CA'), tipo: "porcentaje" },
          { id: 6, name: "SIGPAC usos suelo", atributo: "Edificaciones (%)", i18n: "EDIFICIOS", dato: feature.get('ED'), tipo: "porcentaje" },
          { id: 6, name: "SIGPAC usos suelo", atributo: "Forestal (%)", i18n: "FORESTAL", dato: feature.get('FO'), tipo: "porcentaje" },
          { id: 6, name: "SIGPAC usos suelo", atributo: "Frutales (%)", i18n: "FRUTALES", dato: feature.get('FY'), tipo: "porcentaje" },
          { id: 6, name: "SIGPAC usos suelo", atributo: "Improductivos (%)", i18n: "IMPRODUCTIVOS", dato: feature.get('IM'), tipo: "porcentaje" },
          { id: 6, name: "SIGPAC usos suelo", atributo: "Invernadero y cultivo bajo plástico (%)", i18n: "INVERNADERO", dato: feature.get('IV'), tipo: "porcentaje" },
          { id: 6, name: "SIGPAC usos suelo", atributo: "Prado arbustivo (%)", i18n: "PASTO_ARBUSTOS", dato: feature.get('PR'), tipo: "porcentaje" },
          { id: 6, name: "SIGPAC usos suelo", atributo: "Prado con arbolado (%)", i18n: "PASTO_ARBOLES", dato: feature.get('PA'), tipo: "porcentaje" },
          { id: 6, name: "SIGPAC usos suelo", atributo: "Tierras arables (%)", i18n: "TIERRAS_ARABLES", dato: feature.get('TA'), tipo: "porcentaje" },
          { id: 6, name: "SIGPAC usos suelo", atributo: "Pastizal (%)", i18n: "PASTIZAL", dato: feature.get('PS'), tipo: "porcentaje" },
          { id: 6, name: "SIGPAC usos suelo", atributo: "Huerta (%)", i18n: "HUERTO", dato: feature.get('TH'), tipo: "porcentaje" },
          { id: 6, name: "SIGPAC usos suelo", atributo: "Viñedo (%)", i18n: "VINEDOS", dato: feature.get('VI'), tipo: "porcentaje" },
          { id: 6, name: "SIGPAC usos suelo", atributo: "Zona urbana (%)", i18n: "ZONA_URBANA", dato: feature.get('ZU'), tipo: "porcentaje" },
  
  
        ];
      }
  
  
  
      tableInfo = new Tabulator("#tabla-info", {
        data: data,
        //layout:"fitColumns",
  
        tooltips: true,
        groupBy: "name",
        groupStartOpen: function (value) {
  
          return value == datosGenerales; //Para que nos abra por defecto el grupo de Datos generales
        },
        //columnCalcs: "both",
        columns: [
          { title: "Name", field: "name", visible: false, download: false },
          {
            title: "", field: "atributo", visible: true, width: 200, formatter: function (cell, formatterParams) {
              //console.log(cell._cell.row.data.i18n)
              var lang_tag = cell._cell.row.data.i18n;
              var value = cell.getValue();
              return "<span style='font-weight:bold;' data-i18n='" + lang_tag + "'>" + value + "</span>";
            }
          },
          // { title: "", field: "dato", visible: true, width: 150, formatter: "money", formatterParams: { decimal: ",", thousand: "." } }
  
          {
            title: "", field: "dato", visible: true, width: 150, formatter: function (cell, formatterParams) {
              var dato;
              var value = cell.getValue();
              var tipo = cell._cell.row.data.tipo;
              if (value == null) {
                value = "-"
                tipo = "texto";
              }
              switch (tipo) {
                case 'texto':
                  dato = value;
                  break;
                case 'entero':
                  dato = value;
                  break;
                case 'float':
                  if (typeof value === "string") {
                    dato = value;
                  } else {
                    dato = parseFloat(value).toFixed(2);
                  }
  
                  break;
                case 'porcentaje':
                  dato = parseFloat(value).toFixed(2);
                  dato = dato + " %";
                  break;
                case 'm2':
                  dato = parseFloat(value).toFixed(2);
                  var dato = new Intl.NumberFormat('es-ES').format(dato);
                  dato = dato + " m2";
                  break;
                default:
                  break;
              }
  
              return dato;
            }
          },
  
  
          // { title: "", field: "foto", visible: true, width: 150 },
        ],
        langs: {
          "es": {
           /* "columns": {
              "POLIGONO": "POLIGONO",
              "PARCELA": "PARCELA",
              "DN_SURFACE": "DN_SURFACE",
              "PERIMETER": "PERIMETER",
              "USO": "USO",
              "coordinates": "coordinates",
            }*/
          },
          "eu": {
           /* "columns": {
              "POLIGONO": "Poligonoa",
              "PARCELA": "Partzela",
              "DN_SURFACE": "Azalera",
              "PERIMETER": "Perimetroa",
              "USO": "Uso",
              "coordinates": "coordinates",
            }*/
          },
        },
  
      });
      tableInfo.columnManager.headersElement.hidden = true;
      $(".tabulator-group-toggle").css("display", "inline");
  
  
  
  
  
  
    } else {
      $("#info").empty()
      $("#info").append('<p id="info_click" data-i18n="MENSAJE_CLICK_MAPA">Para ver la ficha de una parcela haga click en la PARCELA en el mapa</p>');
    //MENSAJE_CLICK_MAPA_SUBPARCELA
      feature=undefined;
      tableInfo.destroy();
  
    }
  } catch (error) {
    $("#info").empty()
    
    $("#info").append('<p id="info_click" data-i18n="MENSAJE_CLICK_MAPA">Para ver la ficha de una parcela haga click en la PARCELA en el mapa</p>');
    
  //  $("#info").append('<p id="info_click" data-i18n="MENSAJE_CLICK_MAPA_SUBPARCELA">No hay ficha de la subparcela. Haga click una vez realizada una consulta.</p>');
    feature=undefined;
    tableInfo.destroy();
  }
  


}


function crearPDF(dataUrl,feature) {
  
  var nombreCarretera, nombreFuente, distFuente, pendMedia;
  var fechaD=obtenerfecha(true);
  var fechaDP=obtenerfecha(false);
  
  nombrePDF = feature.get('MUNICIPIO') + '_' + obtenerNombreMunicipio(feature.get('MUNICIPIO')) + '_' + feature.get('PARCELA') + '_' + fechaDP;
  mun=obtenerNombreMunicipio(feature.get('MUNICIPIO'))



   if(origen!="tabla"){
    nombreLITOLO = obtenerNombreLitologia(feature.get('COD_LITOLO'));
    pendMedia = obtenerPendienteMedia(feature.get('PEND_MED'), "med");
    nombreEvapo=obtenerNombreEvapo(feature.get('EVAPO'));
    superf= new Intl.NumberFormat('es-ES').format(feature.get('POLY_AREA'));
    superf = superf + " m2";
    if (feature.get('DIST_FUEN') == -1) distFuente = "-";
    else distFuente =parseFloat(feature.get('DIST_FUEN')).toFixed(2)+" km";
    
    }else{
      nombreLITOLO = feature.get('COD_LITOLO');
    pendMedia = feature.get('PEND_MED')
    nombreEvapo=feature.get('EVAPO');
    superf= new Intl.NumberFormat('es-ES').format(feature.get('POLY_AREA'));
    superf = superf + " m2";
    distFuente =feature.get('DIST_FUEN');
    }
  

  if (currentLng == "eu") {
    nombreCarretera = feature.get('NOMBRE_EUS')
  } else {
    nombreCarretera = feature.get('NOMBRE_CAS')
  }
  if (feature.get('NOMFUENTE') == null) nombreFuente = "-";
  else nombreFuente = feature.get('NOMFUENTE');

  if (feature.get('DIST_CARR') == -1) distCarretera = "-";
  else distCarretera =parseFloat(feature.get('DIST_CARR')).toFixed(2) +" km";
  
  

  defTabla = {
    header: {
      margin: 10,
      columns: [

        {
          fontSize: 8,
          margin: [10, 0, 0, 0],
          text: i18n.t('TITULO_PROYECTO')+'   -   ' +fechaD,
        }
      ],
    },
    content: [{

      margin: 10,
      columns: [
        {
          image: logoUrkiola,
          width: 40
        },
        {
          margin: [10, 0, 20, 30],
          text: i18n.t('TITULO_PROYECTO') ,
        }
      ], style: 'header'


    },
    {
      style: 'tableExample',

      table: {
        color: 'blue',
        heights: 16,
        widths: [220, '*', 220, '*'],
        body: [
          [{ text: i18n.t('DATOS_GENERALES'), style: 'tableHeader', colSpan: 3, alignment: 'center' }, {}, {}],
          [{ colSpan: 3, alignment: 'center', image: dataUrl, width: 400 }, '', ''],
          [{ text: i18n.t('MUNICIPIOS'), style: 'negrita' }, { text:mun  + "", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('POLIGONO'), style: 'negrita' }, { text: feature.get('POLIGONO')+"", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('PARCELA'), style: 'negrita' }, { text: feature.get('PARCELA')+"", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('AREA_M2'), style: 'negrita' }, { text: superf+"", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('COORD_X'), style: 'negrita' }, { text: parseFloat(feature.get('INSIDE_X')).toFixed(2)+" m" , style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('COORD_Y'), style: 'negrita' }, { text: parseFloat(feature.get('INSIDE_Y')).toFixed(2)+" m" , style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],


        ]
      },
      layout: 'lightHorizontalLines'
    },
    {
      style: 'tableExample',

      table: {
        color: 'blue',
        heights: 16,
        widths: [220, '*', 220, '*'],
        body: [
          [{ text: i18n.t('CARACT_FUNCIONALES'), style: 'tableHeader', colSpan: 3, alignment: 'center' }, {}, {}],
          [{ text: i18n.t('CARRETERA'), style: 'negrita' }, { text: nombreCarretera, style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('DISTANCIA_CARRETERA'), style: 'negrita' }, { text: distCarretera + "", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          // [{ text: i18n.t('NOMBRE_CARRETERA'), style: 'negrita' }, { text: feature.get('NOMBRE_CAS')+"", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('TIPO_FUENTE'), style: 'negrita' }, { text: nombreFuente+"", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('DISTANCIA_FUENTE'), style: 'negrita' }, { text: distFuente+"", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('ALTURA_MEDIA'), style: 'negrita' }, { text: feature.get('ALT_MED') + " m", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('PENDIENTE_MEDIA'), style: 'negrita' }, { text: pendMedia + "", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('ORIENTACION_MEDIA'), style: 'negrita' }, { text: feature.get('ORI_MED') + "", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
       
        ]
      },
      layout: 'lightHorizontalLines'
    },
    {
      style: 'tableExample',

      table: {
        color: 'blue',
        heights: 16,
        widths: [220, '*', 220, '*'],
        body: [

          [{ text: i18n.t('LITOLOGIA_EVOTRANS'), style: 'tableHeader', colSpan: 3, alignment: 'center' }, {}, {}],
          [{ text: i18n.t('TIPO_SUELO'), style: 'negrita' }, { text: nombreLITOLO + "", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('VALORES_EVAPOTRANS_SUELO'), style: 'negrita' }, { text: nombreEvapo, style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],

        ]
      },
      layout: 'lightHorizontalLines'
    },
    {
      style: 'tableExample',

      table: {
        color: 'blue',
        heights: 16,
        widths: [220, '*', 220, '*'],
        body: [
          [{ text: i18n.t('CALIFICACION'), style: 'tableHeader', colSpan: 3, alignment: 'center' }, {}, {}],
          [{ text: i18n.t('ACT_ECONOMICAS'), style: 'negrita' }, { text: parseFloat(feature.get('ACT_ECON')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('SIST_GENERALES'), style: 'negrita' }, { text: parseFloat(feature.get('SIST_GEN')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('SUELO_NO_URB'), style: 'negrita' }, { text: parseFloat(feature.get('NO_URBAN')).toFixed(2)+"%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('SUELO_RESIDENCIONAL'), style: 'negrita' }, { text: parseFloat(feature.get('RESI')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],


        ]
      }, layout: 'lightHorizontalLines'
    },
    {
      style: 'tableExample',

      table: {
        color: 'blue',
        heights: 16,
        widths: [220, '*', 220, '*'],
        body: [

          [{ text: i18n.t('INVENTARIO_BOSQUE'), style: 'tableHeader', colSpan: 3, alignment: 'center' }, {}, {}],
          [{ text: i18n.t('AFLORAMIENTOS_ROC'), style: 'negrita' }, { text: parseFloat(feature.get('AFLOR')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('ARBUSTEDOS'), style: 'negrita' }, { text: parseFloat(feature.get('ARBUS')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('BOSQUE'), style: 'negrita' }, { text: parseFloat(feature.get('BOS_11')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('ENERGIA'), style: 'negrita' }, { text: parseFloat(feature.get('ENERGIA')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('EQUIPAMIENTO'), style: 'negrita' }, { text: parseFloat(feature.get('EQUIP')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('HERBAZAL'), style: 'negrita' }, { text: parseFloat(feature.get('HERBAZ')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],

          [{ text: i18n.t('LAGUNAS'), style: 'negrita' }, { text: parseFloat(feature.get('LAGUNA')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('MARISMAS'), style: 'negrita' }, { text: parseFloat(feature.get('MARISMA')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('MOSAICO_AGRIC'), style: 'negrita' }, { text: parseFloat(feature.get('MOSAICO')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('O_SUPERF_ARTIF'), style: 'negrita' }, { text: parseFloat(feature.get('ARTIF')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('PANTANO'), style: 'negrita' }, { text: parseFloat(feature.get('PANTANO')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('PASTIZAL_MATORRAL'), style: 'negrita' }, { text: parseFloat(feature.get('MATORRAL')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('PRADOS'), style: 'negrita' }, { text: parseFloat(feature.get('PRADO')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('PRADOS_SETOS'), style: 'negrita' }, { text: parseFloat(feature.get('P_SETO')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
 
          [{ text: i18n.t('BOSQUES_D_GALERIA'), style: 'negrita' }, { text: parseFloat(feature.get('B_GAL')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('BOSQUES_D_PLANTACION'), style: 'negrita' }, { text: parseFloat(feature.get('B_PLA')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
        
       
          [{ text: i18n.t('CURSOS_D_AGUA'), style: 'negrita' }, { text: parseFloat(feature.get('CUR_AGU')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('CULTIVOS'), style: 'negrita' }, { text: parseFloat(feature.get('CULTI')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],


        ],
      }, layout: 'lightHorizontalLines'
    },
    {
      style: 'tableExample',

      table: {
        color: 'blue',
        heights: 16,
        widths: [220, '*', 220, '*'],
        body: [
          [{ text: i18n.t('SIGPAC'), style: 'tableHeader', colSpan: 3, alignment: 'center' }, {}, {}],
          [{ text: i18n.t('CORRIENTES_AGUA_SUPERF'), style: 'negrita' }, { text: parseFloat(feature.get('AG')).toFixed(2)+"%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('BIALAK'), style: 'negrita' }, { text: parseFloat(feature.get('CA')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('EDIFICIOS'), style: 'negrita' }, { text: parseFloat(feature.get('ED')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('FORESTAL'), style: 'negrita' }, { text: parseFloat(feature.get('FO')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('FRUTALES'), style: 'negrita' }, { text: parseFloat(feature.get('FY')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('IMPRODUCTIVOS'), style: 'negrita' }, { text: parseFloat(feature.get('IM')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('INVERNADERO'), style: 'negrita' }, { text: parseFloat(feature.get('IV')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('PASTO_ARBUSTOS'), style: 'negrita' }, { text: parseFloat(feature.get('PR')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('PASTO_ARBOLES'), style: 'negrita' }, { text: parseFloat(feature.get('PA')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('TIERRAS_ARABLES'), style: 'negrita' }, { text: parseFloat(feature.get('TA')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('PASTIZAL'), style: 'negrita' }, { text: parseFloat(feature.get('PS')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('HUERTO'), style: 'negrita' }, { text: parseFloat(feature.get('TH')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('VINEDOS'), style: 'negrita' }, { text: parseFloat(feature.get('VI')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],
          [{ text: i18n.t('ZONA_URBANA'), style: 'negrita' }, { text: parseFloat(feature.get('ZU')).toFixed(2) + "%", style: 'tableBody', colSpan: 2, alignment: 'center' }, ''],

        ],
      }, layout: 'lightHorizontalLines'
    },

    ],

    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'left',
        margin: [0, 10, 0, 50],
        color: "#01599d",
        fillColor: '#dddddd',
      },
      tableHeader: {
        alignment: 'left',
        color: "white",
        fillColor: '#01599d',
        bold: true,

      },
      tableBody: {
        alignment: 'center',
        color: "#01599d",
        fontSize: 10
      },
      subheader: {
        fontSize: 14
      },
      superMargin: {
        margin: [20, 0, 40, 0],
        fontSize: 15
      },
      negrita: {
        bold: true,
        fillColor: '#f5f5f5',
        margin: [20, 2, 0, 0],
        fontSize: 10
      },
      tableExample: {
        margin: [20, 10, 0, 20]
      },
    }

  }
  return defTabla;

}

function obtenerImagen() {
  var domImagen = "";
  try {
    //domtoimage.toPng(document.getElementById('map'))
    domImagen = domtoimage.toPng(document.getElementsByClassName('ol-unselectable ol-layers')[0])
      .then(function (dataUrl) {
        //  console.log(dataUrl)
        return dataUrl;
      });
  } catch (error) {
    console.log(error)

  }


  return domImagen;

}

function imagenLogo() {
  imgToBase64('assets/images/logourkiola.png', function (base64) {
    base64Img = base64;
    logoUrkiola = base64Img;
  });
}

function obtenerfecha(separacion) {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  if(separacion){
    today = dd + '/' + mm + '/' + yyyy;
  }else{
    today = dd + '' + mm + '' + yyyy;
  }
  

  
  return today;
}

function imgToBase64(src, callback) {
  var outputFormat = src.substr(-3) === 'png' ? 'image/png' : 'image/jpeg';
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function () {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var dataURL;
    canvas.height = this.naturalHeight;
    canvas.width = this.naturalWidth;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL(outputFormat);
    callback(dataURL);
  };
  img.src = src;
  if (img.complete || img.complete === undefined) {
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    img.src = src;
  }
}
function ventanaErrorCaptura(msgError) {
  jsPanel.modal.create({
    theme: 'danger',
    closeOnBackdrop: false,
    id: "panelError",
    headerTitle: 'ERROR',
    headerLogo: "<span style='margin-left:8px;'><i class='fa fa-exclamation-triangle' aria-hidden='true'></i></span>",
    headerControls: {
      maximize: 'remove',
      minimize: 'remove',
      smallify: 'remove',
    },
    panelSize: {
      width: 250,
      height: 130
    },
    position: 'center 50 50',
    borderRadius: '0.5rem',
    content: "<div class='panelError'><p><span class='negrita'>Error:</span><ul class='txtError'><li> No se pudo realizar la captura. No tiene permisos para esa capa.</li></ul></p>" + msgError + "</div>",
    boxShadow: 5,

  });
}
