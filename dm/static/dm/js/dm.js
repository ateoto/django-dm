$(function() {

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
				this_character.level = data.level;
				this_character.race = data.race.name;
				this_character.class_type = data.class_type.name;
				this_character.defenses = data.defenses;
				this_character.abilities = data.abilities;
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
		$('#pc-init-' + this.id).text(this.abilities.dex.modifier_half_level);
		$('#hp-text-' + this.id).text(this.hit_points);
		$('#max-hp-text-' + this.id).text(this.max_hit_points);
	}

	$('#pc-detail').hide();
	$('#pc-detail-stats').hide();
	$('#pc-detail-dm').hide();

	my_party = new Party('/dm/api/v1/party/' + $('#pc-overview').attr('party-id') + '/');
	encounter = new Encounter('/dm/api/v1/encounter/1/'); //For Now

	my_party.get_party();
	encounter.get_encounter();

	$('.pc-character-overview').click(function() {
		$("#pc-detail").hide();
		$('#pc-detail-stats').hide();
		var pcid = $(this).attr('pc-id');
		var character = my_party.get_character_by_id(pcid);
		$('#pc-detail').attr('pc-id', pcid);
		$('#pc-detail-name').text(character.name);
        $('#pc-detail-level-text').text(character.level);
        $('#pc-detail-flavor').text(character.race + ' ' + character.class_type);
		$('#pc-detail-ac .pc-detail-defense-value').text(character.defenses.ac.total);
		$('#pc-detail-fort .pc-detail-defense-value').text(character.defenses.fort.total);
		$('#pc-detail-ref .pc-detail-defense-value').text(character.defenses.ref.total);
		$('#pc-detail-will .pc-detail-defense-value').text(character.defenses.will.total);
		$('#pc-detail-str .pc-detail-ability-check').text(character.abilities.str.check);
		$('#pc-detail-dex .pc-detail-ability-check').text(character.abilities.dex.check);
		$('#pc-detail-wis .pc-detail-ability-check').text(character.abilities.wis.check);
		$('#pc-detail-con .pc-detail-ability-check').text(character.abilities.con.check);
		$('#pc-detail-int .pc-detail-ability-check').text(character.abilities.int.check);
		$('#pc-detail-cha .pc-detail-ability-check').text(character.abilities.cha.check);
        
        $('#pc-detail').show();
        $('#pc-detail-toolbar .active').click();
	});

	$('#pc-detail-toolbar .btn').tooltip({ placement: 'bottom'});

	$('#pc-initiative-btn').click(function() {
		var pcid = $('#pc-detail').attr('pc-id');
		$('#pc-initiative-form').attr('for-pc', pcid);
		$('#initiative-modal').modal('show');
		$('#pc-initiative-input').val($('#pc-init-' + pcid).text());
		$('#pc-initiative-input').focus();
	});

	$('#pc-stats-btn').click(function() {
		$('#pc-detail-dm').hide();
		$('#pc-detail-stats').show();
	});
	
	$('#pc-dm-btn').click(function() {
		$('#pc-detail-stats').hide();
		$('#pc-detail-dm').show();
		$('#pc-damage').focus();
	});

	$('#pc-damage-btn').click(function() {
		var pcid = $('#pc-detail').attr('pc-id');
		var damage = $('#pc-damage').val();
		if ($.isNumeric(damage)) {
			damage = parseInt(damage, 10);
			var character = my_party.get_character_by_id(pcid);
			character.hit_points -= damage;
			character.set_character();
			//Stuff to check bloodied/death
		}
		$('#pc-damage').val('');
	});

	$('#pc-heal-btn').click(function() {
		var pcid = $('#pc-detail').attr('pc-id');
		var heal = $('#pc-heal').val();
		if ($.isNumeric(heal)) {
			heal = parseInt(heal, 10);
			var character = my_party.get_character_by_id(pcid);
			character.hit_points += heal;
			character.set_character();
			//stuff to limit to certain amount
		}
		$('#pc-heal').val('');
	});

	$('#pc-init-btn').click(function() {
		var pcid = $('#pc-detail').attr('pc-id');
		var initiative = $('#pc-init').val();
		if ($.isNumeric(initiative)) {
			initiative = parseInt(initiative, 10);
			$('#pc-init-' + pcid).text(initiative);
		}
		$('#pc-init').val('');
	});

	$("#pc-damage").keyup(function(ev) {
 		if (ev.which === 13) {
			$('#pc-damage-btn').click();
		}
	}); 
	
	$("#pc-heal").keyup(function(ev) {
 		if (ev.which === 13) {
			$('#pc-heal-btn').click();
		}
	}); 

	$("#pc-init").keyup(function(ev) {
 		if (ev.which === 13) {
			$('#pc-init-btn').click();
		}
	}); 
});