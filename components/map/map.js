var grupoCapasLeyenda = [];
var katastroLayerGroup;
var layerGroup_VF;
var parcelaLayer;
var capaParcelaTotal;
var capaSubParcelaTotal;
function init() {
  baseLayerGroup = capasBase();
  katastroLayerGroup = obtenerCapasKatastro();
  layerGroup_VF=obtenerCapas(capasVariablesForestales,"Parametros forestales");
  layerGroup_RV=obtenerCapas(capasRiesgoViento,"Riesgo de derribo por viento");
  layerGroup_UF=obtenerCapas(capasUsoForestal,"Mapa forestal - Uso de suelo ");
 // 
 
  map = new ol.Map({
    target: 'map',
    layers: [baseLayerGroup, katastroLayerGroup,layerGroup_VF,layerGroup_RV,layerGroup_UF],

    view: new ol.View({
      center: [-293513.21100325487, 5339421.091980887],
      // center: [-292616.7598270783, 5309004.972591696],
      zoom: 12,
       maxZoom: 20,
      //projection: 'EPSG:25830',
    }),

  });
  
  //parcelaLayer=obtenerParcelaLayer();
  controlesMapa();
  //addCapa();//PRUEBA PARA OBTENER INFO DE LA WMS FUENTES


  /*capaParcelaTotal = obtenerParcelaLayer();
  capaSubParcelaTotal =obtenerSubParcelaLayer()
  map.addLayer(capaParcelaTotal);
  map.addLayer(capaSubParcelaTotal);*/

  map.on('rendercomplete', function(event) {
    if (iniciando) {
    //  console.log(event.target.values_.layergroup.state_.sourceState)
      $(".load").css("display","none");
      $(".loadBackgroud").css("display","none");
      $(".container").show();
      $("#componetes").show();
      iniciando=false;
    }
   
      });


}

function obtenerCapasKatastro() {

  var grupoCapas = [];
  for (let index = 0; index < capasKatastro.length; index++) {
    const wmsSource1 = new ol.source.ImageWMS({
      url: "http://www.geo.euskadi.eus/WMS_KARTOGRAFIA/wms",
      params: {
        'LAYERS': capasKatastro[index].capa,
        'TILED': true
      },
      serverType: 'geoserver',
      crossOrigin: "Anonymous",
      visible: false,
      title: capasKatastro[index].titulo,
      id:capasKatastro[index].id
    });

    grupoCapasLeyenda[index] = wmsSource1;

    const wmsLayer = new ol.layer.Image({
      title: capasKatastro[index].titulo,
      source: wmsSource1,
      extent: [
        //-310262.30854769825, 5325968.666454764,
        //-276906.21189239353, 5353968.547312366
        -310262.30854769825, 5321968.666454764,
        -276906.21189239353, 5353968.547312366
      ],
      visible: false,
      crossOrigin: "Anonymous",
    });
    grupoCapas[index] = wmsLayer;
  }
 
  //Layer Group
  const catastroLayerGroup = new ol.layer.Group({
    'title': 'Cartografia',
    crossOrigin: "Anonymous",
    layers: grupoCapas
  })

  


  return catastroLayerGroup;

}

function obtenerCapas(capas,nombre) {

  var grupoCapas = [];
  for (let index = 0; index < capas.length; index++) {
    const wmsSource1 = new ol.source.ImageWMS({
      url: "http://www.geo.euskadi.eus/WMS_NEKAZARITZA/wms",
      params: {
        'LAYERS': capas[index].capa,
        'TILED': true
      },
      serverType: 'geoserver',
      crossOrigin: "Anonymous",
      visible: false,
      title: capas[index].titulo,
      id:capas[index].id
    });

    grupoCapasLeyenda[index] = wmsSource1;

    const wmsLayer = new ol.layer.Image({
      title: capas[index].titulo,
      crossOrigin: "Anonymous",
      source: wmsSource1,
      extent: [
        //-310262.30854769825, 5325968.666454764,
        //-276906.21189239353, 5353968.547312366
        -310262.30854769825, 5321968.666454764,
        -276906.21189239353, 5353968.547312366
      ],
      visible: false,
      opacity: 0.8,
    });
    grupoCapas[index] = wmsLayer;
  }
 
  //Layer Group
  const catastroLayerGroup = new ol.layer.Group({
    'title': nombre,
    crossOrigin: "Anonymous",
    layers: grupoCapas
  })

  


  return catastroLayerGroup;

}


