
function consultaComponente() {
    crearMenuFormularioConsulta();
    cargarMunicipios();
    cargarPendientesTramo();
    cargarNombreCarretera();
    cargarTipoOrientacion();
    cargarTipoLitologia();
    cargarTipoEvapo();
    $("#navConsulta a").click(function () {
        $('#navConsulta a.active').removeClass('active');
        var idConsulta = $(this).attr("id");
        cargarFicha(idConsulta);
        $(this).addClass("active");
    });


}
function crearMenuFormularioConsulta() {
    // $("#contenido").append(' <footer id="footer"><div class="pie"><div class="botones" id="botones">'+
    //  '<button  type="button" class="btnConsultar" onclick="btnConsulta()" data-i18n="CONSULTA">Consulta</button>'+
    //  '<button  type="button" class="btnLimpiar" onclick="btnLimpiarConsulta()" data-i18n="LIMPIAR">Limpiar</button>'+
    //  '</div></div></footer>')

}
function cargarFicha(idConsulta) {

    $('#contenido').find('#contenidoDatosGenerales').hide();
    $('#contenido').find('#contenidoCF').hide();
    $('#contenido').find('#contenidoLitologia').hide();
    $('#contenido').find('#contenidoHumedad').hide();
    $('#contenido').find('#contenidoCalificacion').hide();
    $('#contenido').find('#contenidoBosques').hide();
    $('#contenido').find('#contenidoSIGPAC').hide();


    switch (idConsulta) {
        case "consulta1":

            if ($("#contenido").find("#contenidoDatosGenerales").length != 0) {
                panelDGFiltroSuperficie();

                $('#contenido').find('#contenidoDatosGenerales').show();
            } else {
                // // alert("a");
                // // console.log("que me pasa")
                // panelDatosGenerales();
                // panelDGFiltroSuperficie();
            }
            iconoConsultaEmpezada("#contenidoDatosGenerales", idConsulta);
            break;
        case "consulta2":
            if ($("#contenido").find("#contenidoCF").length != 0) {

                $('#contenido').find('#contenidoCF').show();
                rangeSlider();
                habilitarDeshabilitar();
            }
            iconoConsultaEmpezada("#contenidoCF", idConsulta)
            break;
        case "consulta3":
            if ($("#contenido").find("#contenidoLitologia").length != 0) {
                $('#contenido').find('#contenidoLitologia').show();
            }
            iconoConsultaEmpezada("#contenidoLitologia", idConsulta)
            break;

        case "consulta5":
            if ($("#contenido").find("#contenidoCalificacion").length != 0) {
                $('#contenido').find('#contenidoCalificacion').show();
            }
            break;
        case "consulta6":
            if ($("#contenido").find("#contenidoBosques").length != 0) {
                $('#contenido').find('#contenidoBosques').show();
            }
            iconoConsultaEmpezada("#contenidoBosques", idConsulta)
            break;
        case "consulta7":
            if ($("#contenido").find("#contenidoSIGPAC").length != 0) {
                $('#contenido').find('#contenidoSIGPAC').show();
            }
            iconoConsultaEmpezada("#contenidoSIGPAC", idConsulta)
            break;

        default:
            break;
    }
    // $('#contenido').find('#footer').show();
    cambiarIdioma(currentLng);
}

function panelDGFiltroSuperficie() {

    $("#filtroAreaM2 a").click(function () {
        var valor = $(this).text();
        if (valor == ">") valor = "&gt;"
        else if (valor == ">=") valor = "&gt;=";

        $("#btnAreaM2.dropdown-toggle").html(valor + '&nbsp;<span class="caret" value=' + valor + '></span>')

    })
}

function habilitarDeshabilitar() {
    $("#customSwitch1").change(function () {

        if ($(this).is(':checked')) {
            $("#inputDistanciaCarretera").val($("#inputDistanciaCarretera option:nth-child(2)").val());
            $("#inputDistanciaCarretera").attr("disabled", "disabled");
            //$("#inputCarretera").removeAttr("disabled", "disabled");

        } else {

            $("#inputDistanciaCarretera").removeAttr("disabled", "disabled");
            //$("#inputCarretera").attr("disabled", "disabled");
        }
    });



    $("#customSwitch2").change(function () {

        if ($(this).is(':checked')) {
            // $("input#inputFuente").removeAttr("disabled", "disabled");
            $("#inputDistanciaFuente").val($("#inputDistanciaFuente option:nth-child(2)").val());
            $("select#inputDistanciaFuente").attr("disabled", "disabled");
        } else {
            //$("input#inputFuente").attr("disabled", "disabled");
            $("select#inputDistanciaFuente").removeAttr("disabled", "disabled");
        }
    });

}

