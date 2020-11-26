

function btnConsultaPredeterminada() {
    var divsConsulta = ['#consultaPredeterminada'];
    var consultaCP = "", municipio = "", tipo_suelo = "", campoIncompleto = "";
    var filtro = [];
    var selecionado;
    $("#map").css("cursor", "wait");
    $(".jsPanel .jsPanel-content").css("cursor", "wait");
 


    const obtenerFiltrosPredeterminada = divsConsulta => {
        return new Promise((resolve) => {
            divsConsulta.forEach(contenido => {

                for (let index = 0; index < $(contenido + ' .form-control').length; index++) {
                    const element = $(contenido + ' .form-control')[index];
                    var tag = $(element).attr("tag");
                    if (element.value.length > 0) {
                        //  console.log(element.id + " " + $(element).attr("tag") + "   :" + element.value)

                        var valor = element.value;
                        //Comprobamos que todos los campos estan rellenados
                        if (valor.length > 0) {
                            if (tag == "TIPO_SUELO") {
                                tipo_suelo = valor.toUpperCase();
                                tag = tipo_suelo;
                                //console.log(tag)
                                selecionado = tag;

                                //console.log(filtro)
                                if (valor != "TODOS") filtro.push({ tag, tag })
                                else {
                                    tag = "TODOS";
                                    filtro.push({ tag, tag })
                                }
                            } else if (tag == "MUNICIPIO") {
                                // console.log(tag)
                                //console.log(valor)
                                if (valor != "TODOS") filtro.push({ tag, valor })
                            }
                        }

                    } else {
                        campoIncompleto += tag + " ";
                    }
                }

            });

            if (selecionado == "TODOS") {
                if (filtro[0].tag != "MUNICIPIO" && filtro[0].tag != "TODOS") filtro[0].tag = "TODOS";
                else if (filtro[0].tag == "MUNICIPIO") filtro[1].tag = "TODOS";
            }

            console.log(filtro)
            resolve(filtro)
        });
    }

    //Este tiempo es para que pueda pillar el cursor
setTimeout(() => {
    obtenerFiltrosPredeterminada(divsConsulta).then(res => {
        return res;
    }).then(filtro => {
        obtenerConsultaPredeterminada(filtro, selecionado);
    }).catch(error => {
        console.error(error);
    })
}, 400);
   
     


};

function obtenerConsultaPredeterminada(filtro, selecionado) {


    //console.log(filtro)
    selecionado = selecionado.toUpperCase();

    var consultaJson = undefined;
    var consultaJson_HUERTA, consultaJson_FRUTAL, consultaJson_PRADERA1, consultaJson_PRADERA2, consultaJson_PASTIZAL2, consultaJson_BASOA;
    filtradas = [];
    let filters = {};
    if (selecionado == "TODOS") {



        consultaJsonTodosCP("HUERTA", filtro).then(res => {
            return res;
        }).then(consultaJson_HUERTA => {
            consultaJson_FRUTAL = consultaJsonTodosCP("FRUTAL", filtro, consultaJson_HUERTA);
            return consultaJson_FRUTAL;
        }).then(consultaJson_FRUTAL => {
            consultaJson_PRADERA1 = consultaJsonTodosCP("PRADERA1", filtro, consultaJson_FRUTAL);
            return consultaJson_PRADERA1;

        }).then(consultaJson_PRADERA1 => {
            consultaJson_PRADERA2 = consultaJsonTodosCP("PRADERA2", filtro, consultaJson_PRADERA1);
            return consultaJson_PRADERA2;

        }).then(consultaJson_PRADERA2 => {
            consultaJson_PASTIZAL2 = consultaJsonTodosCP("PASTIZAL2", filtro, consultaJson_PRADERA2);
            return consultaJson_PASTIZAL2;

        }).then(consultaJson_PASTIZAL2 => {
            consultaJson_BASOA = consultaJsonTodosCP("BASOA", filtro, consultaJson_PASTIZAL2);
            return consultaJson_BASOA;

        }).then(consultaJson => {
            cargarGEOJSONConsultaPredeterminada(consultaJson, color_Verde1, color_Verde2);

        }).catch(error => {
            console.error(error);
        })










    } else if (selecionado == "HUERTA") {
        consultaJsonTodosCP("HUERTA", filtro).then(res => {
            return res;
        }).then(consultaJson_HUERTA => {
            cargarGEOJSONConsultaPredeterminada(consultaJson_HUERTA,color_Naranja1, color_Naranja2);
        }).catch(error => {
            console.error(error);
        })


    } else if (selecionado == "PRADERA") {

        // var consultaJson_PRADERA1 = consultaJsonTodosCP("PRADERA1", filtro);

        consultaJsonTodosCP("PRADERA1", filtro).then(res => {
            return res;
        }).then(consultaJson_PRADERA1 => {
            consultaJson_PRADERA2 = consultaJsonTodosCP("PRADERA2", filtro, consultaJson_PRADERA1);
            return consultaJson_PRADERA2;
        }).then(consultaJson => {
            cargarGEOJSONConsultaPredeterminada(consultaJson, color_Amarillo1, color_Amarillo2);
        }).catch(error => {
            console.error(error);
        })

       
    } else if (selecionado == "PASTIZAL") {
        consultaJsonTodosCP("PASTIZAL2", filtro).then(res => {
            return res;
        }).then(consultaJson => {
            cargarGEOJSONConsultaPredeterminada(consultaJson, color_Morado1, color_Morado2);
        }).catch(error => {
            console.error(error);
        })


    } else if (selecionado == "BASOA") {
        consultaJsonTodosCP("BASOA", filtro).then(res => {
            return res;
        }).then(consultaJson_BASOA => {
            cargarGEOJSONConsultaPredeterminada(consultaJson_BASOA,color_Verde1, color_Verde2);
        }).catch(error => {
            console.error(error);
        })


    } else {
        filters = obtenerFiltersCP(filtro);
        consultaJson = obtenerGEOJSON(filters, "Catalogo_Parcelas_Total_eva");
        cargarGEOJSONConsultaPredeterminada(consultaJson, color_Naranja1, color_Naranja2);
    }



}