function capasBase() {

  //CAPAS MUNICIPIO
  wmsMunicipios = new ol.source.ImageWMS({
    url: "https://www.geo.euskadi.eus/WMS_NEKAZARITZA/wms", //?request=GetCapabilities&service=WMS",
    params: {
      'LAYERS': 'SIGPAC_MUN,SIGPAC_MUN_TXT',
      'TILED': true
    },
    ratio: 1,
    crossOrigin: "anonymous",
    serverType: 'geoserver'
  });
  const layerMuni = new ol.layer.Image({
    //visible: true,
    source: wmsMunicipios
  })

  const ortofoto2018 = new ol.layer.Group({
    title: 'Ortofoto',
    type: 'base',
    visible: false,
    layers: [
      new ol.layer.Image({
        source: new ol.source.ImageArcGISRest({
          type: 'base',
          ratio: 1,
          params: {},
          crossOrigin: "anonymous",
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
        })
      })
      // , new ol.layer.Image({

      //   source: new ol.source.ImageArcGISRest({
      //     type: 'base',
      //     ratio: 1,
      //     params: {},
      //     crossOrigin: "anonymous",
      //     url: "https://www.geo.euskadi.eus/geoeuskadi/rest/services/U11/WMTS_ORTO/MapServer"
      //   })
      // }),
      // layerMuni
    ]
  });

  const cartografiaBasica = new ol.layer.Group({
    title: 'Cartografia',
    type: 'base',
    visible: false,
    layers: [
      new ol.layer.Image({

        source: new ol.source.ImageArcGISRest({
          type: 'base',
          ratio: 1,
          params: {},
          crossOrigin: "anonymous",
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer'
        })
      })
      // , new ol.layer.Image({
      //   source: new ol.source.ImageArcGISRest({
      //     type: 'base',
      //     ratio: 1,
      //     params: {},
      //     crossOrigin: "anonymous",
      //     url: "https://www.geo.euskadi.eus/geoeuskadi/rest/services/U11/WMTS_KARTO/MapServer"
      //   })
      // })

    ]
  });

  const hibrido = new ol.layer.Group({
    title: 'Hibrido',
    type: 'base',
    visible: true,
    layers: [
      new ol.layer.Image({
        
        source: new ol.source.ImageArcGISRest({
          type: 'base',
          ratio: 1,
          params: {},
          crossOrigin: "anonymous",
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
        })
      }), new ol.layer.Image({
       
        source: new ol.source.ImageArcGISRest({
          type: 'base',
          ratio: 1,
          params: {},
          crossOrigin: "anonymous",
          url: "https://services.arcgisonline.com/arcgis/rest/services/Reference/World_Transportation/MapServer"
        })
      })
      // ,
      // // new ol.layer.Image({
      //   new ol.layer.Tile({
      //   source: new ol.source.TileArcGISRest({
      //     type: 'base',
      //     ratio: 1,
      //     params: {},
      //     crossOrigin: "anonymous",
      //     url: 'https://www.geo.euskadi.eus/geoeuskadi/rest/services/U11/WMTS_ORTO/MapServer'
      //   })
      // })
      // , new ol.layer.Image({
      //   source: new ol.source.ImageArcGISRest({
      //     type: 'base',
      //     ratio: 1,
      //     params: {},
      //     crossOrigin: "anonymous",
      //     url: "https://www.geo.euskadi.eus/geoeuskadi/rest/services/U11/WMTS_HIBRIDO/MapServer"
      //   })
      // })
    ]
  });

  var capaPrint= new ol.layer.Tile({
    title: 'Print',
    type: 'base',
    visible: true,
    crossOrigin: "anonymous",
    source: new ol.source.OSM()
     
  })

  //Layer Group
  const baseLayerGroupCB = new ol.layer.Group({
    // A layer must have a title to appear in the layerswitcher
    'title': 'Base maps',
    layers: [
     // capaPrint,
      ortofoto2018,
      cartografiaBasica,
      hibrido,
     
    ]
  })

  //https://www.geo.euskadi.eus/geoeuskadi/rest/services/U11/WMTS_ORTO/MapServer
  

  return baseLayerGroupCB;
}

