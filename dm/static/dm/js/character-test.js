function Character(resource_uri) {
	this.resource_uri = resource_uri;
}

Character.prototype.get_character = function() {
	var that = this;
	$.get(that.resource_uri, '',
		function(data) {
			that.xp = data.xp;
			that.next_level_xp_needed = data.next_level_xp_needed;
			that.next_level_percentage = data.next_level_percentage;
			that.level = data.level;
			that.race = data.race.name;
			that.class_type = data.class_type.name;
			that.defenses = data.defenses;
			that.abilities = data.abilities;
	}, "json");
}

Character.prototype.set_character = function() {
	var that = this;
	$.ajax({
		url: that.resource_uri,
		type: 'PATCH',
		contentType: 'application/json',
		data: JSON.stringify({ "hit_points": that.hit_points,
								"xp": that.xp }),
		dataType: 'json',
		processData: false,
        beforeSend: function(jqXHR, settings) {
        	jqXHR.setRequestHeader('X-CSRFToken', $('input[name=csrfmiddlewaretoken]').val());
        },
        success: function(data, textStatus, jqXHR) {
        	that.update_ui();
        },
	});
}