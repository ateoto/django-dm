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
			this_character.hp_percentage = data.hp_percentage;
			this_character.xp = data.xp;
			this_character.next_level_xp_needed = data.next_level_xp_needed;
			this_character.next_level_percentage = data.next_level_percentage;
			this_character.id = data.id;
			this_character.level = data.level;
			this_character.race = data.race.name;
			this_character.class_type = data.class_type.name;
			this_character.defenses = data.defenses;
			this_character.abilities = data.abilities;
			this_character.initiative = data.abilities.dex.modifier_half_level;
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
		data: JSON.stringify({ "hit_points": this_character.hit_points,
								"xp": this_character.xp ex}),
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
	$('#pc-init-' + this.id).text(this.initiative);
	$('#hp-text-' + this.id).text(this.hit_points);
	$('#max-hp-text-' + this.id).text(this.max_hit_points);
}
