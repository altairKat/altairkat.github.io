var panelTabla;
var coordPrueba;
var geojsonObject;
var table;
var pruebaJsonDatos = [];
var filtradas;
var vectorOVER;
var rowt;

function crearPanelTabla(filtradas) {

    $("#tablaComponente").append('<div id="table"></div>');


    $("#table").append('<div class="table-switch">' +
        '<div id="allColumns" class="table-btn active" data-i18n="TODO"> Todo </div>' +
        '<div id="generalColumns" class="table-btn " data-i18n="GENERAL"> General </div>' +
        '</div>' +
        '<div id="tabla"></div>');
    if (panelTabla == undefined) {


        panelTabla = jsPanel.create({
            theme: 'primary',
            headerTitle: 'tabla',
            headerControls: {
                maximize: 'remove'
            },
            position: 'center-bottom',
            panelSize: {
                width: () => window.innerWidth * 0.9,
                height: 390
            },
            // contentSize: 'auto',
            /*  contentSize: {
               width:  window.innerWidth * 0.9,
               height: window.innerHeight * 0.8
           },*/
            dragit: {
                containment: [60, 20, 20, 20]
            },

            content: document.getElementById("table"),
            borderRadius: '0.5rem',
            boxShadow: 5,
            maximizedMargin: 60,
            footerToolbar: '<span style="flex:1 1 auto"></span>' +
                '<span id="btn-descargar"  class="jsPanel-ftr-btn" title="Descargas"><i  class="fa fa-download" aria-hidden="true" style="padding: 0.25rem;  cursor: pointer;"></i></span>',
            callback: function (panel) {
                this.content.style.padding = '20px';
                panel.footer.querySelectorAll('.jsPanel-ftr-btn').forEach(function (btn) {
                    btn.style.marginLeft = '6px';
                    btn.style.cursor = 'pointer';
                });
                // handlers for the toolbar items like:
                jsPanel.pointerup.forEach(function (evt) {
                    panel.footer.querySelector('#btn-descargar').addEventListener(evt, function () {

                        //table.download("json", "data.json");
                    });
                    // panel.footer.querySelector('#btn-csv').addEventListener(evt, function () {
                    //     descargarCSV();
                    // });
                });
            },
            onclosed: function (panel, closedByUser) {
                panelTabla = undefined;
                map.removeLayer(vectorOVER);
            },
            resizeit: {
                maxWidth: window.innerWidth * 0.95,
                maxHeight: window.innerHeight * 0.8,
                stop: (panel, paneldata, event) => {
                    // console.log(paneldata.height) 

                    var sizeP = parseInt((paneldata.height - 214) / 25)
                    table.setPageSize(sizeP)
                }
            }
            //headerControls: 'closeonly'
        });
        crearTabla(filtradas);

        $('#btn-descargar').attr("title", i18n.t("DESCARGAS"));





    } else {
        panelTabla.normalize();
    }
    cambiarIdioma(currentLng);

}

