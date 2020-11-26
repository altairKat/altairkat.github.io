componentecontrolCapas();

function componentecontrolCapas() {
  $("#btnControlCapas").click(function () {
    console.log("Handler for .click() called.");
  });

  $(".treejs-checkbox").click(function () {
    $("#map").css("cursor", "wait")
  });


}

function controlDeCapas() {


  let data = [{
    "id": "0",
    "text": "Ejes red viaria"
  },
  {
    "id": "1",
    "text": "Aguas"
  },
  {
    "id": "2",
    "text": "Curvas de Nivel"
  },
  {
    "id": "3",
    "text": "Sombras"
  },
  {
    "id": "4",
    "text": "Pendientes"
  },
  {
    "id": "5",
    "text": "Orientaciones"
  }
  ]
  let data_VF = [{
    "id": "10",
    "text": "Densidad media(pies/ha)"
  },
  {
    "id": "11",
    "text": "Área basimétrica (m2/ha)"
  },
  {
    "id": "12",
    "text": "Volumen medio (m3/ha)"
  },
  {
    "id": "13",
    "text": "Volumen medio >= CD40 (m3/ha)"
  },
  {
    "id": "14",
    "text": "Crecimiento anual (m3/ha-año)"
  }
  ]


  let tree = new Tree('#divControlCapas', {
    data: [{
      id: '-1',
      text: 'Cartografia',
      children: data
    },
    {
      id: '6',
      text: 'Planeamiento',
      children: [{
        "id": "7",
        "text": "Parcela"
      },
      {
        "id": "8",
        "text": "Subparcela"
      }]
    },
    {
      id: '9',
      text: 'Parametros forestales',
      children: data_VF
    },
    {
      id: '15',
      text: 'Riesgo de derribo por viento',
      /// children: data_VF
    },
    {
      id: '16',
      text: 'Mapa forestal - Uso de suelo ',
      //  children: data_VF
    }
    ],
    closeDepth: 3,
    loaded: function () {
      ides = [];
      katastroLayerGroup.getLayers().forEach(function (element, index) {
        if (katastroLayerGroup.getLayers().array_[index].getVisible()) {
          ides.push(index)
        }
      })
      //console.log(ides)
      if (iniciandasCapasPS) {
        if (capaParcelaTotal.getVisible()) ides.push('7');
        if (capaSubParcelaTotal.getVisible()) ides.push('8');
      }
      //else{
      //  cargarPlaneamiento();
      // }


      layerGroup_VF.getLayers().forEach(function (element, index) {
        if (layerGroup_VF.getLayers().array_[index].getVisible()) {
          ides.push(index + 10)
        }
      })

      layerGroup_RV.getLayers().forEach(function (element, index) {
        if (layerGroup_RV.getLayers().array_[index].getVisible()) {
          ides.push('15')
        }
      })
      layerGroup_UF.getLayers().forEach(function (element, index) {
        if (layerGroup_UF.getLayers().array_[index].getVisible()) {
          ides.push('16')
        }
      })
      this.values = ides;//['0', '1'];
    },
    onChange: function () {

      $("#map").css("cursor", "wait");
      $(".jsPanel .jsPanel-content").css("cursor", "wait");
      setTimeout(() => {


        var arrayTREE = this.values;
        //NOVISIBLES
        if (iniciandasCapasPS) {
          capaParcelaTotal.setVisible(false);
          capaSubParcelaTotal.setVisible(false);
        }
        katastroLayerGroup.getLayers().forEach(function (element) { element.setVisible(false); })
        layerGroup_VF.getLayers().forEach(function (element) { element.setVisible(false); })
        layerGroup_RV.getLayers().forEach(function (element) { element.setVisible(false); })
        layerGroup_UF.getLayers().forEach(function (element) { element.setVisible(false); })

        for (let i = 0; i < arrayTREE.length; i++) {
          const x = arrayTREE[i];
          //console.log("x" + x)

          switch (x) {

            case '7':
              //(capaParcelaTotal.getVisible())
              if (iniciandasCapasPS) {
                if (capaParcelaTotal.getVisible()) capaParcelaTotal.setVisible(false)
                else capaParcelaTotal.setVisible(true)
              } else {
                cargarPlaneamiento();
                capaParcelaTotal.setVisible(true)
              }
              break;
            case '8':
              if (iniciandasCapasPS) {
                if (capaSubParcelaTotal.getVisible()) capaSubParcelaTotal.setVisible(false)
                else capaSubParcelaTotal.setVisible(true)
              } else {
                cargarPlaneamiento();
                capaSubParcelaTotal.setVisible(true);
              }
              break;
            case '10':
            case '11':
            case '12':
            case '13':
            case '14':
              layerGroup_VF.getLayers().array_[x - 10].setVisible(true);
              break;
            case '15':
              layerGroup_RV.getLayers().array_[0].setVisible(true);
              break;
            case '16':
              layerGroup_UF.getLayers().array_[0].setVisible(true);
              break;
            default:
              katastroLayerGroup.getLayers().array_[x].setVisible(true);
              break;
          }

        }
        $("#map").css("cursor", "default")
        $(".jsPanel .jsPanel-content").css("cursor", "default");

        //ACTUALIZAMOS LA LEYENDA
        tablaLeyenda();

      }, 1000);


    }

  });
setTimeout(() => {
  visibilidadCapasZoom();
}, 200);
  

  visibilidadMoveed = function (e) {
   
    visibilidadCapasZoom();
  }
  // addEtiquetaNombreIdioma()
  map.on('moveend', visibilidadMoveed);

};


