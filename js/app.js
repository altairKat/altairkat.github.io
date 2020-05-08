let map, view, graphicsLayerUser, graphicsLayerKML;

let appConfig;

let userLocation, userPreviousLocation;
let puntosInteres = [];
let puntosInteresCercanos = [];

let mapDragged = false;

let minDistance = -1;
let inShortRange = false;
let shortRangeNotified = false;
let inMediumRange = false;
let mediumRangeNotified = false;
let inLongRange = false;
let longRangeNotified = false;

let x = 0;
let y = 0;

window.addEventListener('load', event => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(registration => console.log('SERVICE WORKER SUCCESFULLY REGISTERED')) 
            .catch(err => console.log('[!!!] FAILED TO REGISTER SERVICE WORKER'));
    };

    getUserLocation();

    require([
        'esri/Map',
        'esri/views/MapView',
        'esri/views/SceneView',
        'esri/layers/GraphicsLayer'
    ], (Map, MapView, SceneView, GraphicsLayer) => {
         appConfig = {
            mapView    : null,
            sceneView  : null,
            activeView : null,
            container  : "viewDiv",
            zoom       : 15,
            center     : [userLocation.longitude, userLocation.latitude],
        };

        let initialViewParams = {
            zoom      : appConfig.zoom,
            center    : appConfig.center,
            container : appConfig.container
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
        ////////////////////////////////////////////////////////////////////////

        appConfig.activeView.ui.remove('zoom');
        appConfig.sceneView.ui.remove('zoom');

        appConfig.sceneView.on('drag', event => { mapDragged = true; });

        appConfig.activeView.on('drag', event => { mapDragged = true; });

        graphicsLayerUser = new GraphicsLayer({
            elevationInfo: {
                mode: "relative-to-scene"
            }
        });

        graphicsLayerKML = new GraphicsLayer({
            elevationInfo: {
                mode: "on-the-ground"
            }
        });

        map.addMany([
            graphicsLayerUser,
            graphicsLayerKML
        ]);

        drawPoint(userLocation.longitude, userLocation.latitude, graphicsLayerUser);
        
        function createView(params, type) {
            view = (type === '2d') ? new MapView(params) : new SceneView(params);
            return view;
        };
    });

    document.getElementById('centerView').addEventListener('click', event => {
        appConfig.activeView.center = [userLocation.longitude, userLocation.latitude];
        mapDragged = false;
    });
    
    let routeSelector = document.getElementById('routeSelector');

    properties.kmlFiles.forEach(k => {
        let opt = `\n<option data-route='${k}'>${k.substring(0, k.length - 4).toUpperCase()}</option>`;
        routeSelector.innerHTML += opt;
        document.getElementById('routeSelector2').innerHTML += opt;
    });

    routeSelector.addEventListener('change', event => {
        let opt = routeSelector.getElementsByTagName('option')[routeSelector.selectedIndex];
        let footer = document.getElementById('footer');
        let panelIniciarRuta = document.getElementById('panelIniciarRuta');
        let panelDesplegable = document.getElementById('btnDesplegable');
    
        footer.style.display = "block";
        panelIniciarRuta.style.display = "block";
        panelDesplegable.style.display = "none";
        loadKML(opt.getAttribute('data-route'));
    });

//PRUEBA
    document.getElementById('routeSelector2').addEventListener('change', event => {
    let opt = document.getElementById("routeSelector2").getElementsByTagName('option')[document.getElementById("routeSelector2").selectedIndex];
    let nombreRuta = document.getElementById("routeSelector2").getElementsByTagName('option')[document.getElementById("routeSelector2").selectedIndex].text;

    if (nombreRuta != 'Busca un lugar o direcci�n') {
       
        $('.route-name').html(nombreRuta);
        loadKML(opt.getAttribute('data-route'));
    } else {
        $('.route-name').html('');
    }

});

    document.getElementById('removeRoutes').addEventListener('click', event => {
        graphicsLayerKML.removeAll();
        puntosInteres = [];
        routeSelector.selectedIndex = 0;
    });

    document.getElementById("switch-btn").addEventListener("click", function () {
        let activeViewpoint = appConfig.activeView.viewpoint.clone();
        appConfig.activeView.container = null;
        if (appConfig.activeView.type === "3d") {
            appConfig.mapView.viewpoint = activeViewpoint;
            appConfig.mapView.container = appConfig.container;
            appConfig.activeView = appConfig.mapView;
            appConfig.sceneView.map.ground = [];
            this.value = "3D";
        } else {
            appConfig.sceneView.viewpoint = activeViewpoint;
            appConfig.sceneView.container = appConfig.container;
            appConfig.activeView = appConfig.sceneView;
            appConfig.sceneView.map.ground = 'world-elevation'
            this.value = "2D";
        }
    });
});