var f;
var pageSize = 1;
function crearTabla(filtradas) {

    //Crear tabla de la consulta realizada
    table = new Tabulator("#tabla", {
        // height: "500px",//"311px",
        layout: "fitColumns",
        pagination: "local",
        tooltips: true,

        selectable: 1,
        paginationSize: 3,
        paginationSizeSelector: [7, 10, 20, 30],
        reactiveData: true, //turn on data reactivity
        data: filtradas,
        paginationAddRow: "a",

        rowClick: function (e, row) {

            $("#info").empty()
            $("#info").append('<div id="tabla-info"></div>');
            $("#info").append('<p id="info_click" data-i18n="MENSAJE_CLICK_MAPA"></p>');

            if (tableInfo != undefined) {
                cambiarIdioma(currentLng);
                feature = undefined;
                tableInfo.destroy();
            }
            origen="tabla";
            quitarOverlay(feature);
            // console.log(row._row.data)
            // table.deselectRow();
            var coord = row._row.data.coordinates[0][0];
            coordPrueba = row._row.data.coordinates;

            var ext = ol.extent.boundingExtent(coord);
            ext = ol.proj.transformExtent(ext, ol.proj.get('EPSG:4326'), ol.proj.get('EPSG:3857'));
            map.getView().fit(ext, map.getSize());
            rowt = row._row.data;
           // console.log(row._row.data);
            var pixel = map.getPixelFromCoordinate(ext);
            // console.log(pixel);
            pixel = [parseInt(pixel[0]), parseInt(pixel[1])]
            // //console.log(pixel)

            resaltarPoligono(pixel)


            //UN ZOOM MENOS
            var zoomEXT = map.getView().getZoom() - 1;
            map.getView().setZoom(zoomEXT)


        },
        columns: columnasTablaConsulta,
        langs: {
            "es": { //French language definition
                "columns": {
                    "NOM_MUNICIPIO": "Municipio",
                    "POLIGONO": "Polígono",
                    "PARCELA": "Parcela",
                    "INSIDE_X": "Coordenada X (m)",
                    "INSIDE_Y": "Coordenada Y (m)",
                    "POLY_AREA": "Superficie (m2)",
                    "NOMBRE_CAS": "Nombre Carretera",
                    "NOMBRE_EUS": "Errepide izena",
                    "COD_LITOLO": "Cod. Litologia",
                    "EVAPO": "Evapotranspiración",

                    "CODIGO_CAR": "Codigo carretera",
                    "NOMFUENTE": "Nombre fuente",
                    "CODIGO_FUE": "Codigo fuente",
                    "DIST_FUEN": "Distancia fuente (km)",
                    "coordinates": "coordinates",
                    "DIST_CARR": "Distancia carretera (km)",


                    "PEND_MAX": "Pendiente máxima (%)",
                    "PEND_MIN": "Pendiente mínima (%)",
                    "PEND_MED": "Pendiente media (%)",
                    "ALT_MAX": "Altura máxima (m)",
                    "ALT_MIN": "Altura mínima (m)",
                    "ALT_MED": "Altura media (m)",
                    "ORI_MED": "Orientación media",


                    "ACT_ECON": "Actividades económicas (%)",
                    "SIST_GEN": "Sistemas generales (%)",
                    "NO_URBAN": "Suelo no urbanizable (%)",
                    "RESI": "Suelo residencial (%)",

                    "BOS_11": "Bosques (%)",
                    "AFLOR": "Afloramientos rocosos (%)",
                    "ARBUS": "Arbustedos (%)",
                    "B_GAL": "Bosques de Galería (%)",
                    "B_PLA": "Bosques de Plantación (%)",
                    "CANCH": "Canchales (%)",
                    "CULTIVOS": "Cultivos (%)",
                    "CUR_AGU": "Cursos de agua (%)",
                    "ENERGIA": "Energía (%)",
                    "EQUIP": "Equipamiento/ dotacional (%)",
                    "HERBAZ": "Herbazal-Pastizal (%)",
                    "LAGUNA": "Lagunas (%)",
                    "MARISMA": "Marismas (%)",
                    "MOSAICO": "Mosaico agrícola (%)",
                    "PANTANO": "Pantano, embalse (%)",
                    "MATORRAL": "Pastizal-Matorral (%)",
                    "PRADO": "Prados (%)",
                    "P_SETO": "Prados con setos (%)",
                    "TELECOM": "Telecomunicaciones (%)",
                    "ZONA_P": "Zonas pantanosas (%)",
                    "ARTIF": "Artificiales (%)",
                    "CULTI": "Cultivos (%)",

                    "AG": "Corrientes y superficies de agua (%)",
                    "CA": "Viales (%)",
                    "ED": "Edificaciones (%)",
                    "FO": "Forestal (%)",
                    "FY": "Frutales (%)",
                    "IM": "Improductivos (%)",
                    "IV": "Invernadero y cultivo bajo plástico (%)",

                    "PA": "Prado con arbolado (%)",
                    "PR": "Prado arbustivo (%)",
                    "PS": "Pastizal (%)",
                    "TA": "Tierras arables (%)",

                    "TH": "Huerta (%)",
                    "VI": "Viñedo (%)",
                    "ZU": "Zona urbana (%)",


                },
                "pagination": {
                    "first": "<<",
                    "first_title": "<",
                    "last": ">>",
                    "last_title": ">>",
                    "prev": "<",
                    "prev_title": "<",
                    "next": ">",
                    "next_title": ">",
                    "all": "",
                },

            },
            "eu": { //Euskera
                "columns": {

                    "NOM_MUNICIPIO": "Udalerria",
                    "POLIGONO": "Poligonoa",
                    "PARCELA": "Partzela",
                    "INSIDE_X": "X koordenatua (m)",
                    "INSIDE_Y": "Y koordenatua (m)",
                    "POLY_AREA": "Azalera (m2)",
                    "NOMBRE_CAS": "Errepide izena",
                    "NOMBRE_EUS": "Errepide izena",
                    "COD_LITOLO": "Litologia kodea",
                    "EVAPO": "Ebapotranspiración",

                    "CODIGO_CAR": "Errepide kodea",
                    "NOMFUENTE": "Iturburuaren izena",
                    "CODIGO_FUE": "Iturburuaren kodea",
                    "DIST_FUEN": "Distantzia iturburua (km)",
                    "coordinates": "coordinates",
                    "DIST_CARR": "Distantzia errepidera (km)",

                    "PEND_MAX": "Gehienezko malda (%)",
                    "PEND_MIN": "Gutxienezko malda (%)",
                    "PEND_MED": "Batez besteko malda (%)",
                    "ALT_MAX": "Gehienezko altitudea (m)",
                    "ALT_MIN": "Gutxienezko altitudea (m)",
                    "ALT_MED": "Batez besteko altuera (m)",
                    "ORI_MED": "Batez besteko orientazioa",


                    "ACT_ECON": "Jarduera ekonomikoak (%)",
                    "SIST_GEN": "Sistema orokorrak (%)",
                    "NO_URBAN": "Lurzoru urbanizaezina (%)",
                    "RESI": "Bizitegirako lurzorua (%)",

                    "BOS_11": "Baso naturala (%)",
                    "AFLOR": "Landarerik gabekoak (%)",
                    "ARBUS": "Sastrakak (%)",
                    "B_GAL": "Ibaiertzeko basoa (%)",
                    "B_PLA": "Landatze basoa (%)",
                    "CANCH": "Canchales (%)",
                    "CULTIVOS": "Laborea (%)",
                    "CUR_AGU": "Ur-lasterrak (%)",
                    "ENERGIA": "Energia (%)",
                    "EQUIP": "Ekipamenduak (%)",
                    "HERBAZ": "Larrea (%)",
                    "LAGUNA": "Urmaela (%)",
                    "MARISMA": "Padura (%)",
                    "MOSAICO": "Nekazaritza (%)",
                    "PANTANO": "Hezetasunak eta ura (%)",
                    "MATORRAL": "Sastraka (%)",
                    "PRADO": "Zelaiak (%)",
                    "P_SETO": "Zelaia heskaiekin (%)",
                    "TELECOM": "Telekomunikazioak (%)",
                    "ZONA_P": "Padura eremuak (%)",
                    "ARTIF": "Artifiziala (%)",
                    "CULTI": "Laborea (%)",

                    "AG": "Ur korronteak eta azalerak (%)",
                    "CA": "Bideak (%)",
                    "ED": "Eraikuntza (%)",
                    "FO": "Basoa (%)",
                    "FY": "Fruta/arbolak (%)",
                    "IM": "Ez emankorra (%)",
                    "IV": "Negutegi eta plastiko azpiko laborea (%)",

                    "PA": "Larrea arboladiarekin (%)",
                    "PR": "Zuhaixka erako larrea (%)",
                    "PS": "Larrea (%)",
                    "TA": "Lur goldagarria (%)",

                    "TH": "Baratzea (%)",
                    "VI": "Mahastia (%)",
                    "ZU": "Hiri eremua (%)",



                },
                "pagination": {
                    "first": "<<",
                    "first_title": "<",
                    "last": ">>",
                    "last_title": ">>",
                    "prev": "<",
                    "prev_title": "<",
                    "next": ">",
                    "next_title": ">",
                    "all": "",
                },
            },
        },

        dataLoaded: function (data, table) {

            if (data.length >= 7) {
                pageSize = 7
            } else if (data.length < 7) {
                pageSize = data.length;
                // table.setPageSize(data.length)
            }

            $(".tabulator-footer .tabulator-paginator").prepend("<span class='allRowsCount'><span data-i18n='TOTAL'>Total</span>: " + data.length + "</sapn>");
           
        },
    });

    table.setLocale(currentLng);
    table.setPageSize(pageSize)
    crearMenuDesgarga();


    //select row on "select" button click
    /*document.getElementById("select-row").addEventListener("click", function(){
        table.deselectRow();
        table.selectRow(1);
      });*/

    //console.log(table)

    ///OCULTAR UNA COLUMNA
    //Primero obtener la columna table.columnManager.columns[1]
    //table.hideColumn(table.columnManager.columns[1])


    /*FOOTER PAGINACION */
    $(".tabulator-paginator label").hide();
    $(".tabulator-page-size").hide();

    $(".tabulator-page[data-page='first']").text("<<")
    $(".tabulator-page[data-page='prev']").text("<")
    $(".tabulator-page[data-page='last']").text(">>")
    $(".tabulator-page[data-page='next']").text(">")

    columnaSegunIdioma();
    //TODAS LAS COLUMNAS
    $("#allColumns").click(function () {
        table.columnManager.columns
        for (let i = 22; i < table.columnManager.columns.length; i++) {
            const t = table.columnManager.columns[i];

            table.showColumn(t);
        }

        if ($('#allColumns').hasClass('active')) {
            $("#allColumns").removeClass('active');
        } else {
            $("#generalColumns").removeClass('active');
            $("#allColumns").addClass('active');
        }
        columnaSegunIdioma();
    });


    //COLUMNAS GENERALES
    $("#generalColumns").click(function () {
        if ($('#generalColumns').hasClass('active')) {
            $("#generalColumns").removeClass('active');
        } else {
            $("#allColumns").removeClass('active');
            $("#generalColumns").addClass('active');
        }
        for (let i = 22; i < table.columnManager.columns.length; i++) {
            const t = table.columnManager.columns[i];
            table.hideColumn(t);
        }

    });

    adaptarTabla()
}

