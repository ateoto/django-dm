function NPCGroup(resource_uris) {
	this.resource_uris = resource_uris;
	this.npcs = [];
}

NPCGroup.prototype.get_npcgroup = function() {
	console.log('Updating NPCGroup Data.');
	var this_npcgroup = this;
	_.each(this_npcgroup.resource_uris, function(resource_uri) {
		var npc = new NPC(resource_uri);
		this_npcgroup.npcs.push(npc);
	});
	_.each(this_npcgroup.npcs, function(npc) {
		npc.get_npc();
	});
}

NPCGroup.prototype.update_ui = function() {
	console.log('Updating all NPC UI');
	_.each(this.npcs, function(element) {
		element.update_ui();
	});
}

NPCGroup.prototype.get_npc_by_id = function(npc_id) {
	var npc_id = npc_id;
	var npc;
	_.each(this.npcs, function(element) {
		if (element.id == npc_id) {
			npc = element;
		}
	});
	return npc;
}
