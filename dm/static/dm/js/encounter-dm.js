$(function() {
	$('#pc-detail-stats').hide();
	$('#pc-detail-dm').hide();

	//$('#detail').affix({ offset: {x: 400, y : 30}});

	$('#npc-detail-stats').hide();
	$('#npc-detail-dm').hide();

	party = new Party('/dm/api/v1/party/' + $('#pc-overview').attr('party-id') + '/');
	encounter = new Encounter('/dm/api/v1/encounter/' + $('#encounter').attr('encounter-id') + '/');

	party.get_party();
	encounter.get_encounter();
	
	var npc_source = $('#npc-template').html();
	var npc_template = Handlebars.compile(npc_source);

	$('.pc-character-overview').click(function() {
		$('#pc-detail').hide();
		$('#pc-detail-stats').hide();
		var pcid = $(this).attr('pc-id');
		var character = party.get_character_by_id(pcid);
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

	$('.pc-group-command-container').click(function() {
		var checkbox = $(this).find('.pc-group-command')
		checkbox.attr("checked", !checkbox.attr("checked"));
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
			var character = party.get_character_by_id(pcid);
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
			var character = party.get_character_by_id(pcid);
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
			var character = party.get_character_by_id(pcid);
			character.initiative = initiative;
			$('#pc-init-' + pcid).text(character.initiative);

			//Update Encounter Initiative Table

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

	/********************** NPC ****************************/

	$('.npc-overview').click(function() {
		$('#npc-detail').hide();
		$('#npc-detail-stats').hide();
		var npcid = $(this).attr('npc-id');
		var npc = encounter.get_npc_by_id(npcid);
		$('#npc-detail-body-container').html(npc_template(npc));

		$('#npc-detail').attr('npc-id', npcid);
		$('#npc-detail-name').text(npc.name);
        $('#npc-detail-level-text').text(npc.level);
        $('#npc-detail-flavor').text(npc.role);
        
        $('#npc-detail').show();
        $('#npc-detail-toolbar .active').click();
	});

	$('#npc-detail-toolbar .btn').tooltip({ placement: 'bottom'});

	$('#npc-initiative-btn').click(function() {
		var npcid = $('#npc-detail').attr('npc-id');
		$('#npc-initiative-form').attr('for-npc', npcid);
		$('#initiative-modal').modal('show');
		$('#npc-initiative-input').val($('#npc-init-' + npcid).text());
		$('#npc-initiative-input').focus();
	});

	$('#npc-stats-btn').click(function() {
		$('#npc-detail-dm').hide();
		$('#npc-detail-stats').show();
	});
	
	$('#npc-dm-btn').click(function() {
		$('#npc-detail-stats').hide();
		$('#npc-detail-dm').show();
		$('#npc-damage').focus();
	});

	$('#npc-damage-btn').click(function() {
		var npcid = $('#npc-detail').attr('npc-id');
		var damage = $('#npc-damage').val();
		if ($.isNumeric(damage)) {
			damage = parseInt(damage, 10);
			var npc = encounter.get_npc_by_id(npcid);
			npc.hit_points -= damage;
			npc.set_npc();
			//Stuff to check bloodied/death
		}
		$('#npc-damage').val('');
	});

	$('#npc-heal-btn').click(function() {
		var npcid = $('#npc-detail').attr('npc-id');
		var heal = $('#npc-heal').val();
		if ($.isNumeric(heal)) {
			heal = parseInt(heal, 10);
			var npc = encounter.get_npc_by_id(npcid);
			npc.hit_points += heal;
			npc.set_npc();
			//stuff to limit to certain amount
		}
		$('#npc-heal').val('');
	});

	$('#npc-init-btn').click(function() {
		var npcid = $('#npc-detail').attr('npc-id');
		var initiative = $('#npc-init').val();
		if ($.isNumeric(initiative)) {
			initiative = parseInt(initiative, 10);
			var npc = encounter.get_npc_by_id(npcid);
			npc.initiative = initiative;
			$('#npc-init-' + npcid).text(npc.initiative);
		}
		$('#npc-init').val('');
	});

	$('#npc-symbol-btn').click(function() {
		var npcid = $('#npc-detail').attr('npc-id');
		var symbol = $('#npc-symbol').val();
		$('#npc-symbol-' + npcid).text(symbol);
		$('#npc-symbol').val('');
	});

	$('#npc-remove-btn').click(function() {
		var npcid = $('#npc-detail').attr('npc-id');
		$('#npc-detail').hide();
		$('#npc-' + npcid).remove();
	});

	$("#npc-damage").keyup(function(ev) {
 		if (ev.which === 13) {
			$('#npc-damage-btn').click();
		}
	});
	
	$("#npc-heal").keyup(function(ev) {
 		if (ev.which === 13) {
			$('#npc-heal-btn').click();
		}
	}); 

	$("#npc-init").keyup(function(ev) {
 		if (ev.which === 13) {
			$('#npc-init-btn').click();
		}
	});

	$('#npc-symbol').keyup(function(ev) {
		if (ev.which === 13) {
			$('#npc-symbol-btn').click();
		}
	});
});