function obtenerFiltersCP(filtro) {

    let filters = {};
    for (let j = 0; j < filtro.length; j++) {
        const element = filtro[j].tag;
        //console.log(element)
        switch (element) {
            case "MUNICIPIO":
                filters.MUNICIPIO = MUNICIPIO => MUNICIPIO === parseInt(filtro[j].valor);
                break;
            case "HUERTA":
                filters.DIST_CARR = DIST_CARR => DIST_CARR <= parseFloat(300);
                filters.PEND_MAX = PEND_MAX => PEND_MAX <= parseFloat(3);//10%
                filters.ALT_MAX = ALT_MAX => ALT_MAX < parseFloat(400);
                break;
            case "FRUTAL":
                filters.DIST_CARR = DIST_CARR => DIST_CARR <= parseFloat(300);
                filters.PEND_MAX = PEND_MAX => PEND_MAX <= parseFloat(4);//10%
                filters.PEND_MIN = PEND_MIN => PEND_MIN > parseFloat(3);//10%
                filters.ALT_MAX = ALT_MAX => ALT_MAX < parseFloat(400);
                break;
            case "PRADERA1":
                filters.DIST_CARR = DIST_CARR => DIST_CARR <= parseFloat(300);
                filters.PEND_MAX = PEND_MAX => PEND_MAX <= parseFloat(5);//25%
                filters.PEND_MIN = PEND_MIN => PEND_MIN >= parseFloat(4);//15%
                filters.ALT_MAX = ALT_MAX => ALT_MAX <= parseFloat(600);
                filters.ALT_MIN = ALT_MIN => ALT_MIN >= parseFloat(0);
                break;
            case "PRADERA2":
                filters.DIST_CARR = DIST_CARR => DIST_CARR <= parseFloat(300);
                filters.PEND_MAX = PEND_MAX => PEND_MAX <= parseFloat(4);//25%
                filters.ALT_MAX = ALT_MAX => ALT_MAX <= parseFloat(600);
                filters.ALT_MIN = ALT_MIN => ALT_MIN >= parseFloat(400);
                break;

            case "PASTIZAL1":
                /*filters.DIST_CARR = DIST_CARR => DIST_CARR <= parseFloat(300);
                filters.PEND_MAX = PEND_MAX => PEND_MAX <= parseFloat(5);//25%
                filters.PEND_MIN = PEND_MIN => PEND_MIN >= parseFloat(4);//15%
                filters.ALT_MAX = ALT_MAX => ALT_MAX > parseFloat(600);*/
                break;
            case "PASTIZAL2":
                filters.DIST_CARR = DIST_CARR => DIST_CARR < parseFloat(300);
                filters.PEND_MAX = PEND_MAX => PEND_MAX <= parseFloat(5);//15%
                filters.ALT_MIN = ALT_MIN => ALT_MIN > parseFloat(600);
                break;
            case "BASOA":
                filters.PEND_MIN = PEND_MIN => PEND_MIN >= parseFloat(5);//25%

                break;
            default:

                break;
        }
    }

    filters.CA = CA => CA < parseFloat(99); //Viales
    filters.AG = AG => AG < parseFloat(90); //Corrientes y superficies de agua
    filters.IM = IM => IM < parseFloat(90); //Improductivas
    filters.ED = ED => ED < parseFloat(90); //Edificados
    filters.ZU = ZU => ZU < parseFloat(90); //Zonas urbanas
    return filters;
}
function cargarGEOJSONConsultaPredeterminada(consultaJson, color1, color2) {
    geojsonConsulta=consultaJson;
    zoomAExtension(consultaJson);

    var styleA = new ol.style.Style({
        fill: new ol.style.Fill({
            color: color1
        }),
        stroke: new ol.style.Stroke({
            color: color2,
            width: 1.5
        })
    });

    highlightStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#ff9800',
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
    $("#map").css("cursor", "default");
    $(".jsPanel .jsPanel-content").css("cursor", "default");
}
function deshabilitarSuelos() {
    $("#inputTipoSuelo").change(function () {
        // console.log($(this).val())
        var val = $(this).val()
        if (val == "Pastizal") {
            console.log("desactivar")
            $("#inputSuelo").attr("disabled", "disabled");
            $("#inputSuelo").val('');
        } else {
            $("#inputSuelo").removeAttr("disabled", "disabled");
        }



    })
}

