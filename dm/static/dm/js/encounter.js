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
	var this_encounter = this;
	_.each(this_encounter.npcs, function(element) {
		element.update_ui();
	});
}

Encounter.prototype.get_npc_by_id = function(npc_id) {
	var npc_id = npc_id;
	var npc;
	_.each(this.npcs, function(element) {
		if (element.id == npc_id) {
			npc = element;
		}
	});
	return npc;
}