function adaptarTabla() {
    var tamano = 390;
    tamano = 214 + (25 * pageSize);
    // console.log(tamano)

    panelTabla.resize({
        height: tamano
    })
        .reposition();
}


function crearMenuDesgarga() {
    var fecha=obtenerfecha(false);
  
    var nombreConsultaGeojson="consulta_"+fecha+".geojson";
    var obj = geojsonConsulta;
    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
    var href = 'data:' + data;

    var div = '<div class="vertical-menu">' +
        '<a id="btn-csv" onclick="descargarFichero(1)">CSV</a>' +
        '<a id="btn-excel" onclick="descargarFichero(2)">Excel</a>' +
        '<a id="" href=' + href + ' download='+nombreConsultaGeojson+'>Geojson</a>' +
        '</div>';

    jsPanel.tooltip.create({
        target: '#btn-descargar',
        header: false,
        connector: true,
        ttipName: 'tooltip-5',
        position: {
            my: 'left-bottom',
            at: 'right-bottom'
        },
        contentSize: 'auto',
        content: div,
        theme: 'primary',
        headerRemove: true,
        mode: 'semisticky',
        border: 'none',
        borderRadius: 6,
    });


}

function descargarFichero(tipo) {
    switch (tipo) {
        case 1:
            table.download("csv", "consultaParcelas.csv", {}, "all");
            break;
        case 2:
            table.download("xlsx", "consultaParcelas.xlsx", { sheetName: "Parcelas" });
            break;
        default:
            break;
    }


    ;
}

