let map, view, graphicsLayerUser, graphicsLayerKML;

let darkMode = false;

let userLocation;
const userLocationRefresh = 10000;

let appConfig;

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
        map = new Map({
            basemap : (darkMode) ? 'dark-gray-vector' : 'gray-vector'
        });
        /////////////////////////////////////////////////////////////////////
        appConfig = {
            activeView : null,
            center     : [userLocation.longitude, userLocation.latitude],
            container  : "viewDiv",
            mapView    : null,
            sceneView  : null,
            zoom       : 15,
        };

        let initialViewParams = {
            center    : appConfig.center,
            container : appConfig.container,
            zoom      : appConfig.zoom
        };
       
        // create 2D view y lo iniciamos
        appConfig.mapView = new MapView(initialViewParams);
        appConfig.mapView.map = map;
        appConfig.activeView = appConfig.mapView;

        // create 3D view, sin iniciarlo
        initialViewParams.container = null;
        initialViewParams.map = map;
        appConfig.sceneView = new SceneView(initialViewParams);

        appConfig.activeView.ui.remove('zoom');
        appConfig.sceneView.ui.remove('zoom');
        appConfig.sceneView.ui.remove('toggle');

        appConfig.activeView.on('click', evt => {
            console.log('LONG: ' + evt.mapPoint.longitude.toString() + ', LAT: ' + evt.mapPoint.latitude.toString());
            let distance = calculateDistance(userLocation, {
                'latitude'  : evt.mapPoint.latitude,
                'longitude' : evt.mapPoint.longitude
            });
            console.log('DISTANCE TO USER: ' + (distance * 1000) + ' meters');
        });

        let switchButton = document.getElementById("switch-btn");

        switchButton.addEventListener("click", function () {
            switchView();
        });

        function switchView() {  // Switches the view from 2D to 3D and viceversa
            let activeViewpoint = appConfig.activeView.viewpoint.clone();

            appConfig.activeView.container = null;

            if (appConfig.activeView.type === "3d") {
                appConfig.activeView = appConfig.mapView;
                appConfig.mapView.viewpoint = activeViewpoint;
                appConfig.mapView.container = appConfig.container;
                appConfig.sceneView.map.ground = [];
                switchButton.value = "3D";
            } else {
                appConfig.activeView = appConfig.sceneView;
                appConfig.sceneView.viewpoint = activeViewpoint;
                appConfig.sceneView.container = appConfig.container;
                appConfig.sceneView.map.ground = 'world-elevation'
                switchButton.value = "2D";
            }
        };
        /////////////////////////////////////////////////////////////////////
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
        drawPoint(userLocation.longitude, userLocation.latitude); // Dray a point on users current location
    });
});

window.addEventListener('online', event => { console.log('ONLINE'); });

window.addEventListener('offline', event => { console.log('OFFLINE'); });

document.getElementById('darkMode').addEventListener('click', function(){
    darkMode = !darkMode;
    map.basemap = (darkMode) ? 'dark-gray-vector' : 'gray-vector';
    document.getElementById("darkMode").classList.toggle("darkModeOn");
});

document.getElementById('centerView').addEventListener('click', event => {
    appConfig.activeView.center = [userLocation.longitude, userLocation.latitude];
});

document.getElementById('routeSelector').addEventListener('change', event => {
    let opt = document.getElementById("routeSelector").getElementsByTagName('option')[document.getElementById("routeSelector").selectedIndex];
   console.log(opt)
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
    console.log('click')
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
    graphicsLayerUser.removeAll();
    drawPoint(userLocation.longitude, userLocation.latitude);
}, userLocationRefresh);

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
    console.log(kmlFile)
    require([
          'esri/Graphic'
    ], Graphic => {
        console.log('AQUIII')
        graphicsLayerKML.removeAll();
        if(kmlFile != null){
            console.log('LOADING KML FILE: ' + kmlFile + '.kml');
            let datos = [], navLinea = [];
            if ('caches' in window) {
                caches.match('./kml/' + kmlFile + '.kml').then(response => {
                    if (response){
                        response.text().then(xml => {
                            let xmlDoc = new DOMParser().parseFromString(xml, 'text/xml');
                            let placemark = xmlDoc.getElementsByTagName('Placemark')[0];
                            let arrayLinea = placemark.getElementsByTagName('LineString')[0].getElementsByTagName('coordinates')[0].textContent.trim().split('\n');
                            let color = xmlDoc.getElementById(placemark.getElementsByTagName('styleUrl')[0].textContent.trim().substring(1)).getElementsByTagName('LineStyle')[0].getElementsByTagName('color')[0].textContent.trim();
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
                                graphicsLayerKML.add(polylineGraphic);
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
    return 6371 * c; // earthRadiusKm = 6371
}