window.addEventListener('online', event => { console.log('ONLINE'); });

window.addEventListener('offline', event => { console.log('OFFLINE'); });

function getUserLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            userLocation = {
                'latitude'  : position.coords.latitude ,
                'longitude' : position.coords.longitude
            };

            x -= 0.00005;
            y -= 0.00007;

            checkPointsOfInterest();

            userPreviousLocation = userLocation;

        }, err => {
            console.log(err);
        }, {
            enableHighAccuracy : true,
            maximumAge         : 10000, 
            timeout            : 10000, 
        });
    } else {
        alert('[!!!] GEOLOCATION IS NOT SUPPORTED BY THIS BROWSER')
    }
}

if (navigator.geolocation) {
    window.setInterval(function(){
        getUserLocation();
        if (graphicsLayerUser != undefined) graphicsLayerUser.removeAll();
        drawPoint(userLocation.longitude, userLocation.latitude, graphicsLayerUser);
        if(!mapDragged){        
            appConfig.activeView.center = [userLocation.longitude, userLocation.latitude];
        }
    }, properties.userLocationRefresh);
}

function loadKML (kmlFile){
    require([
        'esri/Graphic'
    ], Graphic => {
        graphicsLayerKML.removeAll();
        puntosInteres = [];
        if(kmlFile != null){
            console.log('LOADING KML FILE: ' + kmlFile);
            if ('caches' in window) {
                caches.match('./kml/' + kmlFile).then(response => {
                    if (response){
                        response.text().then(xml => {
                            let xmlDoc = new DOMParser().parseFromString(xml, 'text/xml');
                            let navLinea = [];
                            Array.from(xmlDoc.getElementsByTagName('Placemark')).forEach(placemark => {
                                let arrayPunto = placemark.getElementsByTagName('Point');    
                                if(arrayPunto.length > 0){
                                    arrayPunto = arrayPunto[0].getElementsByTagName('coordinates')[0].textContent.trim().split('\n');    
                                    puntosInteres = [];
                                    let i = 1;
                                    for (let punto of arrayPunto) {
                                        puntosInteres.push({
                                            id : i,
                                            coordinates : punto.split(',')
                                        });
                                        i++;
                                    }
                                    puntosInteres.forEach(element => {
                                        drawPoint(element.coordinates[0], element.coordinates[1], graphicsLayerKML);
                                    });
                                }
                                navLinea = [];
                                let color = xmlDoc.querySelector(placemark.getElementsByTagName('styleUrl')[0].textContent.trim()).getElementsByTagName('LineStyle')[0].getElementsByTagName('color')[0].textContent.trim();
                                let arrayLinea = placemark.getElementsByTagName('LineString');
                                if(arrayLinea.length > 0){
                                    arrayLinea = arrayLinea[0].getElementsByTagName('coordinates')[0].textContent.trim().split('\n');
                                    for (let linea of arrayLinea) {
                                        navLinea.push(linea.split(','));
                                    }
                                    drawLine(navLinea, color, graphicsLayerKML);
                                }


                            });                          
                        });
                    }
                });   
            }
        }
    });
}

function checkPointsOfInterest(){
    puntosInteresCercanos = puntosInteres.filter(p => {
        return (calculateDistance(userLocation, {
            'longitude' : p.coordinates[0],
            'latitude'  : p.coordinates[1],
        }) < properties.longDistance)
    });

    notifyPointsOfInterest();
}