function controlesMapa() {
  //MINIMAPA
  var source = new ol.source.OSM();
  var overviewMapControl = new ol.control.OverviewMap({
    layers: [
      new ol.layer.Tile({
        source: source
      })
    ]
  });
  map.addControl(overviewMapControl);

  //EXTENCION A URKIOLA
  var ext = new ol.control.ZoomToExtent({
    extent: [
      -325597.6536259576, 5321515.718105084,
      -261428.76838055212, 5357326.465856689
      /*-305531.45447928325, 5325968.666454764,
      -287862.8857595083, 5338968.547312366*/
    ]
  })
  map.addControl(ext);

  //BARRA ZOOM
  var zoomslider = new ol.control.ZoomSlider();
  map.addControl(zoomslider);



  //Barra escala
  controlscale=scaleControl()
  map.addControl(controlscale);

}
function scaleControl() {
  var unitsSelect= 'metric';
  var scaleType = 'scaleline';
  var scaleBarSteps = 4;
  var scaleBarText = true;
  var control;
  if (scaleType === 'scaleline') {
    control = new ol.control.ScaleLine({
      units: unitsSelect
    });
    return control;
  }
  control = new ol.control.ScaleLine({
    units: unitsSelect,
    bar: true,
    steps: scaleBarSteps,
    text: scaleBarText,
    minWidth: 140
  });
  
  return control;
}

function obtenerParcelaLayer() {
  var consultaJson;
  filtradas = [];
  filters = [];
  //consultaJson = obtenerGEOJSON(filters,"Catalogo_Parcelas_Total_eva");
  //geojsonConsulta = consultaJson;
  url = 'src/data/geojson/Catalogo_Parcelas_Total_eva.geojson';
  return fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      consultaJson = json;



      highlightStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#f508f9',
          width: 1
        }),
        fill: new ol.style.Fill({
          color: 'rgba(245, 8, 249,0.2)'
        })
      });


      var styleFunction = function (feature, resolution) {

        var styleA = new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(216, 87, 12, 0.1)'
          }),
          stroke: new ol.style.Stroke({
            color: 'rgb(216, 87, 12)',
            width: 1
          }),
          //text: createTextStyle(feature, resolution )
          text: new ol.style.Text({
            font: '12px Calibri,sans-serif',
            fill: new ol.style.Fill({
              color: '#000'
            }),
            stroke: new ol.style.Stroke({
              color: '#fff',
              width: 3
            })
          })
        });

        var parcelaPoligono = feature.get('MUNICIPIO') + "-" + feature.get('POLIGONO') + "-" + feature.get('PARCELA');
        styleA.getText().setText(parcelaPoligono);

        return styleA;
      };
      //console.log(consultaJson)
      var vectorSource = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(consultaJson, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        }),
        minZoom: zoomMinParcela,
        maxZoom: zoomMaxParcela,

      });

      capaParcelaTotal = new ol.layer.Vector({
        minZoom: zoomMinParcela,
        maxZoom: zoomMaxParcela,
        'title': 'Planeamiento',
        source: vectorSource,
        style: styleFunction,
        visible: false
      });

      featureOverlay = new ol.layer.Vector({
        source: new ol.source.Vector(),
        map: map,
        style: function (feature) {
          return highlightStyle;
        }
      });
      

      return capaParcelaTotal;
    })


  //console.log(capaParcelaTotal)
  


}
//para las parcela: MUNICIPIO-POLIGONO-PARCELA
//para las subparcela: MINICIPIO-POLIGONO-PARCELA-SUBPARCELA
function obtenerSubParcelaLayer() {
  var consultaJson;
  filtradas = [];
  filters = [];
  //consultaJson = obtenerGEOJSON(filters,"Catalogo_subparcelas");
  var cargado;
  url = 'src/data/geojson/Catalogo_subparcelas.geojson';
  return fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      consultaJson = json;
      highlightStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#f508f9',
          width: 1
        }),
        fill: new ol.style.Fill({
          color: 'rgba(245, 8, 249,0.2)'
        })
      });


      var styleFunction = function (feature, resolution) {

        var styleA = new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(59, 222, 200, 0.3)'
          }),
          stroke: new ol.style.Stroke({
            color: 'rgb(59, 222, 200)',
            width: 1
          }),
          //text: createTextStyle(feature, resolution )
          text: new ol.style.Text({
            font: '9px Calibri,sans-serif',
            fill: new ol.style.Fill({
              color: '#000'
            }),
            stroke: new ol.style.Stroke({
              color: '#fbf092',
              width: 3
            })
          })


        });

        var parcelaPoligono = feature.get('MUNICIPIO') + "-" + feature.get('POLIGONO') + "-" + feature.get('PARCELA') + "-" + feature.get('RECINTO');
        styleA.getText().setText(parcelaPoligono);
        styleA.getText().setOffsetY(15);
        //styleA.getText().setTextBaseline('top');
        return styleA;
      };
      //console.log(consultaJson)
      var vectorSource = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(consultaJson, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        }),
        minZoom: zoomMinParcela,
        maxZoom: zoomMaxParcela,
      });

      capaSubParcelaTotal = new ol.layer.Vector({
        'title': 'Planeamiento',
        source: vectorSource,
        style: styleFunction,
        visible: false,
        minZoom: zoomMinParcela,
        maxZoom: zoomMaxParcela,
      });

      featureOverlay = new ol.layer.Vector({
        source: new ol.source.Vector(),
        map: map,
        style: function (feature) {
          return highlightStyle;
        }
      });

      return capaSubParcelaTotal;
    })
    
  //map.addLayer(vectorLayer2);

 return vectorLayer2;

}