function visibilidadCapasZoom() {
  $("#divControlCapas .treejs .treejs-nodes li").css({
    "color": "grey"
  });

  var listCheckbox = document.querySelectorAll("#divControlCapas .treejs-checkbox");
  var listLabel = document.querySelectorAll("#divControlCapas .treejs-label");

  var long = listLabel.length;

  if (long > 0) {
    listLabel[0].classList.add("textoNegro");

    for (let i = 0; i < long; i++) {
      const element = listLabel[i].dataset.i18n;

      for (let j = 0; j < configZoom.length; j++) {
        const configZ = configZoom[j];
        
        if (element == configZ.i18n) {
          if (map.getView().getZoom() >= configZ.zoom) {
            listLabel[configZ.id].classList.add("textoNegro");
            listCheckbox[configZ.id].classList.remove("noVisible");
          } else if (map.getView().getZoom() <= configZ.zoom) {
            listLabel[configZ.id].classList.remove("textoNegro");
            listCheckbox[configZ.id].classList.add("noVisible");
          }
        }
      }

    }
  }



}
function addEtiquetaNombreIdioma() {
  let data = [{
    "id": "0",
    "text": "Ejes red viaria",
    "data_Idioma": "EJES_RED_VIARIA"
  },
  {
    "id": "1",
    "text": "Aguas",
    "data_Idioma": "AGUAS"
  },
  {
    "id": "2",
    "text": "Curvas de Nivel",
    "data_Idioma": "CURVAS_DE_NIVEL"
  },
  {
    "id": "3",
    "text": "Sombras",
    "data_Idioma": "SOMBRAS"
  },
  {
    "id": "4",
    "text": "Pendientes",
    "data_Idioma": "PENDIENTE"
  },
  {
    "id": "5",
    "text": "Orientaciones",
    "data_Idioma": "ORIENTACIONES"
  },
  ///////////
  {
    "id": "6",
    "text": "Planeamiento",
    "data_Idioma": "PLANEAMIENTO"
  },
  {
    "id": "7",
    "text": "Parcela",
    "data_Idioma": "PARCELA"
  },
  {
    "id": "8",
    "text": "Subparcela",
    "data_Idioma": "SUBPARCELA"
  },
  ///////////////

  {
    "id": "9",
    "text": "Parametros forestales",
    "data_Idioma": "PARAMETROS_FORESTALES"
  },
  {
    "id": "10",
    "text": "Densidad media(pies/ha)",
    "data_Idioma": "DENSIDAD_MEDIA"
  },
  {
    "id": "11",
    "text": "Área basimétrica (m2/ha)",
    "data_Idioma": "AREA_BASIMETRICA"
  },
  {
    "id": "12",
    "text": "Volumen medio (m3/ha)",
    "data_Idioma": "VOLUMEN_MEDIO"
  },
  {
    "id": "13",
    "text": "Volumen medio >= CD40 (m3/ha)",
    "data_Idioma": "VOLUMEN_MEDIO_40"
  },
  {
    "id": "14",
    "text": "Crecimiento anual (m3/ha-año)",
    "data_Idioma": "CRECIMIENTO_ANUAL"
  },
  /////
  {
    "id": "15",
    "text": "Riesgo de derribo por viento",
    "data_Idioma": "RIESGO_VIENTO"
  },
  {
    "id": "16",
    "text": "Mapa forestal - Uso de suelo",
    "data_Idioma": "MAPA_FORESTAL_US"
  }

  ]

  var listLabel = document.querySelectorAll("#divControlCapas .treejs-label");
  listLabel[0].setAttribute("data-i18n", "CARTOGRAFIA");

  data.forEach(element => {
    //console.log(element)
    var id = parseInt(element.id) + 1;
    // console.log(id)
    // console.log(element.data_Idioma)
    if (element.data_Idioma == "VOLUMEN_MEDIO_40") listLabel[id].classList.add("textoNegro");
    listLabel[id].setAttribute("data-i18n", element.data_Idioma);
  });

}


