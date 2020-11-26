var panelConsulta = undefined;
var panelConsultaPredetermiada;
var panelInformacion;
var panelControlCapas;
var panelLeyenda;
var panelOrtofotos;
var baseLayerGroup;
var panelConsultaStatus;

function cargarModales() {

    //PANEL DE CONSULTA 
    $("#btnConsulta").click(function () {
        if (panelConsulta == undefined) {
            widthConsulta = resizePanel(panelConsulta);
            consultaComponente();
            cargarFicha("consulta1");
           // config = config();

            //panelConsulta = jsPanel.create(config.consulta);
            panelConsulta = jsPanel.create({
                id: "panelConsulta",
                theme: 'primary',
                headerTitle: 'CONSULTA',
                headerControls: {
                    add: {
                        html: '<svg focusable="false" class="jsPanel-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22"><path fill="currentColor" d="M13.7,11l6.1-6.1c0.4-0.4,0.4-0.9,0-1.3l-1.4-1.4c-0.4-0.4-0.9-0.4-1.3,0L11,8.3L4.9,2.3C4.6,1.9,4,1.9,3.7,2.3L2.3,3.7 C1.9,4,1.9,4.6,2.3,4.9L8.3,11l-6.1,6.1c-0.4,0.4-0.4,0.9,0,1.3l1.4,1.4c0.4,0.4,0.9,0.4,1.3,0l6.1-6.1l6.1,6.1 c0.4,0.4,0.9,0.4,1.3,0l1.4-1.4c0.4-0.4,0.4-0.9,0-1.3L13.7,11z"></path></svg>',
                        name: 'reset',
                        handler: function (panel, control) {
                            $(panelConsulta).hide();//Oculatamos el panel para poder guardar los datos
                            panelConsultaStatus = "cerrado";
                        },
                        position: 5
                    },
                    close: 'remove',
                    maximize: 'remove'
                },
                dragit: {
                    //Para limitar el movimiento de la modal 
                    containment: [60, 20, 20, 20]
                },
                position: 'center-top  0 120',
                panelSize: {
                    width: widthConsulta,
                    height: 'auto',
                },
                resizeit: {
                    handles: 'w ,e,se',//'n, e, s, w, ne, se, sw, nw',
                    minWidth: widthConsulta - 55,
                   // minHeight: 195,
                    maxWidth: widthConsulta + 25
                },
                content: document.getElementById("consultaComponente"),// document.getElementById("navConsulta"),
                borderRadius: '0.5rem',
                boxShadow: 5,
                maximizedMargin: 180,
                onnormalized: function(panel, status) {
                    console.log(status)
                    resizePanel(panel);
                },
                onsmallified: function(panel, status) {
                    console.log(status)
                    //resizePanel(panel);
                },
                onwindowresize: function (event, panel) {
                    resizePanel(panel);
                },
                callback: function () {
                    this.content.style.padding = '20px';
                },
                onclosed: function (panel, closedByUser) {
                    $(panelConsulta).hide();
                    resizePanel(panelConsulta);
                }
            })
            resizePanel(panelConsulta);

        } else if (panelConsultaStatus == "cerrado") {
            //cambiarIdioma(currentLng);

            $(panelConsulta).show();
            panelConsultaStatus = "";
            resizePanel(panelConsulta);
        } else {
            panelConsulta.normalize();
            resizePanel(panelConsulta);
        
        }

    });

    //i18n.t('CONSULTA')
    //PANEL DE CONSULTAS PREDETERMINADAS 
    $("#btnConsultaPredeterminada").click(function () {
        //console.log(panelConsultaPredetermiada)

        $("#consultasPredeterminadasComponente").append('<div id="consultaPredeterminada"></div>');
        
        if (panelConsultaPredetermiada == undefined) {
            consultaAgricolaHTML();
            //consultaComponente();
            //cargarFicha("consulta1");
            panelConsultaPredetermiada = jsPanel.create({
                id: "panelConsultasPredeterminadas",
                theme: 'primary',
                headerTitle: 'CONSULTA_PREDETERMINADA',
                headerControls: {
                    maximize: 'remove'
                },
                position: 'center 0 58',
                panelSize: {
                    width: 'auto',
                    //580,
                    height: '23em'
                },
                dragit: {
                    containment: [60, 20, 20, 20]
                },
              
                resizeit: {
                    handles: 'n, e, s, w, ne, se, sw, nw',
                    maxWidth: 575,
                    minWidth: 375,
                    maxHeight: 310,
                   
                },
                content: document.getElementById("consultaPredeterminada"),
                borderRadius: '0.5rem',
                boxShadow: 5,
                maximizedMargin: 60,
                callback: function () {
                    this.content.style.padding = '20px';
                },
                onclosed: function (panel, closedByUser) {
                    panelConsultaPredetermiada = undefined;
                }
            });
            deshabilitarSuelos();
            cambiarIdioma(currentLng);
        } else {
            panelConsultaPredetermiada.normalize();
        }
    });

    //PANEL DE i de INFORMACION    
    $("#btnInformacion").click(function () {

        addCapaInfo();

        $("#informacionComponente").append('<div id="info" ><p id="info_click" data-i18n="MENSAJE_CLICK_MAPA">Para ver la ficha de una parcela haga click en la PARCELA en el mapa</p></div>');
        if (panelInformacion == undefined) {
            panelInformacion = jsPanel.create({
                id: "panelInformacion",
                theme: 'primary',
                headerTitle: 'INFORMACION',
                headerControls: {
                    maximize: 'remove'
                },
                position: 'center-top -30 110',
                panelSize: {
                    width: 350,
                    height: 430
                },
                resizeit: {
                    handles: ' e, s, w, , se, sw ',
                    maxWidth: 390
                },
                dragit: {
                    containment: [60, 20, 20, 20]
                },
                content: document.getElementById("info"),
                borderRadius: '0.5rem',
                boxShadow: 5,
                maximizedMargin: 60,
                footerToolbar: '' +
                    '<span id="btn-descargar" class="jsPanel-ftr-btn"><i class="fa fa-download" aria-hidden="true" style="padding: 0.25rem;     cursor: pointer;"></i></span>',
                callback: function (panel) {
                    this.content.style.padding = '20px';
                    // handlers for the toolbar items like:
                    jsPanel.pointerup.forEach(function (evt) {
                        panel.footer.querySelector('#btn-descargar').addEventListener(evt, function () {
                            /////////////////
                           // console.log(domImagen)
                            try {
                                domImagen.then(function(value) {
                                     //console.log(value)
                                    //console.log(feature.get('MUNICIPIO'))
                                    crearPDF(value,featureDatos)
                                  }).then(function(){
                                      // download the PDF
                                      pdfMake.createPdf(defTabla).download(nombrePDF+'.pdf');
                                  });
                            } catch (error) {
                                ventanaErrorCaptura(domImagen)
                            }
                            
                            //////////////
                           
                           


                        });

                    });
                },
                onclosed: function (panel, closedByUser) {
                    panelInformacion = undefined;
                    quitarOverlay(undefined);
                    map.un('click', displayFeatureInfo);
                },
                //headerControls: 'closeonly'
                draggable: {
                    handle: 'div.jsPanel-content'
                }, // added to have a handle to drag the toolbar
            });
            cambiarIdioma(currentLng);
        } else {
            panelInformacion.normalize();
        }


    });

    //PANEL DE CONTROL DE CAPAS 
    $("#btnControlCapas").click(function () {
        // $("#controlCapasComponente").append('<div id="layers" class="layer-switcher"></div>');
        $("#controlCapasComponente").append('<div id="divControlCapas"> </div>');
        controlDeCapas();
        if (panelControlCapas == undefined) {
            panelControlCapas = jsPanel.create({
                id: "panelControlCapas",
                theme: 'primary',
                headerTitle: 'CONTROL_CAPAS',
                headerControls: {
                    maximize: 'remove'
                },
                position: 'center-top -40 110',
                // position: {
                //     my: "right-center",
                //     at: "right-center",
                //     offsetX: -10,
                //     offsetY: -150
                //   },
                panelSize: {
                    width: 360,
                    height: '38em'
                },
                dragit: {
                    containment: [60, 20, 20, 20]
                },
                borderRadius: '0.5rem',
                content: document.getElementById("divControlCapas"),
                boxShadow: 5,
                maximizedMargin: 60,
                callback: function () {
                    this.content.style.padding = '20px';
                },
                onclosed: function (panel, closedByUser) {
                    // controlDeCapas();
                    panelControlCapas = undefined;
                }

            });
            addEtiquetaNombreIdioma();
            cambiarIdioma(currentLng);
            // $("#layers .group.layer-switcher-base-group").hide();
            // $("#layers .group.layer-switcher-base-group").css("display", "none")
        } else {
            panelControlCapas.normalize();
        }

    });

    // PANEL DE LEYENDA 
    $("#btnleyenda").click(function () {

        $("#leyendaComponente").append('<div id="leyendas"></div>');
        if (panelLeyenda == undefined) {
            panelLeyenda = jsPanel.create({
                id: "panelLeyenda",
                theme: 'primary',
                headerTitle: 'LEYENDA',
                headerControls: {
                    maximize: 'remove'
                },
                // position: 'center-top 0 58',
                position: {
                    my: "right-center",
                    at: "right-center",
                    offsetX: -10,
                    offsetY: 100
                },
                dragit: {
                    containment: [60, 20, 20, 20]
                },
                contentSize: '430 450',
                content: document.getElementById("leyendas"),
                // content: document.getElementById("leyendaComponente"),
                borderRadius: '0.5rem',
                boxShadow: 5,
                maximizedMargin: 60,
                callback: function () {
                    this.content.style.padding = '20px';
                },
                onclosed: function (panel, closedByUser) {
                    //  addLeyenda();
                    panelLeyenda = undefined;
                }
                /*,
                            onbeforeclose: function () {
                                return confirm('Do you really want to close the panel?');
                            }*/
            });
            // addLeyenda()
            $("#leyendas").empty();
            tablaLeyenda();
            cambiarIdioma(currentLng);
        } else {
            panelLeyenda.normalize();
        }
    });

    // PANEL  Control de capas base - Ortofotos 
    $("#btnOrtofotos").click(function () {

        $("#ortofotosComponente").append(
            '<div id="orto" class="capasBase">' +
            // '<label for="">Capas base</label>' +
            // '<ul id="base-group">' +
            // '<li class=""><input type="checkbox" value="Ortofoto 2018" id="Ortofoto"><label for="" >Ortofoto 2018</label></li>' +
            // '<li class=""><input type="checkbox" id="Cartografia" value="Cartografia basica"><label >Cartografia basica</label></li>' +
            // '<li class=""> <input type="checkbox" id="Hibrido" value="Hibrido" checked><label >Hibrido</label></li>' +
            // '</ul>' +
            '</div>'

        );

        if (panelOrtofotos == undefined) {
            panelOrtofotos = jsPanel.create({
                id: "panelOrtofotos",
                theme: 'primary',
                headerTitle: 'CONTROL_CAPAS_BASE',
                headerControls: {
                    maximize: 'remove'
                },
                // position: 'center-top 0 58',
                position: {
                    my: "right-center",
                    at: "right-center",
                    offsetX: -10,
                    offsetY: 100
                },
                dragit: {
                    containment: [60, 20, 20, 20]
                },
                contentSize: '250 150',
                content: document.getElementById("orto"),
                borderRadius: '0.5rem',
                boxShadow: 5,
                maximizedMargin: 60,
                callback: function () {
                    this.content.style.padding = '20px';
                },
                onclosed: function (panel, closedByUser) {

                    panelOrtofotos = undefined;
                }
            });
            //componenteOrtofotos();

            addElementosORTOS();
            cambiarIdioma(currentLng);
        } else {
            panelOrtofotos.normalize();
        }
    });

}



