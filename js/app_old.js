let map, view, graphicsLayerUser, graphicsLayerKML;

let darkMode = false;

let userLocation;
const userLocationRefresh = 10000;

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
        'esri/layers/GraphicsLayer'
    ], (Map, MapView, GraphicsLayer) => {
        map = new Map({
            basemap : (darkMode) ? 'dark-gray-vector' : 'gray-vector'
        });
        view = new MapView({
            center    : [userLocation.longitude, userLocation.latitude],
            container : 'viewDiv',
            map       : map,
            zoom      : 15
        });
        view.ui.remove('zoom');
        view.on('click', evt => {
            console.log('LONG: ' + evt.mapPoint.longitude.toString() + ', LAT: ' + evt.mapPoint.latitude.toString());
            let distance = calculateDistance(userLocation, {
                'latitude'  : evt.mapPoint.latitude,
                'longitude' : evt.mapPoint.longitude
            });
            console.log('DISTANCE TO USER: ' + (distance * 1000) + ' meters');
        })
        view.on('zoomIn', evt => {
            console.log('ZOOM');
        })
        graphicsLayerUser = new GraphicsLayer({
            elevationInfo : 'absolute-height',
        });
        graphicsLayerKML = new GraphicsLayer({
            elevationInfo : 'absolute-height',
        });
        map.addMany([
            graphicsLayerUser,
            graphicsLayerKML
        ]);
        drawPoint(userLocation.longitude, userLocation.latitude);
    })
})

window.addEventListener('online', event => { console.log('ONLINE'); });

window.addEventListener('offline', event => { console.log('OFFLINE'); });

document.getElementById('darkMode').addEventListener('click', function(){
    darkMode = !darkMode;
    map.basemap = (darkMode) ? 'dark-gray-vector' : 'gray-vector';
    document.getElementById("darkMode").classList.toggle("darkModeOn");
});

document.getElementById('centerView').addEventListener('click', event => {
    view.center = [userLocation.longitude, userLocation.latitude];
});

document.getElementById('routeSelector').addEventListener('change', event => {
    let opt = document.getElementById("routeSelector").getElementsByTagName('option')[document.getElementById("routeSelector").selectedIndex];
    loadKML(opt.getAttribute('data-route'));
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
    require([
          'esri/Graphic'
    ], Graphic => {
        graphicsLayerKML.removeAll();
        if(kmlFile != null){
            console.log('LOADING KML FILE: ' + kmlFile + '.kml');
            let datos = [], navLinea = [];
            if ('caches' in window) {
                caches.match('/kml/' + kmlFile + '.kml').then(response => {
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