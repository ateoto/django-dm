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
