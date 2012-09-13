var TMap = {
    markers: {},
    marker_arr: [],
    polyline_arr: [],

    //url
    triangleUrl: '/triangulate/map',
    basicPathUrl: '/mapping/basic_path',

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
    create: function(json) {
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
	// TMap.setEvents();
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

    // Center map
    center: function(lat, lng){
	TMap.map.setCenter(new google.maps.LatLng(lat, lng));
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
	/*
	google.maps.event.addListener(
	    TMap.markers[point.id],
	    'click',
	    function(event) {
		TMap.markerClick(TMap.markers[point.id]);
	    }
	);
	google.maps.event.addListener(
	    TMap.markers[point.id],
	    'mouseup',
	    function(event) {
		TMap.markerCheckPosition(TMap.markers[point.id], point.id);
	    }
	);
	*/
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

    // Draw markers
    drawMarkers: function(json) {
	$.each(json.points,
	       function(i, point) {
		   TMap.addMarker(point);
	       });
    },

    drawPolylines: function(json) {
	$.each(json.paths,
	       function(i, path) {
		   TMap.addPolyline(path);
	       });
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
    },

    removeSafePlace: function(user_id, sp_id) {
	google.maps.event.clearInstanceListeners(TMap.markers[sp_id]);
	TMap.markers[sp_id].setMap(null);
	$.ajax({
            url: TMap.safePlacesUrl + '/' + sp_id,
            type: "PUT",
            success: function(html) {
		$("#safe_places_details").html(html)
            }
	});
	$.ajax({
            url: TMap.safePlacesUrl + '/0/delete_schedule',
            type: "GET",
            success: function(html) {
		$("#schedule_details").html(html)
            }
	});
    },

    newSafePlace: function(loc) {
	var name = prompt("Safe place name?");
	if(!name) {
            name = "Unnamed";
	}
	var data = {
            lat: loc.lat(),
            lng: loc.lng(),
            name: name
	};
	$.ajax({
	    url: TMap.safePlacesUrl,
	    type: "POST",
	    data: data,
	    dataType: 'json',
	    success: function(point) {
		TMap.addMarker(point);
		TMap.map.setZoom(15);
	    }
	});
	$.ajax({
            url: TMap.safePlacesUrl + '/0',
            type: "PUT",
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
