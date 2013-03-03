function Encounter(resource_uri) {
	this.resource_uri = resource_uri;
	this.participant_table = {
		pcs: {},
		npcs: {}
	};
}

Encounter.prototype.get_encounter = function() {
	console.log('Updating Encounter Data.');
	var this_encounter = this;
	var jqxhr = $.get(this_encounter.resource_uri, '',
		function(data, textStatus, jqXHR) {
			this_encounter.id = data.id;
			this_encounter.party = new Party(data.pcs);
			this_encounter.npcgroup = new NPCGroup(data.npcs);
			this_encounter.notes = data.notes;
	}, "json")
	.done(function() {
		var encounter_id = this_encounter.id;
		$.get('/dm/api/v1/encounter_participant/?encounter=' + encounter_id, '',
			function(data, textStatus, jqXHR) {
				_.each(data.objects, function(p) {
					if (p.is_pc) {
						this_encounter.participant_table.pcs[p.pc_id] = {
							'resource_uri': p.resource_uri,
							'initiative': p.initiative
						}
					} else {
						this_encounter.participant_table.npcs[p.npc_id] = {
							'resource_uri': p.resource_uri,
							'initiative': p.initiative,
							'symbol': p.symbol
						}
					}
				});
		}, "json");
	});

	return jqxhr;
}

Encounter.prototype.save_participant = function(participant) {
	$.ajax({
		url: participant.resource_uri,
		type: 'PATCH',
		contentType: 'application/json',
		data: JSON.stringify(participant),
		dataType: 'json',
		processData: false,
        beforeSend: function(jqXHR, settings) {
        	jqXHR.setRequestHeader('X-CSRFToken', $('input[name=csrfmiddlewaretoken]').val());
        },
	});
}

Encounter.prototype.save_notes = function() {
	var resource_uri = this.resource_uri;
	var notes = this.notes;
	$.ajax({
		url: resource_uri,
		type: 'PATCH',
		contentType: 'application/json',
		data: JSON.stringify({'notes': notes}),
		dataType: 'json',
		processData: false,
        beforeSend: function(jqXHR, settings) {
        	jqXHR.setRequestHeader('X-CSRFToken', $('input[name=csrfmiddlewaretoken]').val());
        },
	});
}
