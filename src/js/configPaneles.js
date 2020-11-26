
var widthConsulta=0;
function config(){
    var predefinedConfigs = {
        consulta: {
            id: "panelConsulta",
            theme: 'primary',
            headerTitle: 'CONSULTA',
            headerControls: {
                add: {
                  html: '<svg focusable="false" class="jsPanel-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22"><path fill="currentColor" d="M13.7,11l6.1-6.1c0.4-0.4,0.4-0.9,0-1.3l-1.4-1.4c-0.4-0.4-0.9-0.4-1.3,0L11,8.3L4.9,2.3C4.6,1.9,4,1.9,3.7,2.3L2.3,3.7 C1.9,4,1.9,4.6,2.3,4.9L8.3,11l-6.1,6.1c-0.4,0.4-0.4,0.9,0,1.3l1.4,1.4c0.4,0.4,0.9,0.4,1.3,0l6.1-6.1l6.1,6.1 c0.4,0.4,0.9,0.4,1.3,0l1.4-1.4c0.4-0.4,0.4-0.9,0-1.3L13.7,11z"></path></svg>',
                  name: 'reset',
                  
                  handler: function(panel, control){
                    $(panelConsulta).hide();//Oculatamos el panel para poder guardar los datos
                    panelConsultaStatus="cerrado";
                   
                  },
                  position: 5
                },
                close: 'remove',
                maximize: 'remove'
              },
              dragit: {
                containment: [60, 20, 20, 20]
            },
            position: 'center',
            panelSize: {
                width: widthConsulta,
                height: 'auto',
            },
            resizeit:  {
                handles: 'w ,e',
                minWidth: widthConsulta-25,
               // minHeight: 38,
                maxWidth:widthConsulta+25
            },
            content: document.getElementById("consultaComponente"),// document.getElementById("navConsulta"),
            borderRadius: '0.5rem',
            boxShadow: 5,
            maximizedMargin: 180,
    
            onwindowresize: function (event, panel) {
                // //console.log(panel.options.position)
                // panel.reposition(panel.options.position);
                resizePanel(panel);
                      jsPanel.layout.save({
                            selector: '.jsPanel-standard',
                            storagename: 'mypanels'
                        });

            }, 
            callback: function () {
                this.content.style.padding = '20px';
            },
            onclosed: function (panel, closedByUser) {
                // panelConsulta = "cerrado";
                // estadoConsulta=$(panelConsulta).clone();
                // console.log( estadoConsulta);
                $(panelConsulta).hide()
            }
        }
    };
    return predefinedConfigs;
}
