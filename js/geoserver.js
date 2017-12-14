var url_geoserver =
"http://localhost:8080/geoserver/wms";
//url des couches
/*var access_layer_adm1 = "formation_gs:tun_gouvernorats_utm";
var access_layer_client = "formation_gs:clients_utm";
var access_layer_root = "formation_gs:roads_utm";
var access_layer_phr = "formation_gs:tunis_phr_8bits"*/
//déclaration des couches openlayers


var access_layer_adm1 = "formation_gs:tun_gouvernorats_utm";
var access_layer_adm2 = "formation_gs:tunis_phr_8bits";
var access_layer_adm3="formation_gs:clients_utm";
var access_layer_adm4="formation_gs:roads_utm";
var access_layer_adm5="formation_gs:pdv_utm";
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
lyr_adm1.setVisible(true);
//déclaration de la liste des couches à afficher
var layersList = [lyr_adm1, lyr_adm2, lyr_adm3, lyr_adm4, lyr_adm5];

var map = new ol.Map({
    controls: ol.control.defaults().extend([
        new ol.control.LayerSwitcher({tipLabel: "Layers"}),
        new ol.control.MousePosition({coordinateFormat: ol.coordinate.createStringXY(4),
                                      projection: 'EPSG:4326'  }),
        new ol.control.ScaleLine()
    ]),
    target: 'map',
    layers: layersList,
    view: new ol.View({
    projection: 'EPSG:4326',
    center:[9.378840, 34.240721],
    zoom: 7
})
});

map.on('pointermove', function(event) {
    var coord3857 = event.coordinate;
    var coord4326 = ol.proj.transform(coord3857, 'EPSG:3857', 'EPSG:4326');
    $('#mouse3857').text(ol.coordinate.toStringXY(coord3857, 2));
    $('#mouse4326').text(ol.coordinate.toStringXY(coord4326, 5));
});