function filtrosBusqueda(filtro) {
    // debugger;
    let filters = {};
    for (let j = 0; j < filtro.length; j++) {
        const element = filtro[j].tag;
        switch (element) {
            case "MUNICIPIOS":
                filters.MUNICIPIO = MUNICIPIO => MUNICIPIO === parseInt(filtro[j].valor);
                break;
            case "PARCELA":
                //console.log("PARCELA")
                filters.PARCELA = PARCELA => PARCELA === parseInt(filtro[j].valor);
                break;
            case "POLIGONO":
                filters.POLIGONO = POLIGONO => POLIGONO === parseInt(filtro[j].valor);
                break;
            case "REF_CATASTRAL":
                //console.log("REF_CATASTRAL")
                filters.PARCELA = PARCELA => PARCELA === parseInt(filtro[j].valor);
                break;
            case "POLY_AREA":
                // console.log("POLY_AREA")
                // console.log(filtro[j].signo)
                if (filtro[j].signo == "=") {
                    filters.POLY_AREA = POLY_AREA => POLY_AREA === parseFloat(filtro[j].valor);
                } else if (filtro[j].signo == "<") {
                    filters.POLY_AREA = POLY_AREA => POLY_AREA < parseFloat(filtro[j].valor);
                } else if (filtro[j].signo == ">") {
                    filters.POLY_AREA = POLY_AREA => POLY_AREA > parseFloat(filtro[j].valor);
                } else if (filtro[j].signo == ">=") {
                    filters.POLY_AREA = POLY_AREA => POLY_AREA >= parseFloat(filtro[j].valor);
                } else if (filtro[j].signo == "<=") {
                    filters.POLY_AREA = POLY_AREA => POLY_AREA <= parseFloat(filtro[j].valor);
                }

                break;

            case "INSIDE_X":
                //console.log("INSIDE_X")
                filters.INSIDE_X = INSIDE_X => INSIDE_X >= parseFloat(filtro[j].valor);
                break;
            case "INSIDE_Y":
                //console.log("INSIDE_Y")
                filters.INSIDE_Y = INSIDE_Y => INSIDE_Y >= parseFloat(filtro[j].valor);
                break;

            case "NOMBRE_CAS":
                if (currentLng == "es") {
                    filters.NOMBRE_CAS = NOMBRE_CAS => NOMBRE_CAS === filtro[j].valor;
                } else {
                    filters.NOMBRE_EUS = NOMBRE_EUS => NOMBRE_EUS === filtro[j].valor;
                }
                break;
            case "DIST_CARR":
                // console.log("DIST_CARR");
                // console.log(filtro[j].valor);
                //filters.DIST_CARR = DIST_CARR => DIST_CARR === parseInt(filtro[j].valor);
                if (filtro[j].valor == "<5") {
                    filters.DIST_CARR = DIST_CARR => DIST_CARR < parseFloat(5);
                } else if (filtro[j].valor == "<=100") {
                    filters.DIST_CARR = DIST_CARR => DIST_CARR <= parseFloat(100);
                } else if (filtro[j].valor == "100-300") {
                    filters.DIST_CARR = DIST_CARR => DIST_CARR >= parseFloat(100) && DIST_CARR <= parseFloat(300);
                } else if (filtro[j].valor == "300-600") {
                    filters.DIST_CARR = DIST_CARR => DIST_CARR >= parseFloat(300) && DIST_CARR <= parseFloat(600);
                } else if (filtro[j].valor == ">600") {
                    filters.DIST_CARR = DIST_CARR => DIST_CARR > parseFloat(600);
                }
                break;

            case "NOMFUENTE":
                //console.log("NOMFUENTE")
                filters.NOMFUENTE = NOMFUENTE => NOMFUENTE == filtro[j].valor;
                break;
            case "CODIGO_FUE":
                //console.log("CODIGO_FUE")
                filters.CODIGO_FUE = CODIGO_FUE => CODIGO_FUE >= parseFloat(filtro[j].valor);
                break;
            case "DIST_FUEN":
                //console.log("DIST_FUEN")
                // filters.DIST_FUEN = DIST_FUEN => DIST_FUEN >= parseFloat(filtro[j].valor);
                if (filtro[j].valor == "<5") {
                    filters.DIST_FUEN = DIST_FUEN => DIST_FUEN < parseFloat(5);
                } else if (filtro[j].valor == "<=100") {
                    filters.DIST_FUEN = DIST_FUEN => DIST_FUEN <= parseFloat(100);
                } else if (filtro[j].valor == "100-300") {
                    filters.DIST_FUEN = DIST_FUEN => DIST_FUEN >= parseFloat(100) && DIST_FUEN <= parseFloat(300);
                } else if (filtro[j].valor == "300-600") {
                    filters.DIST_FUEN = DIST_FUEN => DIST_FUEN >= parseFloat(300) && DIST_FUEN <= parseFloat(600);
                } else if (filtro[j].valor == ">600") {
                    filters.DIST_FUEN = DIST_FUEN => DIST_FUEN > parseFloat(600);
                }
                break;

            case "ALT_MAX":
                //console.log("ALT_MAX")
                filters.ALT_MAX = ALT_MAX => ALT_MAX <= parseFloat(filtro[j].valor);
                break;
            case "ALT_MIN":
                //console.log("ALT_MIN")
                filters.ALT_MIN = ALT_MIN => ALT_MIN >= parseFloat(filtro[j].valor);
                break;
            case "ALT_MED":
                // console.log("ALT_MED")
                filters.ALT_MED = ALT_MED => ALT_MED === parseFloat(filtro[j].valor);
                break;

            case "PEND_MAX":
                // console.log("PEND_MAX")
                if (filtro[j].valor < 100) {
                    var tramoMax = codPendientesTramos.filter(function (v) {
                        var valor;
                        if ((filtro[j].valor >= parseInt(v.min)) && (filtro[j].valor <= parseInt(v.max))) {

                            valor = v;
                        }
                        return valor;
                    });
                    filters.PEND_MAX = PEND_MAX => PEND_MAX <= parseFloat(tramoMax[0].value);
                    // console.log(parseFloat(tramoMax[0].value))
                }

                //  filters.PEND_MAX = PEND_MAX => PEND_MAX <= parseFloat(filtro[j].valor);
                break;
            case "PEND_MIN":
                // console.log("PEND_MIN")
                //EN PROCESO
                if (filtro[j].valor >= 3) {
                    var tramo = codPendientesTramos.filter(function (v) {
                        var valor;
                        if ((parseInt(v.min) <= filtro[j].valor) && (filtro[j].valor < parseInt(v.max))) {

                            // console.log("PEND_MIN" + parseFloat(v.value))
                            valor = v
                        }
                        return valor;
                    });

                    filters.PEND_MIN = PEND_MIN => PEND_MIN >= parseFloat(tramo[0].value);
                    // console.log(parseFloat(tramo[0].value))
                }

                break;
            case "PEND_MED":
                // console.log("PEND_MED" + filtro[j].valor)
                filters.PEND_MED = PEND_MED => PEND_MED === parseFloat(filtro[j].valor);

                break;
            case "ORI_MED":
                //console.log("ORI_MED")
                filters.ORI_MED = ORI_MED => ORI_MED == filtro[j].valor;
                break;

            /*LITOLOGIA */
            case "COD_LITOLO":
                //console.log("ORI_MED")
                filters.COD_LITOLO = COD_LITOLO => COD_LITOLO == parseInt(filtro[j].valor);
                break;
            case "EVAPO":
                //console.log("EVAPO" +parseInt(filtro[j].valor))
                filters.EVAPO = EVAPO => EVAPO == parseInt(filtro[j].valor);
                break;


            /* */
            case "SIST_GEN":
                //console.log("SIST_GEN")
                filters.SIST_GEN = SIST_GEN => SIST_GEN >= parseFloat(filtro[j].valor);
                break;
            case "ACT_ECON":
                //console.log("ACT_ECON")
                filters.ACT_ECON = ACT_ECON => ACT_ECON >= parseFloat(filtro[j].valor);
                break;
            case "NO_URBAN":
                //console.log("NO_URBAN")
                filters.NO_URBAN = NO_URBAN => NO_URBAN >= parseFloat(filtro[j].valor);
                break;
            case "RESI":
                //console.log("RESI")
                filters.RESI = RESI => RESI >= parseFloat(filtro[j].valor);
                break;
            /* Inventario Bosques */
            case "AFLOR":
                //console.log("AFLOR")
                filters.AFLOR = AFLOR => AFLOR >= parseFloat(filtro[j].valor);
                break;
            case "ARBUS":
                //console.log("ARBUS")
                filters.ARBUS = ARBUS => ARBUS >= parseFloat(filtro[j].valor);
                break;
            case "BOS_11":
                //console.log("BOS_11")
                filters.BOS_11 = BOS_11 => BOS_11 >= parseFloat(filtro[j].valor);
                break;
            case "ENERGIA":
                //console.log("ENERGIA")
                filters.ENERGIA = ENERGIA => ENERGIA >= parseFloat(filtro[j].valor);
                break;
            case "EQUIP":
                //console.log("EQUIP")
                filters.EQUIP = EQUIP => EQUIP >= parseFloat(filtro[j].valor);
                break;
            case "HERBAZ":
                //console.log("ENERGIA")
                filters.HERBAZ = HERBAZ => HERBAZ >= parseFloat(filtro[j].valor);
                break;

            case "LAGUNA":
                //console.log("LAGUNA")
                filters.LAGUNA = LAGUNA => LAGUNA >= parseFloat(filtro[j].valor);
                break;
            case "MARISMA":
                //console.log("MARISMA")
                filters.MARISMA = MARISMA => MARISMA >= parseFloat(filtro[j].valor);
                break;
            case "MOSAICO":
                //console.log("LAGUNA")
                filters.MOSAICO = MOSAICO => MOSAICO >= parseFloat(filtro[j].valor);
                break;
            case "ARTIF":
                //console.log("O_SUPERF_ARTIF")
                filters.ARTIF = ARTIF => ARTIF >= parseFloat(filtro[j].valor);
                break;

            case "PANTANO":
                //console.log("LAGUNA")
                filters.PANTANO = PANTANO => PANTANO >= parseFloat(filtro[j].valor);
                break;
            case "MATORRAL":
                //console.log("MATORRAL")
                filters.MATORRAL = MATORRAL => MATORRAL >= parseFloat(filtro[j].valor);
                break;
            case "PRADO":
                //console.log("PRADO")
                filters.PRADO = PRADO => PRADO >= parseFloat(filtro[j].valor);
                break;
            case "P_SETO":
                //console.log("P_SETO")
                filters.P_SETO = P_SETO => P_SETO >= parseFloat(filtro[j].valor);
                break;

            /*sigpac */
            case "AG":
                //console.log("AG")
                filters.AG = AG => AG >= parseFloat(filtro[j].valor);
                break;
            case "CA":
                //console.log("CA-VIALAK")
                filters.CA = CA => CA >= parseFloat(filtro[j].valor);
                break;

            case "ED":
                //console.log("ED")
                filters.ED = ED => ED >= parseFloat(filtro[j].valor);
                break;
            case "FO":
                //console.log("FO")
                filters.FO = FO => FO >= parseFloat(filtro[j].valor);
                break;
            case "FY":
                //console.log("FY")
                filters.FY = FY => FY >= parseFloat(filtro[j].valor);
                break;
            case "IM":
                //console.log("IM")
                filters.IM = IM => IM >= parseFloat(filtro[j].valor);
                break;
            case "IV":
                //console.log("IV")
                filters.IV = IV => IV >= parseFloat(filtro[j].valor);
                break;
            case "PA":
                //console.log("PA")
                filters.PA = PA => PA >= parseFloat(filtro[j].valor);
                break;
            case "PR":
                //console.log("PR")
                filters.PR = PR => PR >= parseFloat(filtro[j].valor);
                break;
            case "PS":
                //console.log("PS")
                filters.PS = PS => PS >= parseFloat(filtro[j].valor);
                break;
            case "TA":
                //console.log("TA")
                filters.TA = TA => TA >= parseFloat(filtro[j].valor);
                break;
            case "TH":
                //console.log("TH")
                filters.TH = TH => TH >= parseFloat(filtro[j].valor);
                break;
            case "VI":
                //console.log("VI")
                filters.VI = VI => VI >= parseFloat(filtro[j].valor);
                break;

            case "ZU":
                //console.log("ZU")
                filters.ZU = ZU => ZU >= parseFloat(filtro[j].valor);
                break;

            case "HUERTA":
                filters.DIST_CARR = DIST_CARR => DIST_CARR <= parseFloat(300);
                filters.PEND_MAX = PEND_MAX => PEND_MAX < parseFloat(3);//10%
                filters.ALT_MAX = ALT_MAX => ALT_MAX < parseFloat(400);
                break;
            case "FRUTAL":
                filters.DIST_CARR = DIST_CARR => DIST_CARR <= parseFloat(300);
                filters.PEND_MAX = PEND_MAX => PEND_MAX < parseFloat(3);//10%
                filters.PEND_MIN = PEND_MIN => PEND_MIN >= parseFloat(4);//10%
                filters.ALT_MAX = ALT_MAX => ALT_MAX < parseFloat(400);
                break;
            case "PRADERA1":
                filters.DIST_CARR = DIST_CARR => DIST_CARR <= parseFloat(300);
                filters.PEND_MAX = PEND_MAX => PEND_MAX < parseFloat(5);//25%
                filters.PEND_MIN = PEND_MIN => PEND_MIN >= parseFloat(4);//15%
                filters.ALT_MAX = ALT_MAX => ALT_MAX <= parseFloat(600);
                filters.ALT_MIN = ALT_MIN => ALT_MIN >= parseFloat(0);
                break;
            case "PRADERA2":
                filters.DIST_CARR = DIST_CARR => DIST_CARR <= parseFloat(300);
                filters.PEND_MAX = PEND_MAX => PEND_MAX <= parseFloat(5);//25%
                filters.PEND_MIN = PEND_MIN => PEND_MIN >= parseFloat(1);//0%
                filters.ALT_MAX = ALT_MAX => ALT_MAX <= parseFloat(600);
                filters.ALT_MIN = ALT_MIN => ALT_MIN >= parseFloat(400);
                break;
            case "PASTIZAL":
                filters.DIST_CARR = DIST_CARR => DIST_CARR < parseFloat(300);
                filters.PEND_MAX = PEND_MAX => PEND_MAX <= parseFloat(5);//25%
                filters.PEND_MIN = PEND_MIN => PEND_MIN <= parseFloat(4);//15%
                filters.ALT_MIN = ALT_MIN => ALT_MIN < parseFloat(600);
                break;
            case "BASOA":
                filters.PEND_MIN = PEND_MIN => PEND_MIN > parseFloat(5);//25%

                break;
            default:

                break;
        }

    }

    /*console.log("______DATOS CONSULTA_____");
    console.log(filters)
    console.log("_________________________");*/

    cargarGEOJSONConsulta(filters);

}

