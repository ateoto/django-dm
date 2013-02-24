function Party(resource_uris) {
	this.resource_uris = resource_uris;
	this.characters = [];
}

Party.prototype.get_party = function() {
	console.log('Updating Party Data.');
	var this_party = this;
	_.each(this_party.resource_uris, function(resource_uri) {
		var c = new Character(resource_uri);
		this_party.characters.push(c);
	});
	_.each(this_party.characters, function(c) {
		c.get_character();
	});
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
