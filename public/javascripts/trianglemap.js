var TMap = {
    // markers, in order. Structure:
    // rt.id => {marker: the_marker, point: point, 
    // title: title, active: t/f, overlay: null or overlay marker }
    markers: {},
    // gotta keep track of the order of the markers.... (fucking javascript)
    marker_arr: [],
    // any overlays extant. Structure:
    // rt.id => { overlay: the_overlay_marker }
    // sakra .... gone for now
    // overlays: {},
    // overlay_arr: [],
    polyline_arr: [],
    mutable_path_arr: [],

    // hovno
    triangleUrl: '/triangulate/map',
    basicPathUrl: '/mapping/basic_path',
    smallMarker: '/images/small_marker.png',
    animalFrame: '/images/map_flag3.png',
    animalImage: '/images/smaller_lutreola.png',
    smallImageOptions: {
	size: { x: 28, y: 30 },
	anchor: { x: 15, y: 48 }
    },
    normalLinkColor: '#55ee08',
    specialLinkColor: '#ee5508',

    // options
    getOptions: function(latlng) {
	return( {
	    zoom: 15,
	    center: latlng,
	    mapTypeId: google.maps.MapTypeId.SATELLITE,
	    streetViewControl: false
	} );
    },

    // Create the map
    createTriang: function(json) {
	var latlng = new google.maps.LatLng(json.points[0].lat,
					    json.points[0].lng);
	TMap.map = new google.maps.Map(document.getElementById("map_canvas"),
					TMap.getOptions(latlng));
	google.maps.event.addListener(TMap.map, 'click', function(event) {
	    new google.maps.Marker({position: event.latLng,
				    map: TMap.map,
				    title: event.latLng.lat() + ", " + event.latLng.lng()});
	});
	TMap.drawMarkers(json);
	TMap.drawPolylines(json);
    },

    // Eventually split all of this off from the simpler triangulation
    createAnimalPath: function(json) {
	var last_point = json.points[json.points.length - 1];
	var latlng = new google.maps.LatLng(last_point.lat,
					    last_point.lng);
	TMap.map = new google.maps.Map(document.getElementById("map_canvas"),
					TMap.getOptions(latlng));
	TMap.drawPathMarkers(json);
	TMap.drawPathLines(json);
    },

    // Update the map
    update: function(json) {
	TMap.clearMarkers();
	TMap.drawMarkers(json);
	TMap.setEvents();
    },

    setEvents: function(){
        google.maps.event.addListener(TMap.map, 'dblclick', function(event) {
	    TMap.newSafePlace(event.latLng);
        });
    },

    // More appropriately - findFirstOverlainMarker
    findOverlainMarker: function() {
	for(i in TMap.marker_arr) {
	    if(TMap.markers[TMap.marker_arr[i]].overlay) {
		alert("Marker " + TMap.marker_arr[i] + " found");
		return(TMap.marker_arr[i]);
	    }
	}
	alert("No marker found");
	return null;
    },

    // Center map
    center: function(lat, lng){
	TMap.map.setCenter(new google.maps.LatLng(lat, lng));
    },

    // This needs to be broken up into smaller functions
    centerRTMap: function(id) {
	var position = new google.maps.LatLng(TMap.markers[id].point.lat,
					      TMap.markers[id].point.lng);
	TMap.center(position);
	var previous_marker_id = TMap.findOverlainMarker();
	if(previous_marker_id) {
	    $("#rtdate" + previous_marker_id).css('color',
						  TMap.normalLinkColor);
//	    TMap.markers[previous_marker_id].marker.setIcon(TMap.smallMarker);
//	    TMap.markers[previous_marker_id].overlay.setMap(null);
//	    TMap.markers[previous_marker_id].overlay = null;
	}
	$("#rtdate" + id).css('color', TMap.specialLinkColor);
//	TMap.overlaySmallImage(id, TMap.animalImage);
    },

    // Clear markers and listeners
    clearMarkers: function(){
	for (i in TMap.markers){
	    google.maps.event.clearInstanceListeners(TMap.markers[i]);
	    TMap.markers[i].setMap(null);
	}
    },

    // Add marker
    addMarker: function(point) {
	TMap.markers[point.id] =
	    new google.maps.Marker(
		{
		    position: new google.maps.LatLng(point.lat, point.lng),
		    map: TMap.map,
		    draggable: true,
		    title: point.lat + ", " + point.lng
		}
	    );
    },

    // A frame to the image is also included
    overlaySmallImage: function(id, image) {
	var position = new google.maps.LatLng(TMap.markers[id].point.lat,
					      TMap.markers[id].point.lng);
	var size = new google.maps.Size(TMap.smallImageOptions.size.x, 
					TMap.smallImageOptions.size.y);
	var anchor = new google.maps.Point(TMap.smallImageOptions.anchor.x,
					   TMap.smallImageOptions.anchor.y);
	var markerImage = new google.maps.MarkerImage(image, null,
						      null, anchor, size);
	TMap.markers[id].marker.setIcon(TMap.animalFrame);
	TMap.markers[id].overlay = new google.maps.Marker({
	    position: position,
	    map: TMap.map,
	    icon: markerImage,
	    title: TMap.markers[id].title
	});
    },

    addPathMarker: function(i, point, last_one) {
	var position = new google.maps.LatLng(point.lat, point.lng);
	var title = point.id + " -- " + point.name + ": " + point.lat + ", " + point.lng;
	var marker_options = {
	    position: position,
	    map: TMap.map,
	    draggable: false,
	    icon: TMap.smallMarker,
	    title: title
	};
	TMap.markers[point.id] = {
	    marker: new google.maps.Marker(marker_options),
	    point: point,
	    title: title,
	    active: true,
	    overlay: null
	};
	TMap.marker_arr.push(point.id);
	if(last_one) {
	    TMap.overlaySmallImage(point.id, TMap.animalImage);
	}
    },

    addPolyline: function(path) {
        var polyline = new google.maps.Polyline(
	    {
		path: [new google.maps.LatLng(path[0].lat,
					      path[0].lng),
		       new google.maps.LatLng(path[1].lat,
					      path[1].lng)],
		strokeColor: "#00bb00",
		strokeOpacity: 0.8,
		strokeWeight: 2,
		map: TMap.map
	    }
	);
    },

    drawMarkers: function(json) {
	$.each(json.points,
	       function(i, point) {
		   TMap.addMarker(point);
	       });
    },

    drawPathMarkers: function(json) {
	$.each(json.points,
	       function(i, point) {
		   // This sucks.
		   var last_one = json.points.length == (i + 1) ? true : false;
		   TMap.addPathMarker(i, point, last_one);
	       });
    },

    drawPolylines: function(json) {
	$.each(json.paths,
	       function(i, path) {
		   TMap.addPolyline(path);
	       });
    },

    drawPathLines: function(json) {
	mutable_path_arr = new google.maps.MVCArray();
	$.each(json.paths,
	       function(i, path) {
		   mutable_path_arr.push(new google.maps.LatLng(path.lat,
								path.lng));
	       });
        var polyline = new google.maps.Polyline(
	    {
		path: mutable_path_arr,
		strokeColor: "#00bb00",
		strokeOpacity: 0.8,
		strokeWeight: 2,
		map: TMap.map
	    }
	);	
    },

    markerClick: function(marker) {
        $("#new_safe_schedule").show();
        var name = marker.title;
        var pattern = /^\s*$/
            var m = $("#schedule_start_place").attr("value").match(pattern);
        if(m) {
            $("#schedule_start_place").attr("value", name);
        } else if($("#schedule_end_place").attr("value").match(pattern)) {
            $("#schedule_end_place").attr("value", name);
        } else {
            $("#schedule_start_place").attr("value", $("#schedule_end_place").attr("value"));
            $("#schedule_end_place").attr("value", name);
        }
        if(TMap.marker_arr.length > 0) {
            if(TMap.polyline_arr.length > 0) {
                TMap.polyline_arr.pop().setMap(null);
            }
            last_marker = TMap.marker_arr[TMap.marker_arr.length - 1];
            var polyline = new google.maps.Polyline(
		{
		    path: [last_marker.getPosition(),
			   marker.getPosition()],
		    strokeColor: "#00bb00",
		    strokeOpacity: 0.5,
		    strokeWeight: 2,
		    map: marker.getMap()
		}
	    );
            TMap.polyline_arr.push(polyline);
        }   
        TMap.marker_arr.push(marker);
    },

    clearPolylines: function() {
	$.each(TMap.polyline_arr,
	       function(i, p) {
		   p.setMap(null);
	       });
    },

    markerCheckPosition: function(marker, sp_id) {
        var data = {
	    lat: marker.getPosition().lat(),
	    lng: marker.getPosition().lng()
	}
        $.ajax({
	    url: TMap.safePlacesUrl + '/' + sp_id + '/change_position',
            type: "POST",
            data: data,
            success: function(html) {
                $("#safe_places_details").html(html)
            }
        });
    }
};

//$(
//    function(){
//	$.getJSON(
//	    TMap.triangleUrl
//	    TMap.create
//	);
//    }
//);