function obtenerDataSetConsulta(consultaJson) {
    var jsonFiltro = [];
    // console.log(consultaJson)
    for (let i = 0; i < consultaJson.features.length; i++) {
        const element = consultaJson.features[i].properties;

        jsonFiltro.push(element)
        jsonFiltro[i].coordinates = consultaJson.features[i].geometry.coordinates;
        jsonFiltro[i].NOM_MUNICIPIO = obtenerNombreMunicipio(element.MUNICIPIO);
        jsonFiltro[i].COD_LITOLO = obtenerNombreLitologia(element.COD_LITOLO);
        jsonFiltro[i].EVAPO = obtenerNombreEvapo(element.EVAPO);

        jsonFiltro[i].DIST_FUEN = obtenerDistanciaFormato(element.DIST_FUEN);
        jsonFiltro[i].DIST_CARR = obtenerDistanciaFormato(element.DIST_CARR);
        jsonFiltro[i].PEND_MED = obtenerPendienteMedia(element.PEND_MED, "med");
        jsonFiltro[i].PEND_MIN = obtenerPendienteMedia(element.PEND_MIN, "min");

        jsonFiltro[i].PEND_MAX = obtenerPendienteMedia(element.PEND_MAX, "max");
        jsonFiltro[i].CULTI = parseFloat(element.CULTI).toFixed(2);
        jsonFiltro[i].ORI_MED = i18n.t(element.ORI_MED);
        
    }
    //> 1km
    //console.log(jsonFiltro);
    return jsonFiltro;
}
var Catalogo_Parcelas_Total_eva = undefined;
function obtenerGEOJSON(filters, nombreGeoJSON) {

    var consultaJson = [];

    try {
        if (highlight != undefined) featureOverlay.getSource().removeFeature(highlight);
    } catch (error) {
        //console.log("errorAA")
        // console.log(error)
    }
    map.removeLayer(vectorLayer);

    switch (nombreGeoJSON) {
        case "Catalogo_Parcelas_Total_eva":
            if (Catalogo_Parcelas_Total_eva == undefined) {
                var request = new XMLHttpRequest();
                request.open("GET", "src/data/geojson/" + nombreGeoJSON + ".geojson", false);
                request.send(null)
                Catalogo_Parcelas_Total_eva = JSON.parse(request.responseText);
              
            }
            // console.log(Catalogo_Parcelas_Total_eva)

            consultaJson = JSON.parse(JSON.stringify(Catalogo_Parcelas_Total_eva));
            break;
        case "Catalogo_subparcelas":
            var request = new XMLHttpRequest();
            request.open("GET", "src/data/geojson/" + nombreGeoJSON + ".geojson", false);
            request.send(null)
            var catalogo_subparcelas = JSON.parse(request.responseText);

            consultaJson = Object.create(catalogo_subparcelas);
            break;

        default:
            break;
    }

    var features = filterArrayGEOJSON(consultaJson, filters);

    consultaJson.features = [];
    consultaJson.features = features;
    //console.log(consultaJson)



    return consultaJson;






}
/*PRUEBA DE LECTURA DEL GEOJSON DE OTRA MANERA */
function lee_json() {
    $.getJSON("src/data/geojson/Catalogo_Parcelas_Total_eva.geojson", function(datos) {
       console.log(datos) 
        
    });
}