function consultaAgricolaHTML() {
    $("#consultaPredeterminada").append(
        '<h4 id="" class="titulo_ConsultaPreferente"  data-i18n="TITULO_VALOR_AGRICOLA">Selección de parcela por valor agrícola</h4>' +
        ' <div class="form-row">' +
        '<div class="form-group col-md-5 col-5 col-sm-5 col-xs-5">' +
        '<label for="inputMunicipioCP" data-i18n="MUNICIPIOS">Municipios</label>' +
        '<select id="inputMunicipioCP" tag="MUNICIPIO" class="form-control">' +
        '<option data-i18n="TODOS" value="TODOS" selected="">Todos</option>' +
        '<option value="1">Abadiño</option>' +
        '<option value="3">Amorebieta-Etxano</option>' +
        '<option value="91">Atxondo</option>' +
        '<option value="19">Berriz</option>' +
        '<option value="27">Durango</option>' +
        '<option value="32">Elorrio</option>' +
        '<option value="34">Ermua</option>' +
        ' <option value="39">Garai</option>' +
        '<option value="910">Iurreta</option>' +
        '<option value="50">Izurtza</option>' +
        ' <option value="58">Mallabia</option>' +
        '<option value="59">Manaria</option>' +
        '<option value="95">Zaldibar</option>' +
       
        '</select>' +
        '</div>' +

        '<div class="form-group col-md-7 col-7 col-sm-7 col-xs-7">' +
        '<label for="inputTipoSuelo" data-i18n="TIPO_SUELO">Tipo de uso</label>' +
        '<select id="inputTipoSuelo" tag="TIPO_SUELO" class="form-control">' +
        '<option data-i18n="TODOS" value="TODOS" selected="TODOS">Todos</option>' +
        '<option data-i18n="HUERTA" value="HUERTA">Huerta suelo preferente</option>' +
        '<option data-i18n="FRUTAL" value="FRUTAL">Labradio, frutal</option>' +
        '<option data-i18n="PRADERA" value="PRADERA">Pradera</option>' +
        '<option data-i18n="PASTIZAL" value="PASTIZAL">Pastizal</option>' +
        '<option data-i18n="BASOA" value="BASOA">Forestal, Bosques plantación</option>' +

        '</select>' +
        '  </div>' +

        ' </div>' +

        '<footer id="footer">' +
        '<div id="botones" class="botones2">' +
        '<button data-i18n="CONSULTA" type="button" class="btnConsultar" onclick="btnConsultaPredeterminada()">Consultar</button>' +
        '<button data-i18n="LIMPIAR" type="button" class="btnLimpiar" onclick="btnLimpiarCP()">Limpiar</button>' +
        '</div>' +
        ' </footer>' +
        '</div>'

    );
}
function ventanaError() {

    /* if (campoIncompleto.length > 0 && tipo_suelo != "Pastizal") {
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
         content: "<div class='panelError'><p><span class='negrita'>Error al realizar la consulta:</span><ul class='txtError'><li> Existen campos incompletos</li></ul></p></div>",
         boxShadow: 5,

     });
 }*/

}

const consultaJsonTodosCP = (nombre, filtro, consultaJson_T) => {
    return new Promise((resolve, reject) => {
        if( filtro!=undefined){
            let filters = {};
            if (filtro.length > 1) filtro[1].tag = nombre;
            else filtro[0].tag = nombre;
          
    
            filters = obtenerFiltersCP(filtro);
            var consultaJson = obtenerGEOJSON(filters, "Catalogo_Parcelas_Total_eva");
           //console.log(consultaJson)
            if (consultaJson_T == undefined) {
                consultaJson_T = consultaJson;
            } else if (consultaJson_T.features.length == 0) {
                consultaJson_T.features = consultaJson.features;
            } else {
                consultaJson.features.forEach(element => { consultaJson_T.features.push(element); });
            }
    
    
            resolve(consultaJson_T);
        }else{
            reject("Valores indefinidos")
        }
        
    });
}
function btnLimpiarCP() {
    map.removeLayer(vectorLayer);
}
