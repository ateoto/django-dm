$(function() {

	function Party(resource_uri) {
		this.resource_uri = resource_uri;
		this.characters = [];
	}

	Party.prototype.get_party = function() {
		console.log('Updating Party Data.');
		var this_party = this;
		$.get(this_party.resource_uri, '',
			function(data) {
				_.each(data.characters, function(element) {
					var c = new Character(element);
					this_party.characters.push(c);
				});
				_.each(this_party.characters, function(element){
					element.get_character();
				});
		}, "json");	
	}

	Party.prototype.update_ui = function() {
		console.log('Updating all Character UI');
		_.each(this.characters, function(element) {
			element.update_ui();
		});
	}

	Party.prototype.get_character_by_id = function(character_id) {
		var character_id = character_id;
		var character;
		_.each(this.characters, function(element) {
			if (element.id == character_id) {
				character = element;
			}
		});
		return character;
	}

	function Character(resource_uri) {
		this.resource_uri = resource_uri;
	}

	Character.prototype.get_character = function() {
		var this_character = this;
		$.get(this_character.resource_uri, '',
			function(data) {
				this_character.name = data.name;
				this_character.hit_points = data.hit_points;
				this_character.max_hit_points = data.max_hit_points;
				this_character.id = data.id;
				console.log('Got character ' + this_character.id);
				this_character.update_ui();
		}, "json");
	}

	Character.prototype.set_character = function() {
		var this_character = this;
		$.ajax({
			url: this_character.resource_uri,
			type: 'PATCH',
			contentType: 'application/json',
			data: JSON.stringify({ "hit_points": this_character.hit_points }),
			dataType: 'json',
			processData: false,
	        beforeSend: function(jqXHR, settings) {
	        	jqXHR.setRequestHeader('X-CSRFToken', $('input[name=csrfmiddlewaretoken]').val());
	        },
	        success: function(data, textStatus, jqXHR) {
	        	this_character.update_ui();
	        },
		});


	}

	Character.prototype.update_ui = function() {
		console.log('Update ui for ' + this.id);
		var hp_percentage = ((this.hit_points / this.max_hit_points) * 100);
		$('#hp-text-' + this.id).text(this.hit_points);
		$('#max-hp-text-' + this.id).text(this.max_hit_points);
	}

	my_party = new Party('/dm/api/v1/party/' + $('#party').attr('party-id') + '/');

	$.when(my_party.get_party()).then(my_party.update_ui());

	$('#hp-modal').modal({
		show: false,
	});

	$('#xp-modal').modal({
		show: false,
	});

	//update_party($('#party').attr('party-id'));

	$('.hp-btn').click(function(){
		var cid = $(this).attr('character-id');
		var character = my_party.get_character_by_id(cid);
		$('#hp-modal-save').removeAttr('party-id');
		$('#hp-modal-save').attr('character-id', cid);
		$('#hp-modal-label').text(character.name);
		$('#hp-input').val(character.hit_points);
		$('#hp-modal').modal('show');
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
		var character = my_party.get_character_by_id(cid);
		$('#hp-input').val(character.max_hit_points);
	});


	$('#hp-modal-save').click(function() {
		var new_value = $('#hp-input').val();
		if ($('#hp-modal-save').attr('party-id') == undefined) {
			var cid = $('#hp-modal-save').attr('character-id');
			var character = my_party.get_character_by_id(cid);
			character.hit_points = new_value;
			character.set_character();
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