var geojsonConsulta;
function obtenerNombreMunicipio(COD_MUN) {
    //  MUNICIPIO
    var nombre = '';
    municipiosCod.forEach(element => {

        if (COD_MUN == element.value) {
            // console.log(element.name);
            nombre = element.name;
        }

    });

    return nombre;
}
function obtenerNombreLitologia(COD) {
    //  Litologia
    var nombre = '';
    tiposLitologias.forEach(element => {
        if (COD == element.value) {
            nombre = element.data;
        }
        nombre = i18n.t(nombre);
        //  nombre = "<span data-i18n='"+element.data+"'>"+i18n.t(element.data)+"</span>";
    });

    return nombre;
}

function obtenerNombreEvapo(COD) {
    //  MUNICIPIO
    var nombre = '';
    tiposEvapo.forEach(element => {
        if (COD == element.value) {
            nombre = element.data;
        }
        nombre = i18n.t(nombre);
        //  nombre = "<span data-i18n='"+element.data+"'>"+i18n.t(element.data)+"</span>";
    });

    return nombre;
}

function obtenerPendienteMedia(COD, tipo) {
    //  PendienteMedia tramos
    var nombre = '';
    codPendientesTramos.forEach(element => {
        if (COD == element.value) {
            switch (tipo) {
                case "med":
                    nombre = element.name;
                    break;
                case "max":
                    nombre = element.name;
                    break;
                case "min":
                    nombre = element.name;
                    break;
                default:
                    break;
            }
        }
    });

    return nombre;
}
function obtenerDistanciaFormato(DIST) {
    /*console.log(DIST)*/
    var distFormato = '';
    if (DIST == -1) distFormato = "> 1km";
    else distFormato = parseFloat(DIST).toFixed(2);
    return distFormato;
}
var prueba;
function cargarGEOJSONConsulta(filters) {
    var consultaJson;
    filtradas = [];
    consultaJson = obtenerGEOJSON(filters, "Catalogo_Parcelas_Total_eva");
    /*-------------*/
    prueba = consultaJson;
    /*-------------*/
    geojsonConsulta = consultaJson;
    zoomAExtension(consultaJson);



    var styleA = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(188, 216, 241, 0.3)'
        }),
        stroke: new ol.style.Stroke({
            color: '#01599d',
            width: 1.5
        })
    });

    highlightStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#f508f9',
            width: 1
        }),
        fill: new ol.style.Fill({
            color: 'rgba(245, 8, 249,0.2)'
        })
    });

    var styleFunction = function (feature) {
        return styleA;
    };
    //console.log(consultaJson)
    var vectorSource = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(consultaJson, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        })
    });

    vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: styleFunction
    });

    featureOverlay = new ol.layer.Vector({
        source: new ol.source.Vector(),
        map: map,
        style: function (feature) {
            return highlightStyle;
        }
    });
    map.addLayer(vectorLayer);


    ////////TABLA CON LA CONSULTA//////
    if (panelTabla != undefined) {
        panelTabla.close();
    }

    filtradas = obtenerDataSetConsulta(consultaJson);
    crearPanelTabla(filtradas);






    //a.innerHTML = 's';

    // var container = document.getElementById('pruebaDescargaJson');
    // container.appendChild(a);

    $("#map").css("cursor", "default");
    $(".jsPanel .jsPanel-content").css("cursor", "default");
}