function iconoConsultaEmpezada(idDiv, idCosulta) {
    $('#contenido ' + idDiv + ' :input').change(function () {

        if (this.value.length > 0) {
            $('#' + idCosulta).css("text-decoration", "underline");
        } else {
            //console.log(idDiv)
            var inputsTotales = 0;
            for (let index = 0; index < $('#contenido ' + idDiv + ' :input').length; index++) {
                const element = $('#contenido ' + idDiv + ' :input')[index];
                if (element.value.length > 0) {
                    inputsTotales++;
                }
            }
            //console.log(inputsTotales)
            if (inputsTotales == 0) $('#' + idCosulta).css("text-decoration", "none");;

        }
    });



}

function btnConsulta() {
    $("#map").css("cursor", "wait");
    $(".jsPanel .jsPanel-content").css("cursor", "wait");

    //crearPanelTabla();
    var filtro = [];
    var divsConsulta = ['#contenidoDatosGenerales', '#contenidoCF', '#contenidoLitologia', '#contenidoCalificacion', '#contenidoBosques', '#contenidoSIGPAC'];
    const obtenerFiltros = divsConsulta => {
      
        return new Promise((resolve) => {
         
            divsConsulta.forEach(contenido => {

                for (let index = 0; index < $('#contenido ' + contenido + ' :input').length; index++) {
                    const element = $('#contenido ' + contenido + ' :input')[index];

                    if (element.value.length > 0) {
                        ////console.log(element.id + " " + $(element).attr("tag") + "   :" + element.value)
                        var tag = $(element).attr("tag");
                        var valor = element.value;
                        if (tag == "POLY_AREA") {
                            var signo = $("#btnAreaM2.dropdown-toggle span").attr('value')
                            filtro.push({ tag, valor, signo })
                        } else {
                            filtro.push({ tag, valor })
                        }


                    }
                }
            });
            console.log(filtro)
            resolve(filtro)
        });
    }
setTimeout(() => {
    obtenerFiltros(divsConsulta).then(res => {
        return res;
    }).then(filtro => {
        filtrosBusqueda(filtro);
    }).catch(error => {
        console.error(error);
    })
}, 500);
    


}

function btnLimpiarConsulta() {
    map.removeLayer(vectorLayer);
    var divsConsulta = ['#contenidoDatosGenerales', '#contenidoCF', '#contenidoLitologia', '#contenidoCalificacion', '#contenidoBosques', '#contenidoSIGPAC'];

    divsConsulta.forEach(contenido => {

        for (let index = 0; index < $('#contenido ' + contenido + ' :input').length; index++) {
            const element = $('#contenido ' + contenido + ' :input')[index];
            if (element.value.length > 0) {
                element.value = '';
            }
        }
    });
    $('.nav-tabs li a').css("text-decoration", "none");
    if (panelTabla != undefined) {
        panelTabla.close();
    }
    map.removeLayer(vectorOVER);
}

function resizePanel(panel) {
    var ancho, ampliar, habilitar;
    habilitar = 'enable';
    ancho = window.innerWidth * 0.55;

    if (window.innerWidth <= "900") {
        ampliar = 70;
    } else if (window.innerWidth > "900" && window.innerWidth < "1280") {
        ampliar = 40;
    } else {
        ampliar = 30;
        ancho = 945;
    }

    if (panel != undefined && panel != "cerrado") {
        panel.resize({
            width: ancho,
            height: 'auto'
        })
        //console.log(habilitar + " - " + ampliar)

        panel.resizeit(habilitar);
        panel.options.resizeit.minWidth = ancho - ampliar;
        panel.options.resizeit.maxWidth = ancho + ampliar;
    }

    return ancho;
}

function cargarMunicipios() {
    var select = document.getElementById("inputState");

    municipiosCod.forEach(element => {
        var option = document.createElement("option");
        option.text = element.name;
        option.setAttribute('value', element.value);
        select.add(option);

    });
}

function cargarPendientesTramo() {
    var select = document.getElementById("inputPendienteMedia");

    codPendientesTramos.forEach(element => {
        var option = document.createElement("option");
        option.text = element.name;
        option.setAttribute('value', element.value);
        select.add(option);

    });
}
function cargarNombreCarretera() {
    var select = document.getElementById("inputCarretera");

    tiposCarretera.forEach(element => {

        var option = document.createElement("option");
        option.text = element.name;
        option.setAttribute('value', element.value);
        option.setAttribute('data-i18n', element.data);
        select.add(option);

    });
}
function cargarTipoLitologia() {
    var select = document.getElementById("inputTIPO_SUELO");

    tiposLitologias.forEach(element => {

        var option = document.createElement("option");
        option.text = element.name;
        option.setAttribute('value', element.value);
        option.setAttribute('data-i18n', element.data);
        select.add(option);

    });
}
function cargarTipoEvapo() {
    var select = document.getElementById("inputTIPO_EVAPO");

    tiposEvapo.forEach(element => {

        var option = document.createElement("option");
        option.text = element.name;
        option.setAttribute('value', element.value);
        option.setAttribute('data-i18n', element.data);
        select.add(option);

    });
}

