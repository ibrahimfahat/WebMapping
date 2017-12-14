//URL Geoserver
var url_geoserver = "http://localhost:8080/geoserver/wms";
//url des couches
var access_layer_adm1 = "formation_gs:tun_gouvernorats_utm";
var access_layer_adm2 = "formation_gs:tunis_phr_8bits";
var access_layer_adm3="formation_gs:clients_utm";
var access_layer_adm4="formation_gs:roads_utm";
var access_layer_adm5="formation_gs:pdv_utm";
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');


var input = document.getElementById("sites"); 



var overlayPopup = new ol.Overlay({  
    element: container 
});
//déclaration des couches openlayers

var lyr_adm1 = new ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: url_geoserver,
        params: {"LAYERS": access_layer_adm1, "TILED": "true"}
    })),
    title: "Gouvernorats"
});
var lyr_adm2 = new ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: url_geoserver,
        params: {"LAYERS": access_layer_adm2, "TILED": "true"}
    })),
    title: "Tunis"
});

var lyr_adm3 = new ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: url_geoserver,
        params: {"LAYERS": access_layer_adm3, "TILED": "true"}
    })),
    title: "Clients"
});
var lyr_adm4 = new ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: url_geoserver,
        params: {"LAYERS": access_layer_adm4, "TILED": "true"}
    })),
    title: "Roads"
});

var lyr_adm5 = new ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: url_geoserver,
        params: {"LAYERS": access_layer_adm5, "TILED": "true"}
    })),
    title: "Pdv"
});
var lyr_adm6 = new ol.layer.Tile({
    source: new ol.source.OSM(),
    title: "Big_Map"
});
lyr_adm1.setVisible(true);
//déclaration de la liste des couches à afficher
var layersList = [lyr_adm6,lyr_adm1, lyr_adm2, lyr_adm3, lyr_adm4, lyr_adm5];
closer.onclick = function() {
    container.style.display = 'none';
    closer.blur();
    return false; 
};

var map = new ol.Map({
    controls: ol.control.defaults().extend([
        new ol.control.LayerSwitcher({tipLabel: "Layers"}),
        new ol.control.MousePosition({coordinateFormat: ol.coordinate.createStringXY(4),
            projection: 'EPSG:3857'  }),
        new ol.control.ScaleLine()

    ]),
    target: 'map',
    overlays: [overlayPopup],
    layers: layersList,
    view: new ol.View({
        projection: 'EPSG:3857',
        center: ol.proj.transform([9.378840, 34.240721],'EPSG:4326', 'EPSG:3857'),
    zoom: 7
    })
});

map.on('pointermove', function(event) {
    var coord3857 = event.coordinate;
    var coord4326 = ol.proj.transform(coord3857, 'EPSG:3857', 'EPSG:4326');
    $('#mouse3857').text(ol.coordinate.toStringXY(coord3857, 2));
    $('#mouse4326').text(ol.coordinate.toStringXY(coord4326, 5));
});

//map.on('singleclick', function(evt) {onSingleClick(evt); });
/*var onSingleClick = function(evt) {

    var coord3857 = evt.coordinate;
    var coord4326 = ol.proj.transform(coord3857, 'EPSG:3857', 'EPSG:4326');
    console.log(coord3857);
    console.log(coord4326);}*/
var clicked_coord;
var onSingleClick = function(evt) {
    var coord = evt.coordinate;
    console.log(coord);
    var str = coord;

    var source1 = access_layer_adm3;
    var source2 = access_layer_adm1;
    var layers_list = source2 + ',' + source1;

    var view = map.getView();
    var viewResolution = view.getResolution();
    url=lyr_adm1.getSource().getGetFeatureInfoUrl(
        evt.coordinate, viewResolution, view.getProjection(),
        {   'INFO_FORMAT': 'text/javascript',
            'FEATURE_COUNT': 20,
            'LAYERS': layers_list,
            'QUERY_LAYERS': layers_list
        });
    console.log(url);
    if (url) { //call parseResponse(data)
        clicked_coord = coord;
        $.ajax(url,
            {dataType: 'jsonp'}
        ).done(function (data) {});
    }};

map.on('singleclick', function(evt) {     onSingleClick(evt); });


function parseResponse(data) {
    var poifound = 0;
    var vectorSource = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(data)     });
    console.log((new ol.format.GeoJSON()).readFeatures(data));
    var features = vectorSource.getFeatures();
    var str=clicked_coord;
    for(x in features) {
        var id = features[x].getId();
        var props = features[x].getProperties();
        if((id.indexOf("clients")>-1) && (poifound==0))
        {  str = str + '<br/>' + props["CATEGORIE"] + '<br/>' + props["CA"];
            poifound=1;
        }
        if(id.indexOf("gouvernorats")>-1)
        {  str = str + '<br/>' + props["NOMG"];
        //   poifound=1;
        break;
        }
    }
    if(str) {
        var  str1 = "<meta http-equiv="+"'Content-Type'"+"content="+"'text/html; charset=UTF-8'"+" />"

    str = '<p>' + str + '</p>';
        overlayPopup.setPosition(clicked_coord);
        content.innerHTML = str; //JSON.stringify(
         container.style.display = 'block';
        clicked_pois = 1;     }
    else{
        container.style.display = 'none';
        closer.blur();
        clicked_pois = 0;
    }
}


// Define Geometries
var point = new ol.geom.Point(
    ol.proj.transform([9.378840, 34.240721], 'EPSG:4326', 'EPSG:3857')
);
    var circle = new ol.geom.Circle(
        ol.proj.transform([9.378840, 34.240721], 'EPSG:4326', 'EPSG:3857'),
        600000 );

