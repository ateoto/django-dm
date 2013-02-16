function Encounter(resource_uri) {
	this.resource_uri = resource_uri;
	this.npcs = [];
}

Encounter.prototype.get_encounter = function() {
	console.log('Updating Encounter Data.');
	var this_encounter = this;
	var jqxhr = $.get(this_encounter.resource_uri, '',
		function(data) {
			_.each(data.npcs, function(element) {
				var npc = new NPC(element);
				this_encounter.npcs.push(npc);
			});
			_.each(this_encounter.npcs, function(element) {
				element.get_npc();
			});
	}, "json");

	return jqxhr;
}

Encounter.prototype.update_ui = function() {
	console.log('Update Encounter UI.');
	var this_encounter = this;
	console.log(this_encounter.npcs);
	_.each(this_encounter.npcs, function(element) {
		console.log('Rabble');
		element.update_ui();
	});
}