function cargarTipoOrientacion() {
    var select = document.getElementById("inputOrientacion_Media");

    tipoOrientacion.forEach(element => {

        var option = document.createElement("option");
        option.text = element.name;
        option.setAttribute('value', element.value);
        option.setAttribute('data-i18n', element.data);
        select.add(option);

    });
}
function panelDatosGenerales() {
    $("#contenido").append('<div id="contenidoDatosGenerales"></div>');
    $("#contenido #contenidoDatosGenerales").append(

        ' <div class="form-row"><div class="form-group col-md-4 col-4 col-sm-4 col-xs-4">' +
        '<label for="inputState" data-i18n="MUNICIPIOS">Municipios</label>' +
        '<select id="inputState" tag="MUNICIPIOS" class="form-control">' +
        '<option selected ></option>' +
        '<option value="1">Abadiño</option>' +
        '<option value="3">Amorebieta-Etxano</option>' +
        '<option value="91">Atxondo</option>' +
        '<option value="19">Berriz</option>' +
        '<option value="27">Durango</option>' +
        '<option value="32">Elorrio</option>' +
        '<option value="34">Ermua</option>' +
        '<option value="39">Garai</option>' +
        '<option value="910">Iurreta</option>' +
        '<option value="50">Izurtza</option>' +
        '<option value="58">Mallabia</option>' +
        '<option value="59">Manaria</option>' +
        '<option value="95">Zaldibar</option>' +
        
        ' </select>' +
        ' </div>' +

        '  <div class="form-group col-md-4 col-4 col-sm-4 col-xs-4"><label for="inputAreaM2" data-i18n="AREA_M2">Area (m2)</label>' +
        '<div class="input-group ">' +
        '<div class="input-group-btn"> <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" id="btnAreaM2"> = <span class="caret" value="="></span></button>' +
        '<ul class="dropdown-menu" role="menu" id="filtroAreaM2">' +
        ' <li><a href="#" >&gt;</a></li>' +
        ' <li><a href="#">&lt;</a></li>' +
        ' <li><a href="#">=</a></li>' +
        ' <li><a href="#">&gt; =</a></li>' +
        ' <li><a href="#">&lt; =</a></li>' +
        '   </ul>' +
        '  </div> <input  type="number" class="form-control" id="inputAreaM2" tag="POLY_AREA">' +
        ' </div>' +
        ' </div>' +


        ' <div class="form-group col-md-4 col-4 col-sm-4 col-xs-4"><label for="inputPoligono" data-i18n="POLIGONO">Polígono </label>' +
        ' <input type="number" class="form-control" id="inputPoligono" tag="POLIGONO"></div>' +
        ' <div class="form-group col-md-4 col-4 col-sm-4 col-xs-4"> <label for="inputParcela" data-i18n="PARCELA">Parcela</label>' +
        ' <input type="number" class="form-control" id="inputParcela" tag="PARCELA"></div>' +
        ' </div>'

    );

    $("#contenido #contenidoDatosGenerales").append(
        '<div class="form-row">' +
        '<div class="form-group col-md-4 col-4 col-sm-4 col-xs-4"><label for="inputCoordX"  data-i18n="COORD_X">Coord X</label>' +
        ' <input  type="number" class="form-control" id="inputCoordX" placeholder="X" tag="COORDX"></div>' +
        ' <div class="form-group col-md-4 col-4 col-sm-4 col-xs-4"><label for="inputCoordY"  data-i18n="COORD_Y" >Coord Y</label>' +
        '<input  type="number" class="form-control" id="inputCoordY" placeholder="Y" tag="COORDX" ></div>' +
        '</div>'
    );
    $("#contenido #contenidoDatosGenerales").append(



    );

    $("#filtroAreaM2 a").click(function () {
        var valor = $(this).text();
        if (valor == ">") valor = "&gt;"
        else if (valor == "> =") valor = "&gt; =";

        $("#btnAreaM2.dropdown-toggle").html(valor + '&nbsp;<span class="caret" value=' + valor + '></span>')

    })
}
