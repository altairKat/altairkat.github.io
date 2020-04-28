let map, view, graphicsLayerUser, graphicsLayerKML;
var appConfig;

let userLocation;

window.addEventListener('load', event => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(registration => console.log('SERVICE WORKER SUCCESFULLY REGISTERED')) 
            .catch(err => console.log('[!!!] FAILED TO REGISTER SERVICE WORKER'));

        // Evento de sincronización
        // navigator.serviceWorker.ready.then(function (swRegistration) {
        //   return swRegistration.sync.register('image-fetch');
        // });
    };

    getUserLocation();

    require([
        'esri/Map',
        'esri/views/MapView',
        'esri/views/SceneView',
        'esri/layers/GraphicsLayer'
    ], (Map, MapView, SceneView, GraphicsLayer) => {
         appConfig = {
            mapView: null,
            sceneView: null,
            activeView: null,
            container: "viewDiv", // use same container for views
            zoom: 15,
            center: [userLocation.longitude, userLocation.latitude],
        };

        var initialViewParams = {
            zoom: appConfig.zoom,
            center: appConfig.center,
            container: appConfig.container
        };
        map = new Map({
            basemap : 'gray-vector'
        });
       
        ////////////////////////////////////////////////////////////////////////
        // create 2D view y lo iniciamos
        appConfig.mapView = createView(initialViewParams, "2d");
        appConfig.mapView.map = map;
        appConfig.activeView = appConfig.mapView;

        // create 3D view, sin iniciarlo
        initialViewParams.container = null;
        initialViewParams.map = map;
        appConfig.sceneView = createView(initialViewParams, "3d");
        var switchButton = document.getElementById("switch-btn");

        switchButton.addEventListener("click", function () {
            switchView();
        });
        ////////////////////////////////////////////////////////////////////////
        appConfig.activeView.ui.remove('zoom');
        appConfig.sceneView.ui.remove('zoom');

        appConfig.activeView.on('click', evt => {
            console.log('LONG: ' + evt.mapPoint.longitude.toString() + ', LAT: ' + evt.mapPoint.latitude.toString());
            let distance = calculateDistance(userLocation, {
                'latitude'  : evt.mapPoint.latitude,
                'longitude' : evt.mapPoint.longitude
            });
            beep(distance);
            console.log('DISTANCE TO USER: ' + distance + ' meters');
           
            let distanceKM=distance/1000;
            distanceKM=distanceKM.toFixed(2)
            document.getElementById('distancia').innerHTML =distanceKM+'km';
        })
        appConfig.activeView.on('zoomIn', evt => {
            console.log('ZOOM');
        })
        graphicsLayerUser = new GraphicsLayer({
            elevationInfo: {
                mode: "relative-to-scene"
            }
        })
        graphicsLayerKML = new GraphicsLayer({
            elevationInfo: {
                mode: "on-the-ground"
            }
        });
        map.addMany([
            graphicsLayerUser,
            graphicsLayerKML
        ]);
        drawPoint(userLocation.longitude, userLocation.latitude);
        
        // Switches the view from 2D to 3D and viceversa
        function switchView() {
            var is3D = appConfig.activeView.type === "3d";
            var activeViewpoint = appConfig.activeView.viewpoint.clone();

            appConfig.activeView.container = null;

            if (is3D) {
                appConfig.mapView.viewpoint = activeViewpoint;
                appConfig.mapView.container = appConfig.container;
                appConfig.activeView = appConfig.mapView;
                appConfig.sceneView.map.ground=[];
                switchButton.value = "3D";
            } else {
                appConfig.sceneView.viewpoint = activeViewpoint;
                appConfig.sceneView.container = appConfig.container;
                appConfig.activeView = appConfig.sceneView;
                appConfig.sceneView.map.ground='world-elevation'
                switchButton.value = "2D";
            }
        }

        function createView(params, type) {
            view = (type === '2d') ? new MapView(params) : new SceneView(params);
            return view;
        }
    });
});

window.addEventListener('online', event => { console.log('ONLINE'); });

window.addEventListener('offline', event => { console.log('OFFLINE'); });

document.getElementById('centerView').addEventListener('click', event => {
    appConfig.activeView.center = [userLocation.longitude, userLocation.latitude];
});

document.getElementById('routeSelector').addEventListener('change', event => {
    let opt = document.getElementById("routeSelector").getElementsByTagName('option')[document.getElementById("routeSelector").selectedIndex];
   console.log(opt)
   var footer = document.getElementById('footer');
    footer.style.display = "block";
    loadKML(opt.getAttribute('data-route'));
});

document.getElementById('routeSelector2').addEventListener('change', event => {
    let opt = document.getElementById("routeSelector2").getElementsByTagName('option')[document.getElementById("routeSelector2").selectedIndex];
   let nombreRuta=document.getElementById("routeSelector2").getElementsByTagName('option')[document.getElementById("routeSelector2").selectedIndex].text;

   if(nombreRuta!='Busca un lugar o dirección'){
    $('.route-name').html(nombreRuta);
    loadKML(opt.getAttribute('data-route'));
   }else{
    $('.route-name').html('');
   }
  
});

document.getElementById('removeRoutes').addEventListener('click', event => {
    graphicsLayerKML.removeAll();
    document.getElementById("routeSelector").selectedIndex = 0;
});

function getUserLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            console.log('USER LOCATION [LONG: ' + position.coords.longitude + ' | LAT: ' + position.coords.latitude + ']');
            userLocation = {
                'latitude'  : position.coords.latitude,
                'longitude' : position.coords.longitude
            };
        }, err => {
            alert('[!!!] PLEASE ENABLE YOUR GPS POSITION FEATURE')
        }, {
            enableHighAccuracy : true,
            maximumAge         : 10000, 
            timeout            : 5000, 
        });
    } else {
       console.log('[!!!] GEOLOCATION IS NOT SUPPORTED BY THIS BROWSER');
    }
}

window.setInterval(function(){
    getUserLocation();
    if(graphicsLayerUser!=undefined)graphicsLayerUser.removeAll();
    drawPoint(userLocation.longitude, userLocation.latitude);
}, properties.userLocationRefresh);

function drawPoint(long, lat){
    require([
          'esri/Graphic'
    ], Graphic => {
        let point = {
            latitude  : lat,
            longitude : long,
            type      : 'point'
        };
        let simpleMarkerSymbol = {
            color   : [0, 0, 0],
            outline : {
                color : [150, 150, 150],
                width : 2
            },        
            type    : 'simple-marker'
        };
        let pointGraphic = new Graphic({
            geometry : point,
            symbol   : simpleMarkerSymbol
        });
        graphicsLayerUser.add(pointGraphic);
    });
};

function loadKML (kmlFile){
    require([
          'esri/Graphic'
    ], Graphic => {
        if(graphicsLayerKML!=undefined)graphicsLayerKML.removeAll();
        
        if(kmlFile != null){
            console.log('LOADING KML FILE: ' + kmlFile + '.kml');
            let datos = [], navLinea = [];
            if ('caches' in window) {
                caches.match('./kml/' + kmlFile + '.kml').then(response => {
                    if (response){
                        response.text().then(xml => {
                            let xmlDoc = new DOMParser().parseFromString(xml, 'text/xml');
                            let placemark = xmlDoc.getElementsByTagName('Placemark');
                            // let placemark = xmlDoc.getElementsByTagName('Placemark')[0];
                            Array.from(placemark).forEach(placemark => {
                                let color = xmlDoc.querySelector(placemark.getElementsByTagName('styleUrl')[0].textContent.trim()).getElementsByTagName('LineStyle')[0].getElementsByTagName('color')[0].textContent.trim();
                                let arrayPunto = placemark.getElementsByTagName('Point');    
                                if(arrayPunto.length > 0){
                                    arrayPunto = arrayPunto[0].getElementsByTagName('coordinates')[0].textContent.trim().split('\n');    
                                    for (let i = 0; i < arrayPunto.length; i++) {
                                        navLinea.push(arrayPunto[i].split(','))
                                    }
                                    navLinea.forEach(element => {



                                        
                                            require([
                                                  'esri/Graphic'
                                            ], Graphic => {
                                                let point = {
                                                    latitude  : element[1],
                                                    longitude : element[0],
                                                    type      : 'point'
                                                };
                                                let simpleMarkerSymbol = {
                                                    color   : [100, 50, 50],
                                                    type    : 'simple-marker'
                                                };
                                                let pointGraphic = new Graphic({
                                                    geometry : point,
                                                    symbol   : simpleMarkerSymbol
                                                });
                                                graphicsLayerKML.add(pointGraphic);
                                            });
                                        

                                    });
                                }
                                navLinea = [];
                                let arrayLinea = placemark.getElementsByTagName('LineString');
                                if(arrayLinea.length > 0){
                                    arrayLinea = arrayLinea[0].getElementsByTagName('coordinates')[0].textContent.trim().split('\n');
                                    for (let i = 0; i < arrayLinea.length; i++) {
                                        navLinea.push(arrayLinea[i].split(','))
                                    }
                                    datos.push(navLinea);
                                    datos.forEach(element => {
                                        let drawCoordenadas = {
                                            paths : [element],
                                            type  : 'polyline', 
                                        }
                                        let lineSymbol = {
                                            color : color,
                                            type  : 'simple-line',
                                            width : 3,
                                        }
                                        let polylineGraphic = new Graphic({
                                            geometry : drawCoordenadas,
                                            symbol   : lineSymbol,
                                        });
                                        if(graphicsLayerKML!=undefined){
                                            graphicsLayerKML.add(polylineGraphic);
                                        }else{
                                            map.add(graphicsLayerKML);
                                            graphicsLayerKML.add(polylineGraphic);
                                        }
                                    });
                            

                             
                            }
                        
                        }); 
                });   
            }
        });
    }
}
    });
}


function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function calculateDistance(coords1, coords2) {
    let dLat = degreesToRadians(coords2.latitude - coords1.latitude);
    let dLon = degreesToRadians(coords2.longitude - coords1.longitude);
    let a = Math.sin(dLat/2) * Math.sin(dLat/2) 
        + Math.sin(dLon/2) * Math.sin(dLon/2) 
        * Math.cos(degreesToRadians(coords1.latitude)) * Math.cos(degreesToRadians(coords2.latitude)); 
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    return (6371 * c) * 1000; // earthRadiusKm = 6371
}

function beep(distance) {
    var snd = new Audio("./audio/me-too.mp3");  
    snd.volume = 0;
    if (distance <= properties.shortDistance){
        snd.volume = 1;
    } else if (distance > properties.shortDistance && distance <= properties.mediumDistance){
        snd.volume = 0.4;
    } else if (distance > properties.mediumDistance && distance <= properties.longDistance){
        snd.volume = 0.1;
    }
    snd.play();
}