function zoomAExtension(consultaJson) {
    var ext, coordenas = [];

    if (consultaJson.features.length > 0) {
        // console.log(consultaJson.features[0].geometry)
        for (let i = 0; i < consultaJson.features.length; i++) {
            const element = consultaJson.features[i].geometry.coordinates[0][0];
            for (let j = 0; j < element.length; j++) {
                coordenas.push(element[j]);
            }
        }

        ext = ol.extent.boundingExtent(coordenas);
        ext = ol.proj.transformExtent(ext, ol.proj.get('EPSG:4326'), ol.proj.get('EPSG:3857'));

        map.getView().fit(ext, {
            padding: [170, 50, 30, 150],
            size: map.getSize(),
            duration: 1000
        });
        // var zoomEXT=map.getView().getZoom()-1;
        // map.getView().setZoom(zoomEXT)
    }

}
var featureDatos;
function resaltarPoligono(pixel) {
    map.removeLayer(vectorOVER);

   // console.log("resaltarPoligono")
    pixel = [parseInt(pixel[0]), parseInt(pixel[1])]
    //console.log(pixel)

    var feature = map.forEachFeatureAtPixel(pixel, function (feature) {
        return feature;
    });
    // console.log('feature')
    //console.log(feature);

    geojsonObject = {
        'type': 'FeatureCollection',
        'crs': {
            'type': 'name',
            'properties': {
                'name': 'EPSG:3857'
            }
        },
        'features': [{
            'type': 'Feature',
            'geometry': {
                'type': 'MultiPolygon',
                "properties": rowt,
                'coordinates': coordPrueba
            }
        }]
    };

    
    var vectorSource = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(geojsonObject, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        })
    });
   
    vectorSource.values_=geojsonObject.features[0].geometry.properties;
   // console.log(vectorSource)
    featureDatos=vectorSource;
    
    //vectorSource.addFeature(new ol.Feature(new ol.geom.Polygon(coordPrueba)));
    // console.log('vectorSource')
   // console.log((new ol.format.GeoJSON()).readFeatures(geojsonObject))

    vectorOVER = new ol.layer.Vector({
        source: vectorSource,
        style: highlightStyle
    });
   // console.log(vectorSource)
    map.addLayer(vectorOVER);
    if(panelInformacion != undefined) crearFicha(vectorSource,origen);

    setTimeout(function () {
        domImagen = obtenerImagen();
        origen="tabla";
      }, 1000);
   

}



/**
 * Filters an array of objects by custom predicates.
 *
 * @param  {Array}  array: the array to filter
 * @param  {Object} filters: an object with the filter criteria
 * @return {Array}
 */
function filterArrayGEOJSON(array, filters) {
    const filterKeys = Object.keys(filters);
    return array.features.filter(item => {
        // validates all filter criteria
        return filterKeys.every(key => {
            // ignores non-function predicates
            if (typeof filters[key] !== 'function') return true;
            return filters[key](item.properties[key]);
        });
    });
}

function columnaSegunIdioma() {
    var columnCAS, columnEUS;
    table.columnManager.columns.forEach(t => {

        if (t.definition.field == "NOMBRE_CAS") columnCAS = t;
        if (t.definition.field == "NOMBRE_EUS") columnEUS = t;
    });
    if (currentLng == "eu") {
        table.hideColumn(columnCAS);
        table.showColumn(columnEUS);
    } else {
        table.showColumn(columnCAS);
        table.hideColumn(columnEUS);
    }
}