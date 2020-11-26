var wmsSource;


function addLeyenda() {
    // Initial legend
    var resolution = map.getView().getResolution();

    var updateLegend = function (resolution) {
        var graphicUrl = wmsSource.getLegendUrl(resolution);
        var img = document.getElementById('legend');
        img.src = graphicUrl;

    };

    //updateLegend(resolution);


    for (let index = 0; index < grupoCapasLeyenda.length; index++) {
        const element = grupoCapasLeyenda[index];
        var gr = element.getLegendUrl(resolution);


        $("#leyendas").append('<img src=' + gr + ' class="leyendaImg">');

    }

    // // Update the legend when the resolution changes
    map.getView().on('change:resolution', function (event) {
        var resolution = event.target.getResolution();
        updateLegend(resolution);
    });


}
/**
 * addCapa
 * Funcion que añade una capa, en este caso de prueba de los stados
 */
function addCapa() {
    wmsSource = new ol.source.ImageWMS({
        // url: 'https://ahocevar.com/geoserver/wms',
        // params: {'LAYERS': 'usa:states'},
        url: "http://www.geo.euskadi.eus/WMS_KARTOGRAFIA/wms", //?request=GetCapabilities&service=WMS",
        params: {
            'LAYERS': 'HID_FUENTES_POZOS',
            'TILED': true
        },
        // url: 'https://ahocevar.com/geoserver/wms',
        // params: {'LAYERS': 'ne:ne', 'TILED': true},
        ratio: 1,
        serverType: 'geoserver'
    });

    const layerconLeyendaImagen = new ol.layer.Image({

        extent: [-384246.808648, 5231157.461185, -192141.269745, 5381544.183637], //PRUEBAS
        //extent: [-13884991, 2870341, -7455066, 6338219],//anterior
        source: wmsSource
    })
    map.addLayer(layerconLeyendaImagen);
}

function tablaLeyenda() {
    var layersVisibles_K = [];
    var layersVisibles_VF = [];
     var layersVisibles_RV= [];
     var layersVisibles_UF= [];
    //console.log("tablaLeyenda")
    katastroLayerGroup.getLayers().forEach(function (element, index) {
        if (katastroLayerGroup.getLayers().array_[index].getVisible()) {
            layersVisibles_K.push(element.values_.title)
        }
    });
    layerGroup_VF.getLayers().forEach(function (element, index) {
        if (layerGroup_VF.getLayers().array_[index].getVisible()) {
            layersVisibles_VF.push(element.values_.title)
        }
    });
    layerGroup_RV.getLayers().forEach(function (element, index) {
        if (layerGroup_RV.getLayers().array_[index].getVisible()) {
            layersVisibles_RV.push(element.values_.title)
        }
    });

    layerGroup_UF.getLayers().forEach(function (element, index) {
        if (layerGroup_UF.getLayers().array_[index].getVisible()) {
            layersVisibles_UF.push(element.values_.title)
        }
    });
    if (layersVisibles_K.length > 0 || layersVisibles_VF.length>0 || layersVisibles_RV.length >0 || layersVisibles_UF.length >0) {
        $("#leyendas").empty();
        // console.log("layersVisibles")
        if (layersVisibles_K.length > 0) {
            añadirElementosLeyenda("leyendaTablaSub_K", "CARTOGRAFIA", layersVisibles_K, capasKatastro);
          
        }
        if (layersVisibles_VF.length > 0) {
            añadirElementosLeyenda("leyendaTablaSub_VF", "PARAMETROS_FORESTALES", layersVisibles_VF, capasVariablesForestales);
          
        }
         if (layersVisibles_RV.length > 0) {
             añadirElementosLeyenda("leyendaTablaSub_RV", "RIESGO_VIENTO", layersVisibles_RV, capasRiesgoViento);
         }
        if (layersVisibles_UF.length > 0) {
            añadirElementosLeyenda("leyendaTablaSub_UF", "MAPA_FORESTAL_US", layersVisibles_UF, capasUsoForestal);
        }
    } else {
        $("#leyendas").empty();
        $("#leyendas").append('No hay capas visibles');
    }


}

function añadirElementosLeyenda(id_leyenda, titulo, layersVisibles, capas) {
    $("#leyendas").append('<table id="leyendaTabla">' +
        ' <tr><td class="tituloServicio" data-i18n="'+titulo+'">' + titulo + '</td> </tr>' +
        '<tr><td><table id=' + id_leyenda + '><tbody>' +
        ' </tbody> </table></td> </tr>' +
        '</table>');


    for (let index = 0; index < capas.length; index++) {
        layersVisibles.forEach(element => {
            if (capas[index].titulo == element) {
               //console.log("element"+element)
               
                $("table #"+id_leyenda+" >tbody").append(
                    '<tr><th data-i18n="'+capas[index].id_idioma+'">' + element + '</th></tr>' +
                    '<tr><td>' +
                    '<img src="' + capas[index].img + '" class="leyendaImg">' +
                    '</td></tr>'
                );
            }
        });

    }
    cambiarIdioma(currentLng);
}