function notifyPointsOfInterest() {
    if(puntosInteresCercanos.length > 0){
        let approchingPoint = puntosInteresCercanos.filter(p => {
            let point = {
                'longitude' : p.coordinates[0],
                'latitude'  : p.coordinates[1],
            };
            return calculateDistance(userPreviousLocation, point) >= calculateDistance(userLocation, point);
        });

        if(approchingPoint.length > 0){
            approchingPoint.forEach(p => {
                let distance = calculateDistance(userLocation, {
                    'longitude' : p.coordinates[0],
                    'latitude'  : p.coordinates[1],
                });
                console.log(`DISTANCE TO APPROCHING POINT: ${distance} m`);
            });

            let distanceToPoints = [];
            
            approchingPoint.forEach(p => {
                distanceToPoints.push(
                    calculateDistance(userLocation, {
                        'longitude' : p.coordinates[0],
                        'latitude'  : p.coordinates[1],
                    })
                );
            });
        
            minDistance = Math.min(...distanceToPoints);

            console.log(`MIN DISTANCE: ${minDistance} m`);

            if (0 < minDistance && minDistance <= 100){
                inShortRange = true;
                inMediumRange = false;
                inLongRange = false;
            } else if (100 < minDistance && minDistance <= 200){
                inShortRange = false;
                inMediumRange = true;
                inLongRange = false;
            } else if (200 < minDistance && minDistance <= 300){
                inShortRange = false;
                inMediumRange = false;
                inLongRange = true;
            } else {
                inShortRange, shortRangeNotified = false;
                inMediumRange, mediumRangeNotified = false;
                inLongRange, longRangeNotified = false;
            }

            console.log(`IN SHORT RANGE: ${inShortRange} | NOTIFIED? ${shortRangeNotified}`);
            console.log(`IN MEDIUM RANGE: ${inMediumRange} | NOTIFIED? ${mediumRangeNotified}`);
            console.log(`IN LONG RANGE: ${inLongRange} | NOTIFIED? ${longRangeNotified}`);


            // let snd;  
            // if (distance <= properties.shortDistance){
            //     snd = new Audio("/audio/beyond-doubt-2.mp3");  
            // } else if (distance > properties.shortDistance && distance <= properties.mediumDistance){
            //     snd = new Audio("/audio/for-sure.mp3");  
            // } else if (distance > properties.mediumDistance && distance <= properties.longDistance){
            //     snd = new Audio("/audio/just-maybe.mp3");  
            // }
            // snd.play();

        } else {
            // shortRangeNotified = false;
            // mediumRangeNotified = false;
            // longRangeNotified = false;
        }

        if ("Notification" in window) {
            if (Notification.permission !== 'denied') {
                Notification.requestPermission();
            } 

            if (Notification.permission === "granted") {
                if (inShortRange && !shortRangeNotified){
                    new Notification(`PUNTO A MENOS DE 100 METROS: ${minDistance} m`);
                    shortRangeNotified = true;
                    mediumRangeNotified = false
                    longRangeNotified = false
                } else if (inMediumRange && !mediumRangeNotified){
                    new Notification(`PUNTO A MENOS DE 200 METROS: ${minDistance} m`);
                    shortRangeNotified = false;
                    mediumRangeNotified = true;
                    longRangeNotified = false;
                } else if (inLongRange && !longRangeNotified){
                    new Notification(`PUNTO A MENOS DE 300 METROS: ${minDistance} m`);
                    shortRangeNotified = false;
                    mediumRangeNotified = false;
                    longRangeNotified = true;
                } 
                // else {
                //     shortRangeNotified = false;
                //     mediumRangeNotified = false;
                //     longRangeNotified = false;
                // }
            } 
        }
    }
}

function drawPoint(long, lat, layer){
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
        layer.add(new Graphic({
            geometry : point,
            symbol   : simpleMarkerSymbol
        }));
    });
};

function drawLine(path, color, layer){
    require([
          'esri/Graphic'
    ], Graphic => {
        let drawCoordenadas = {
            paths : [path],
            type  : 'polyline', 
        };
        let lineSymbol = {
            color : color,
            type  : 'simple-line',
            width : 3,
        };
        layer.add(new Graphic({
            geometry : drawCoordenadas,
            symbol   : lineSymbol,
        }));
    });
};

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
    
      /* POR TENER UN DATO */
      let distance=(6371 * c) * 1000;
      let distanceKM = distance / 1000;
      distanceKM = distanceKM.toFixed(2)
      document.getElementById('distancia').innerHTML = distanceKM + 'km';
      /** */
      
    return (6371 * c) * 1000; // earthRadiusKm = 6371
}