// Features
    var pointFeature = new ol.Feature(point);
    var circleFeature = new ol.Feature(circle);

// Source
    var vectorSource = new ol.source.Vector({
        projection: 'EPSG:4326' });
vectorSource.addFeatures([pointFeature, circleFeature]);

// vector layer
    var vectorLayer = new ol.layer.Vector({     source: vectorSource });

//add layer to the map
   map.addLayer(vectorLayer);


var style = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255, 100, 50, 0.3)'
    }),

    stroke: new ol.style.Stroke({
        width: 2,
        color: 'rgba(255, 100, 50, 0.8)'
    }),
    image: new ol.style.Circle({
        fill: new ol.style.Fill({
            color: 'rgba(55, 200, 150, 0.5)'
        }),
        stroke: new ol.style.Stroke({
            width: 1,
            color: 'rgba(55, 200, 150, 0.8)'
        }),
        radius: 7
    })
});

// vector layer with the style
var vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: style });


var button = $('#pan').button('toggle');
var interaction; $('div.btn-group button').on('click', function(event) {
    var id = event.target.id;

// Toggle buttons
button.button('toggle');
    button = $('#'+id).button('toggle');
    // Remove previous interaction
    map.removeInteraction(interaction);
    // Update active interaction
    switch(event.target.id) {
        case "select":
            interaction = new ol.interaction.Select();
            map.addInteraction(interaction);
            break;
        case "point":
            interaction = new ol.interaction.Draw({
                type: 'Point',
                source: vectorLayer.getSource()
            });
            map.addInteraction(interaction);
            break;
        case "line":
            interaction = new ol.interaction.Draw({
                type: 'LineString',
                source: vectorLayer.getSource()
            });
            map.addInteraction(interaction);
            break;
        case "polygon":
            interaction = new ol.interaction.Draw({
                type: 'Polygon',
                source: vectorLayer.getSource()
            });

            map.addInteraction(interaction);
            break;
        case "modify":
            interaction = new ol.interaction.Modify({
                features: new ol.Collection(vectorLayer.getSource().getFeatures())
            });
            map.addInteraction(interaction);
            break;
        default:
            break;
    }
});


//sites2g
// Vector layer

/*var layerVectorPoint = new ol.layer.Heatmap({
    source: new ol.source.GeoJSON({
        url: 'data/sites2g.geojson',
        projection: 'EPSG:3857'
    }) });

console.log(layerVectorPoint.getSource().getFeatures().length); map.addLayer(layerVectorPoint);*/

var features;
var   layerVectorPoint;
var list=[{}];
$.getJSON("data/sites2g.geojson", function(data) {

//console.log(data.features);
    $.each(data.features, function(key, valeur) {

        list.push({label:valeur.properties.SITE_NAME+"-"+valeur.properties.N_SEC,value:valeur.properties.SI})
    });
});
console.log(list);
var input = document.getElementById("sites");
var awesomplete = new Awesomplete(input, {
    minChars: 1,
    maxItems: 12,
    autoFirst: true
});
awesomplete.list = list;


// Auto complétion


var siteID = input.value;
function goToSite(){
    console.log(input.value);
    console.log(layerVectorPoint.getSource().getFeatureById(input.value).getGeometry().getExtent());
//console.log(layerVectorPoint2.getSource());
    var extent = layerVectorPoint.getSource().getFeatureById(input.value).getGeometry().getExtent();
    map.getView().setZoom(10).fitExtent(extent, map.getSize(50));
}

//*******************************************************************
$.getJSON("data/sites2g.geojson", function(data) {

    features = new ol.format.GeoJSON().readFeatures( data, {
        featureProjection: 'EPSG:3857'     } );
    for(x in features) {
        var props = features[x].getProperties();
        var id = props["SI"];
        features[x].setId(id);
    }
    var source = new ol.source.Vector({
        features: features
    });

    layerVectorPoint = new ol.layer.Heatmap({
        source:source
    });
    
    console.log(layerVectorPoint.getSource().getFeatures().length);
    map.addLayer(layerVectorPoint);
});


var info_site='?';
var pixel = map.getPixelFromCoordinate(clicked_coord);
map.forEachFeatureAtPixel(pixel, function(feature)
{
    if(info_site=='?')
        info_site = '<br/>' + feature.get('SITE_NAME') + '<br>';
        //console.log(".....");
});
    if(info_site!='?') str = str+info_site;

//Geolocation
var geolocation = new ol.Geolocation({
projection: map.getView().getProjection(),
tracking: true
});
geolocation.bindTo('projection', map.getView());
geolocation.on('change:position', function() { //real time tracking
//map.getView().setCenter(geolocation.getPosition());
//map.getView().setZoom(15);
});
// add a marker to display the current location
var marker = new ol.Overlay({
element: document.getElementById('location'),
positioning: 'center-center'
});
map.addOverlay(marker);
// and bind it to the geolocation's position updates
marker.bindTo('position', geolocation);

// add a marker to display the current location
var marker = new ol.Overlay({
    element: document.getElementById('location'),
    positioning: 'center-center' });
map.addOverlay(marker); // and bind it to the geolocation's position update
marker.bindTo('position', geolocation);

var button_position=$('#position');
button_position.on('click', function() {
    var position=geolocation.getPosition();
    map.getView().setCenter(position);
    map.getView().setZoom(15);
});
// Button vue globale
var vue=$('#global');
var extent=[9.54,31,9.71,37];
extent = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:4326", "EPSG:3857"));

vue.on('click', function() {
    map.getView().fitExtent(extent,map.getSize()),
        map.getView().setZoom(7);

});