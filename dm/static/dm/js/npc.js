function NPC(resource_uri) {
	this.resource_uri = resource_uri;
}

NPC.prototype.get_npc = function() {
	var this_npc = this;
	$.get(this_npc.resource_uri, '',
		function(data) {
			this_npc.name = data.name;
			this_npc.hit_points = data.hit_points;
			this_npc.max_hit_points = data.max_hit_points;
			this_npc.role = data.role;
			this_npc.abilities = data.abilities;
			this_npc.defenses = data.defenses;
			this_npc.level = data.level;
			this_npc.update_ui();
	}, "json");
}

NPC.prototype.update_ui = function() {
	console.log('Update UI for NPC.');
	if (this.hit_points <= 0) {
		$('#npc-' + this.id).addClass('dead');
	} else {
		$('#npc-' + this.id).removeClass('dead');
	}
	$('#npc-hp-text-' + this.id).text(this.hit_points);
	$('#npc-max-hp-text-' + this.id).text(this.max_hit_points);
}
