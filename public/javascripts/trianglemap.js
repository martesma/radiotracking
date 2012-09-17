var TMap = {
    // markers, in order. Structure:
    // rt.id => {marker: the_marker, point: point, 
    // title: title, active: t/f, overlay: null or overlay marker }
    markers: {},
    // gotta keep track of the order of the markers.... (fucking javascript)
    marker_arr: [],
    // This will become a MVCArray, reflecting marker_arr at first
    mutable_marker_arr: [],
    // any overlays extant. Structure:
    // rt.id => { overlay: the_overlay_marker }
    // sakra .... gone for now
    // overlays: {},
    // overlay_arr: [],
    polyline_arr: [],
    // This is obviously a MVCArray and full of LatLngs as needed by Polylines.
    mutable_path_arr: [],
    // { pos: pos, marker: marker_id, path_point: LatLng }
    path_removals: [],
    // { point: LatLng, marker: marker, overlay: marker,
    // cur: path_id, ratio: ratio between cur and next }
    animation: {},
    anim_resolution: 10,
    anim_interval_id: 0,

    // hovno
    triangleUrl: '/triangulate/map',
    basicPathUrl: '/mapping/basic_path',
    enableMarkerURL: '/mapping/enable_marker',
    disableMarkerURL: '/mapping/disable_marker',
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
	    scaleControl: true,
	    streetViewControl: false,
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

    // Update the map
    update: function(json) {
	TMap.clearMarkers();
	TMap.drawMarkers(json);
	TMap.setEvents();
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

    drawMarkers: function(json) {
	$.each(json.points,
	       function(i, point) {
		   TMap.addMarker(point);
	       });
    },

    // The following functions focus on the route maps of the animals.
    // utilities

    resetAnimation: function() {
	TMap.animation.point = 	TMap.mutable_path_arr[0];
	TMap.animation.marker = null;
	TMap.animation.overlay = null;
	TMap.animation.cur = 0;
	TMap.animation.ratio = 0;
    },
    
    // More appropriately - findFirstOverlainMarker
    findOverlainMarker: function() {
	for(i in TMap.marker_arr) {
	    if(TMap.markers[TMap.marker_arr[i]].overlay) {
		return(TMap.marker_arr[i]);
	    }
	}
	return null;
    },

    createAnimalPath: function(json) {
	var last_point = json.points[json.points.length - 1];
	var latlng = new google.maps.LatLng(last_point.lat,
					    last_point.lng);
	TMap.map = new google.maps.Map(document.getElementById("map_canvas"),
					TMap.getOptions(latlng));
	TMap.drawPathMarkers(json);
	TMap.drawPathLines(json);
    },

    center: function(lat, lng) {
	var zoom = TMap.map.getZoom();
	TMap.map.setCenter(new google.maps.LatLng(lat, lng));
	TMap.map.setZoom(zoom);
    },

    centerRTMap: function(id) {
	TMap.center(TMap.markers[id].point.lat,
		    TMap.markers[id].point.lng);
	var previous_marker_id = TMap.findOverlainMarker();
	if(previous_marker_id) {
	    $("#rtdate" + previous_marker_id).css('font-style', 'normal');
	    $("#rtdetail" + previous_marker_id).css('display', 'none');
	    TMap.markers[previous_marker_id].marker.setIcon(TMap.smallMarker);
	    TMap.markers[previous_marker_id].overlay.setMap(null);
	    TMap.markers[previous_marker_id].overlay = null;
	}
	$("#rtdate" + id).css('font-style', 'italic');
	$("#rtdetail" + id).css('display', 'block');
	TMap.overlaySmallImage(id, TMap.animalImage);
    },

    // A frame to the image is also included here
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
	    clickable: true,
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
	google.maps.event.addListener(
	    TMap.markers[point.id].marker,
	    'click',
	    function(event) {
		TMap.centerRTMap(point.id);
	    }
	);
	TMap.marker_arr.push(point.id);
	TMap.mutable_marker_arr.push(point.id);
	if(last_one) {
	    TMap.overlaySmallImage(point.id, TMap.animalImage);
	    $("#rtdate" + point.id).css('font-style', 'italic');
	    $("#rtdetail" + point.id).css('display', 'block');
	}
    },

    drawPathMarkers: function(json) {
	TMap.mutable_marker_arr = new google.maps.MVCArray();
	$.each(json.points,
	       function(i, point) {
		   // This sucks.
		   var last_one = json.points.length == (i + 1) ? true : false;
		   TMap.addPathMarker(i, point, last_one);
	       });
    },

    getIndexFromMarkerId: function(id) {
	$.each(TMap.marker_arr,
	       function(i, m) {
		   if(id == m) {
		       return(i);
		   }
	       });
	return(null);
    },

    getIndexFromMutableMarkerId: function(id) {
	TMap.mutable_marker_arr.forEach(function(marker_id, index) {
	    // alert("Cycling through marker_ids - " + marker_id);
	    if(id == marker_id) {
		// alert("So,returning index " + index);
		return(index);
	    }
	});
	// alert("getIndexFromMutableMarkerId returning null with id " + id);
	return(null);
    },

    getPathRemovalIndex: function(id) {
	TMap.path_removals.forEach(function(pr, i) {
	    if(pr.marker == id) {
		return(i);
	    }
	});
	// alert("getPathRemovalIndex returning null with id " + id);
	return(null);
    },

    adjustPositionsDown: function() {
	// alert("About to adjust these down: " + JSON.stringify(TMap.path_removals.getArray()));
	TMap.path_removals.forEach(function(pr, i) {
	    if(pr.pos < i) {
		pr.pos -= 1;
	    }
	});
	// alert("Results: " + JSON.stringify(TMap.path_removals.getArray()));
    },

    adjustPositionsUp: function() {
	// alert("About to adjust these up: " + JSON.stringify(TMap.path_removals.getArray()));
	TMap.path_removals.forEach(function(pr, i) {
	    if(pr.pos <= i) {
		pr.pos += 1;
	    }
	});
	// alert("Results: " + JSON.stringify(TMap.path_removals.getArray()));
    },

    disableMarker: function(id) {
	if(TMap.markers[id].active) {
	    TMap.markers[id].active = false;
	    TMap.markers[id].marker.setMap(null);
	    if(TMap.markers[id].overlay != null) {
		TMap.markers[id].overlay.setMap(null);
	    }

	    // remove polyline point
	    var index = TMap.getIndexFromMutableMarkerId(id);
	    TMap.path_removals.push({pos: index,
				     marker: TMap.mutable_marker_arr.removeAt(index),
				     path_point: TMap.mutable_path_arr.removeAt(index)});
	    TMap.adjustPositionsDown(index);

	    $.ajax({
		url: TMap.disableMarkerURL,
		type: "POST",
		data: { id: id },
		success: function(html) {
		    $("#rtdate" + id).html(html);
		}
	    });
	    $("#rtdate" + id).css('font-style', 'normal');
	}
    },

    enableMarker: function(id) {
	if(!TMap.markers[id].active) {
	    TMap.markers[id].active = true;
	    TMap.markers[id].marker.setMap(TMap.map);

	    // restore polyline point
	    // alert("enableMarker: " + JSON.stringify(TMap.path_removals.getArray()));
	    var path_removal_index = TMap.getPathRemovalIndex(id);
	    var path_removal = TMap.path_removals.getAt(path_removal_index);
	    TMap.mutable_marker_arr.insertAt(path_removal.pos, id);
	    TMap.mutable_path_arr.insertAt(path_removal.pos,
					   path_removal.path_point);
	    TMap.path_removals.removeAt(path_removal_index);
	    TMap.adjustPositionsUp(path_removal.pos);

	    $.ajax({
		url: TMap.enableMarkerURL,
		async: false,
		type: "POST",
		data: { id: id },
		success: function(html) {
		    $("#rtdate" + id).html(html);
		}
	    });
	    // Unless this is the currently selected marker, the details
	    // must be hidden. Oh, and the ajax call above must not be
	    // asynchronous because of the infestation.
	    if(TMap.markers[id].overlay == null) {
		$("#rtdate" + id).css('font-style', 'normal');
		$("#rtdetail" + id).css('display', 'none');	    
	    } else {
		$("#rtdate" + id).css('font-style', 'italic');
		TMap.markers[id].overlay.setMap(TMap.map);
	    }
	}
    },

    drawPathLines: function(json) {
	TMap.mutable_path_arr = new google.maps.MVCArray();
	TMap.path_removals = new google.maps.MVCArray();
	$.each(json.paths,
	       function(i, path) {
		   TMap.mutable_path_arr.push(new google.maps.LatLng(path.lat,
								     path.lng));
	       });
        var polyline = new google.maps.Polyline(
	    {
		path: TMap.mutable_path_arr,
		strokeColor: "#00bb00",
		strokeOpacity: 0.8,
		strokeWeight: 2,
		map: TMap.map
	    }
	);
	TMap.resetAnimation();
    },

    // animation
    slope: function(latLng1, latLng2) {
	return((latLng2.lng() - latLng1.lng()) /
	       (latLng2.lat() - latLng1.lat()));
    },

    distance: function(latLng1, latLng2) {
	return(Math.sqrt(Math.pow((latLng2.lat() - latLng1.lat()), 2) +
			 Math.pow((latLng2.lng() - latLng2.lng()), 2)));
    },

    // Returns a LatLng which is ratio distance from latLng1 to latLng2
    intermediatePoint: function(latLng1, latLng2, ratio) {
	var angle = Math.atan(TMap.slope(latLng1, latLng2));
	var dist = TMap.distance(latLng1, latLng2);
	return(new google.maps.LatLng(latLng1.lat() +
				      dist * ratio * Math.cos(angle),
				      latLng1.lng() +
				      dist * ratio * Math.sin(angle)));
    },

    getNextPoint: function() {
	TMap.animation.ratio += 1 / TMap.anim_resolution;
	if(0.999 < TMap.animation.ratio < 1.003) {
	    alert('reached next marker');
	    TMap.animation.cur += 1;
	    TMap.animation.ratio = 0;
	}
	var latLng1 = TMap.mutable_path_arr.getAt(TMap.animation.cur);
	var latLng2 = TMap.mutable_path_arr.getAt(TMap.animation.cur + 1);
	return(TMap.intermediatePoint(latLng1, latLng2, TMap.animation.ratio));
    },

    doAnimation: function() {
	alert('animation hash: ' + TMap.animation.cur + " - " + TMap.animation.ratio);
	if(TMap.animation.cur < TMap.mutable_path_arr.getLength() - 1) {
	    if(TMap.animation.marker != null) {
		alert('clearing last marker');
		TMap.animation.marker.setMap(null);
		TMap.animation.overlay.setMap(null);
	    }
	    TMap.animation.point = TMap.getNextPoint();
	    TMap.animation.marker = new google.maps.Marker({
		position: TMap.animation.point,
		map: TMap.map,
		icon: TMap.animalFrame
	    });
	    var size = new google.maps.Size(TMap.smallImageOptions.size.x, 
					    TMap.smallImageOptions.size.y);
	    var anchor = new google.maps.Point(TMap.smallImageOptions.anchor.x,
					       TMap.smallImageOptions.anchor.y);
	    var markerImage = new google.maps.MarkerImage(TMap.animalImage,
							  null, null, anchor,
							  size);
	    TMap.animation.overlay = new google.maps.Marker({
		position: TMap.animation.point,
		map: TMap.map,
		icon: markerImage
	    });
	} else {
	    clearInterval(TMap.anim_interval_id);
	    TMap.resetAnimation();
	}
    },

    startAnimation: function() {
	var active_id = TMap.findOverlainMarker();
	if(active_id) {
	    TMap.markers[active_id].marker.setIcon(TMap.smallMarker);
	    TMap.markers[active_id].overlay.setMap(null);
	}	
	TMap.anim_interval_id = setInterval(TMap.doAnimation, 500);
    },

    stopAnimation: function() {
	clearInterval(TMap.anim_interval_id);
    },

    // Below is excrement
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
