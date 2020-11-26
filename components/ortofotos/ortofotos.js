function componenteOrtofotos() {

    $('input[type="checkbox"]').not(this).prop('checked', false);
    obtenerCapaBaseActiva();
    $('#base-group li input').change(function () {
        $('input[type="checkbox"]').not(this).prop('checked', false);
        //console.log($(this).is(':checked'))
        var valor = $(this).attr("id");
        var checkTF = $(this).is(':checked');
        baseLayerGroup.getLayers().forEach(function (element, index, array) {
            let baseLayerTitle = element.get("title");
            ////console.log(element)
            if (baseLayerTitle === valor) {
                element.setVisible(checkTF);
            } else {
                element.setVisible(baseLayerTitle === valor);
            }

        })
    });

}

function obtenerCapaBaseActiva() {
    var capaBaseActiva;
        baseLayerGroup.getLayers().forEach(function (element, index, array) {
    
            let baseLayerTitle = element.get("title");
            //console.log(baseLayerTitle + " : " + element.getVisible())
            //console.log('input#' + baseLayerTitle)
            if (element.getVisible()) {
                //console.log('input#' + baseLayerTitle)
                $('input#' + baseLayerTitle).prop('checked', true);
                capaBaseActiva=element.get("title");
            }
    
        })
    return capaBaseActiva;
}


var treeORTOS;

function addElementosORTOS() {
    let datas = [{
            "id": "0",
            "text": "Ortofoto 2018",
            "name": "Ortofoto"
        },
        {
            "id": "1",
            "text": "Cartografia basica",
            "name": "Cartografia"
        },
        {
            "id": "2",
            "text": "Hibrido",
            "name": "Hibrido"
        }

    ]

    treeORTOS = new Tree('#orto', {
        data: datas,
        closeDepth: 3,
        type:"only",
        loaded: function () {
            var ides = [];
            baseLayerGroup.getLayers().forEach(function (element,index) {
                if(baseLayerGroup.getLayers().array_[index].getVisible()){
                  ides.push(index)
                }
            })
            this.values = ides;
           
        },
        onChange: function () {
            // console.log(this)
            var elementoSeleccionado = this.values;
          
            if(elementoSeleccionado.length>0){
                for (let i = 0; i < elementoSeleccionado.length; i++) {
                   // console.log(elementoSeleccionado)
                    const x = elementoSeleccionado[i];
                    var valor = this.nodesById[x].name
                    baseLayerGroup.getLayers().forEach(function (element, index, array) {
                        let baseLayerTitle = element.get("title");
                        // console.log(baseLayerTitle + "  -  " + valor)

                        if (baseLayerTitle === valor) {
                            element.setVisible(true);
                        } else {
                            element.setVisible(false);
                        }

                    })
                }
            }else{
                baseLayerGroup.getLayers().forEach(function (element) { element.setVisible(false);})
            }


        }

    })

    var listLabel = document.querySelectorAll("#orto .treejs-label");
        listLabel[0].setAttribute("data-i18n", "ORTOFOTO_2018");
        listLabel[1].setAttribute("data-i18n", "CARTOGRAFICA_BASICA");
        listLabel[2].setAttribute("data-i18n", "HIBRIDO");
}