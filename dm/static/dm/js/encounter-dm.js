$(function() {
    $('#pc-detail-stats').hide();
    $('#pc-detail-dm').hide();

    //$('#detail').affix({ offset: {x: 400, y : 30}});

    $('#encounter-dm').hide();
    $('#pc-party-dm').hide();
    $('#npc-detail-stats').hide();
    $('#npc-detail-dm').hide();
    $('#npc-detail').hide();

    $('#encounter-notes').css({'height':($("#encounter").height() + "px")});

    encounter = new Encounter('/dm/api/v1/encounter/' + $('#encounter').attr('encounter-id') + '/');

    encounter.get_encounter().done(function(){
        encounter.party.get_party();
        encounter.npcgroup.get_npcgroup();
    });

    var pc_party_card_source = $('#pc-template').html();
    var pc_party_card_template = Handlebars.compile(pc_party_card_source);

    var npc_card_source = $('#npc-card-template').html();
    var npc_card_template = Handlebars.compile(npc_card_source);

    $('.pc-character-overview').click(function() {
        $('#pc-detail').hide();
        $('#pc-detail-stats').hide();
        var pcid = $(this).attr('pc-id');
        var character = encounter.party.get_character_by_id(pcid);
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
            var character = encounter.party.get_character_by_id(pcid);
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
            var character = encounter.party.get_character_by_id(pcid);
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
            var character = encounter.party.get_character_by_id(pcid);
            character.initiative = initiative;
            $('#pc-init-' + pcid).text(character.initiative);
            encounter.participant_table.pcs[pcid].initiative = initiative;
            encounter.save_participant(encounter.participant_table.pcs[pcid]);
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
        $('#overview').hide();
        $('#npc-detail-stats').hide();
        var npcid = $(this).attr('npc-id');
        var npc = encounter.npcgroup.get_npc_by_id(npcid);
        $('#npc-card').html(npc_card_template(npc));

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

    $('#npc-detail-damage-btn').click(function() {
        var npcid = $('#npc-detail').attr('npc-id');
        var damage = $('#npc-detail-damage').val();
        if ($.isNumeric(damage)) {
            damage = parseInt(damage, 10);
            var npc = encounter.npcgroup.get_npc_by_id(npcid);
            npc.hit_points -= damage;
            npc.set_npc();
            //Stuff to check bloodied/death
        }
        $('#npc-detail-damage').val('');
    });

    $('#npc-detail-heal-btn').click(function() {
        var npcid = $('#npc-detail').attr('npc-id');
        var heal = $('#npc-detail-heal').val();
        if ($.isNumeric(heal)) {
            heal = parseInt(heal, 10);
            var npc = encounter.npcgroup.get_npc_by_id(npcid);
            npc.hit_points += heal;
            npc.set_npc();
            //stuff to limit to certain amount
        }
        $('#npc-detail-heal').val('');
    });

    $('#npc-detail-init-btn').click(function() {
        var npcid = $('#npc-detail').attr('npc-id');
        var initiative = $('#npc-detail-init').val();
        if ($.isNumeric(initiative)) {
            initiative = parseInt(initiative, 10);
            var npc = encounter.npcgroup.get_npc_by_id(npcid);
            npc.initiative = initiative;
            $('#npc-detail-init-' + npcid).text(npc.initiative);
            encounter.participant_table.npcs[npcid].initiative = initiative;
            encounter.save_participant(encounter.participant_table.npcs[npcid]);
        }
        $('#npc-detail-init').val('');
    });

    $('#npc-detail-symbol-btn').click(function() {
        var npcid = $('#npc-detail').attr('npc-id');
        var symbol = $('#npc-detail-symbol').val();
        $('#npc-detail-symbol-' + npcid).text(symbol);
        encounter.participant_table.npcs[npcid].symbol = symbol;
        encounter.save_participant(encounter.participant_table.npcs[npcid]);
        $('#npc-detail-symbol').val('');
    });

    $('#npc-remove-btn').click(function() {
        var npcid = $('#npc-detail').attr('npc-id');
        $('#npc-detail').hide();
        $('#npc-' + npcid).remove();
    });

    $("#npc-detail-damage").keyup(function(ev) {
        if (ev.which === 13) {
            $('#npc-detail-damage-btn').click();
        }
    });

    $("#npc-detail-heal").keyup(function(ev) {
        if (ev.which === 13) {
            $('#npc-detail-heal-btn').click();
        }
    });

    $("#npc-detail-init").keyup(function(ev) {
        if (ev.which === 13) {
            $('#npc-detail-init-btn').click();
        }
    });

    $('#npc-vsymbol').keyup(function(ev) {
        if (ev.which === 13) {
            $('#npc-detail-symbol-btn').click();
        }
    });

    $('#side-nav').click(function() {
        return false;
    });

    $('#encounter-overview-nav').click(function() {
        $('#overview').show();
        $('#npc-detail').hide();
        $('#pc-party-dm').hide();
    });

    $('#pc-dm-nav').click(function() {
        $('#overview').hide();
        $('#pc-party-dm').show();
    })

    $('#encounter-notes').focusout(function() {
        encounter.notes = $('#encounter-notes').val();
        encounter.save_notes();
    });

    $(document).on('click', '.party-dm-character-block', function() {
        $(this).toggleClass('dm-block-selection');
    });

    /*************** Party DM Controls *************/

    $('#pc-party-damage-btn').click(function() {
        var damage = $('#pc-party-damage').val();
        if ($.isNumeric(damage)) {
            damage = parseInt(damage, 10);
            _.each($('#party-detail-view .dm-block-selection'), function(p) {
                pcid = $(p).attr('character-id');
                var character = encounter.party.get_character_by_id(pcid);
                character.hit_points -= damage;
                character.set_character();
            });
        }
        $('#party-detail-view').html(pc_party_card_template(encounter.party));
        $('#pc-party-damage').val('');
    });

    $('#pc-party-damage').keyup(function(ev) {
        if (ev.which === 13) {
            $('#pc-party-damage-btn').click();
        }
    });

    $('#pc-party-heal-btn').click(function() {
        var heal = $('#pc-party-heal').val();
        if ($.isNumeric(heal)) {
            heal = parseInt(heal, 10);
            _.each($('#party-detail-view .dm-block-selection'), function(p) {
                pcid = $(p).attr('character-id');
                var character = encounter.party.get_character_by_id(pcid);
                character.hit_points += heal;
                character.set_character();
            });
        }
        $('#party-detail-view').html(pc_party_card_template(encounter.party));
        $('#pc-party-heal').val('');
    });

    $('#pc-party-heal').keyup(function(ev) {
        if (ev.which === 13) {
            $('#pc-party-heal-btn').click();
        }
    });

    $('#pc-party-xp-btn').click(function() {
        var xp = $('#pc-party-xp').val();
        if ($.isNumeric(xp)) {
            xp = parseInt(xp, 10);
            _.each($('#party-detail-view .dm-block-selection'), function(p) {
                pcid = $(p).attr('character-id');
                var character = encounter.party.get_character_by_id(pcid);
                character.xp += xp;
                character.set_character();
            });
        }
        $('#party-detail-view').html(pc_party_card_template(encounter.party));
        $('#pc-party-xp').val('');
    });

    $('#pc-party-xp').keyup(function(ev) {
        if (ev.which === 13) {
            $('#pc-party-xp-btn').click();
        }
    });

    $('#pc-party-money-btn').click(function() {
        console.log('FUCK YEA');
    });

    $('#pc-party-money').keyup(function(ev) {
        if (ev.which === 13) {
            $('#pc-party-money-btn').click();
        }
    });
});