function capaMunicipios() {
  wmsMunicipios = new ol.source.ImageWMS({
    url: "https://www.geo.euskadi.eus/WMS_NEKAZARITZA/wms", //?request=GetCapabilities&service=WMS",
    params: {
      'LAYERS': 'SIGPAC_MUN,SIGPAC_MUN_TXT',
      'TILED': true
    },
    ratio: 1,
    serverType: 'geoserver'
  });

  const layer = new ol.layer.Image({
    source: wmsMunicipios
  })

  map.addLayer(layer);
}

function anadircapas(){
  var wmsSourceA = new ol.source.TileWMS({
    url: 'https://www.geo.euskadi.eus/WMS_NEKAZARITZA?request=GetCapabilities&service=WMS',
    params: {'LAYERS': 'IF_US_BOSQUES_NATURALES,IF_US_BOSQUES_PLANTACION,IF_US_MATORRAL,IF_US_PAZTIZAL,IF_US_PRADOS,IF_US_SIN_VEGETACION,IF_US_AGRARIO,IF_US_HUMEDALES,IF_US_ARTIFICIAL', 'TILED': true},
    serverType: 'geoserver',
    crossOrigin: 'anonymous',
  });
  
  var wmsLayerA= new ol.layer.Tile({
    source: wmsSourceA,
    visible: true,
  });
  //console.log(wmsSourceA)
 // console.log(wmsLayerA)
  map.addLayer(wmsLayerA);





  var grupoCapas = [];
 
    const wmsSource1 = new ol.source.ImageWMS({
      url: "http://www.geo.euskadi.eus/WMS_KARTOGRAFIA/wms",
      params: {
        'LAYERS': 'IF_US_BOSQUES_NATURALES,IF_US_BOSQUES_PLANTACION,IF_US_MATORRAL,IF_US_PAZTIZAL,IF_US_PRADOS,IF_US_SIN_VEGETACION,IF_US_AGRARIO,IF_US_HUMEDALES,IF_US_ARTIFICIAL',
        'TILED': true
      },
      serverType: 'geoserver',

      visible: false,
      title: "Usos de suelo",
      id:'0'
    });

    //grupoCapasLeyenda[index] = wmsSource1;

    const wmsLayer = new ol.layer.Image({
      title: "Usos de suelo",
      source: wmsSource1,
      extent: [
        -310262.30854769825, 5325968.666454764,
        -276906.21189239353, 5353968.547312366
        // -310362.30854769825,5325968.666454764,
        // -278906.21189239353,5348968.547312366
      ],
      visible: false,
    });
    grupoCapas[0] = wmsLayer;
 
 
  //Layer Group
  const agrarioLayerGroup = new ol.layer.Group({
    'title': 'Agrario',
    layers: grupoCapas
  })

  map.addLayer(agrarioLayerGroup);

}