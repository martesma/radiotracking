function setRTFields(ra) {
    $("#nickname_select").val(ra.nickname);
    $("#ra_id_select").val(ra.id);
    $("#frequency_select").val(ra.id);
}

function displayRT(id) {
    $("#rt_nickname").val(id);
    $("#rt_animal_id").val(id);
    $("#rt_frequency").val(id);
	
    $.ajax({
	url: "/ajax/rt/" + id, // This is the released_animal id
	success: function(html) {
	    $("#buliimia").html(html);
	}
    });
}

// This must be called everytime something which needs to be sensed
// by jquery is loaded via ajax.
function ajax_hovno() {
    $("a[id^='rtdel']").click(function() {
	var id = this.id.substr(5);
	var ra_id = ""; // to be filled.
	if(confirm("Are you sure?")) {
	    $.ajax({
		url: "/ajax/ra_id/" + id,
		async: false,
		dataType: 'json',
		success: function(json) {
		    ra_id = json;
		}
	    });
	    $.ajax({
		url: "/track/" + id,
		async: false,
		type: "DELETE",
		success: function(anything) {
		    window.location = "/track/animal/" + ra_id;
		}
	    });
	}
    });
}

$(document).ready(function() {
    $("#nickname_select").change(function() {
	var data = {
	    nickname: $(this).val()
	};
	$.ajax({
	    url: '/ajax/ra',
	    type: "POST",
	    data: data,
	    dataType: 'json',
	    success: function(ra) {
		setRTFields(ra);
	    }
	});
    });
    $("#ra_id_select").change(function() {
	var data = {
	    id: $(this).val()
	};
	$.ajax({
	    url: "/ajax/ra/" + $(this).val(),
	    dataType: 'json',
	    success: function(ra) {
		setRTFields(ra);
	    }
	});
    });
    $("#frequency_select").change(function() {
        var data = {
	    id: $(this).val()
	};
	$.ajax({
	    url: "/ajax/ra/" + $(this).val(),
	    dataType: 'json',	    
	    success: function(ra) {
		setRTFields(ra);
	    }	
	});
    });
    $("a[id^='radel']").click(function() {
	var id = this.id.substr(5);
	if(confirm("Are you sure?")) {
	    $.ajax({
		url: "/released_animal/" + id,
		type: "DELETE",
		success: function(anything) {
		    window.location = "/released_animal";
		}
	    });
	}
	return false;
    });
    $("select[id^='rt_']").change(function() {
	var id = $(this).val();
	displayRT(id);
    });
    ajax_hovno();
});
