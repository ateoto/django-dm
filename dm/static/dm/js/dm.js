$(function() {
	$('#hp-modal').modal({
		show: false,
	});

	$('#xp-modal').modal({
		show: false,
	});

	update_party($('#party').attr('party-id'));

	$('.hp-btn').click(function(){
		var cid = $(this).attr('character-id');
		$('#hp-modal-save').removeAttr('party-id');
		$('#hp-modal-save').attr('character-id', cid);
		$.get('/DnD/api/v1/character/' + cid + '/','',
			function(data) {
				$('#hp-modal-label').text(data.name);
				$('#hp-input').val(data.hit_points);
				$('#hp-modal').modal('show');
		}, "json");
	});

	$('#hp-btn-party').click(function() {
		var pid = $('#hp-btn-party').attr('party-id');
		$('#hp-modal-save').removeAttr('character-id');
		$('#hp-modal-save').attr('party-id', pid);

		$.get('/dm/api/v1/party/' + pid + '/','',
			function(data) {
				$('#hp-modal-label').text(data.name);
				$('#hp-input').val('');
				$('#hp-modal').modal('show');
			}, "json");
	});

	$('#hp-max-btn').click(function() {
		var cid = $('#hp-modal-save').attr('character-id');
		get_max_hp('/DnD/api/v1/character/' + cid + '/');
	});


	$('#hp-modal-save').click(function() {
		var new_value = $('#hp-input').val();
		if ($('#hp-modal-save').attr('party-id') == undefined) {
			var cid = $('#hp-modal-save').attr('character-id');
			set_hp('/DnD/api/v1/character/' + cid + '/', new_value);
		} else {
			var pid = $('#hp-modal-save').attr('party-id');
			$.get('/dm/api/v1/party/' + pid + '/', '',
				function(data) {
					_.each(data.characters, function(element) {
						set_hp(element, new_value);
					});
			}, "json");
		}
		$('#hp-modal').modal('hide');
	});
});

function update_party(pid) {
	$.get('/dm/api/v1/party/' + pid + '/', '',
		function(data) {
			_.each(data.characters, function(element) {
				update_character(element);
			});
	}, "json");
}

function get_max_hp(resource_uri) {
	$.get(resource_uri,'',
		function(data) {
			$('#hp-input').val(data.max_hit_points);
	}, "json");
}

function set_hp(resource_uri, hp) {
	$.ajax({
		url: resource_uri,
		type: 'PATCH',
		contentType: 'application/json',
		data: JSON.stringify({ "hit_points": hp }),
		dataType: 'json',
		processData: false,
        beforeSend: function(jqXHR, settings) {
        	jqXHR.setRequestHeader('X-CSRFToken', $('input[name=csrfmiddlewaretoken]').val());
        },
        success: function(data, textStatus, jqXHR) {
        	update_character(resource_uri);
        },
	});
}

function update_character(resource_uri) {
	$.get(resource_uri,'',
		function(data) {
			console.log(data);
			var cid = data.id;
			var hit_points = data.hit_points;
			var max_hit_points = data.max_hit_points;
			var hp_percentage = ((hit_points / max_hit_points) * 100);
			$('#hp-text-' + cid).text(hit_points);

			if (hp_percentage <= 30) {
				$('#hp-bar-parent-' + cid).removeClass("progress-success progress-warning").addClass("progress-danger");
			}
			else if (hp_percentage > 30 && hp_percentage <= 50) {
				$('#hp-bar-parent-' + cid).removeClass("progress-success progress-danger").addClass("progress-warning");
			}
			else {
				$('#hp-bar-parent-' + cid).removeClass("progress-warning progress-danger").addClass("progress-success");
			}
			
			$('#hp-bar-' + cid).css("width", hp_percentage + "%");
	}, "json");
}