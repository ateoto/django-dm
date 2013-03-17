$(function() {
    $('#pc-detail').hide();
    $('#npc-detail').hide();

    $('#encounter-notes').css({'height':($("#encounter-content").height() + "px")});

    var encounter_id = $('#encounter-content').attr('encounter-id');
    var encounter = new Encounter('/dm/api/v1/encounter/' + encounter_id + '/');
    encounter.get_encounter();
    encounter.notes = $('#encounter-notes').val();

    // Navigation
    $('#side-nav > li').click(function(e) {
        $('#side-nav > li').removeClass('active');
        $(this).addClass('active');
        return false;
    });

    $('#encounter-overview-nav').click(function(e) {
        $('#pc-detail').hide();
        $('#npc-detail').hide();
        $('#overview').show();
        return false;
    });

    // PC Detail View
    var pc_overview_row_template = Handlebars.compile($('#pc-overview-row-template').html());
    var pc_detail_template = Handlebars.compile($('#pc-detail-template').html());

    $('.pc-character-overview').click(function() {
        //Set Menu
        var pcid = $(this).attr('pc-id');
        var epid = $(this).attr('ep-id');
        $('#pc-detail-stats').html(pc_detail_template(encounter.pcs[pcid]));
        $('#pc-detail').attr('pc-id', pcid);
        $('#pc-detail').attr('ep-id', epid);

        $('#side-nav > li').removeClass('active');
        $('#pc-detail-nav').addClass('active');
        $('#overview').hide();
        $('#pc-detail').show();
    });

    // NPC Detail View
    var npc_overview_row_template = Handlebars.compile($('#npc-overview-row-template').html());
    var npc_detail_template = Handlebars.compile($('#npc-detail-template').html());

    $('.npc-character-overview').click(function() {
        var npcid = $(this).attr('npc-id');
        var epid = $(this).attr('ep-id');
        $('#npc-detail-stats').html(npc_detail_template(encounter.npcs[npcid]));
        $('#npc-detail').attr('npc-id', npcid);
        $('#npc-detail').attr('ep-id', epid);

        $('#side-nav > li').removeClass('active');
        $('#npc-detail-nav').addClass('active');
        $('#overview').hide();
        $('#npc-detail').show();
    });

    // PC Detail DM Buttons
    $('#pc-detail-damage-btn').click(function() {
        var damage = $('#pc-detail-damage').val();
        if ($.isNumeric(damage)) {
            damage = parseInt(damage, 10);
            var pcid = $('#pc-detail').attr('pc-id');
            encounter.damage_pc(pcid, damage);
            $('#pc-detail-stats').html(pc_detail_template(encounter.pcs[pcid]));
            $('#pc-' + pcid).html(pc_overview_row_template(encounter.pcs[pcid]));
        }
        $('#pc-detail-damage').val('');
    });

    $('#pc-detail-heal-btn').click(function() {
        var health = $('#pc-detail-heal').val();
        if ($.isNumeric(health)) {
            health = parseInt(health, 10);
            var pcid = $('#pc-detail').attr('pc-id');
            encounter.heal_pc(pcid, health);
            $('#pc-detail-stats').html(pc_detail_template(encounter.pcs[pcid]));
            $('#pc-' + pcid).html(pc_overview_row_template(encounter.pcs[pcid]));
        }
        $('#pc-detail-heal').val('');
    });

    $('#pc-detail-init-btn').click(function() {
        var init = $('#pc-detail-init').val();
        if ($.isNumeric(init)) {
            init = parseInt(init, 10);
            var pcid = $('#pc-detail').attr('pc-id');
            encounter.set_init_pc(pcid, init);
            $('#pc-detail-stats').html(pc_detail_template(encounter.pcs[pcid]));
            $('#pc-' + pcid).html(pc_overview_row_template(encounter.pcs[pcid]));
        }
        $('#pc-detail-init').val('');
    });

    $('#pc-detail-xp-btn').click(function() {
        var pcid = $('#pc-detail').attr('pc-id');
    });

    $('#pc-detail-money-btn').click(function() {
        var pcid = $('#pc-detail').attr('pc-id');
    });

    // NPC Detail Buttons
    $('#npc-detail-damage-btn').click(function() {
        var damage = $('#npc-detail-damage').val();
        if ($.isNumeric(damage)) {
            damage = parseInt(damage, 10);
            var npcid = $('#npc-detail').attr('npc-id');
            encounter.damage_npc(npcid, damage);
            $('#npc-detail-stats').html(npc_detail_template(encounter.npcs[npcid]));
            $('#npc-' + npcid).html(npc_overview_row_template(encounter.npcs[npcid]));
        }
        $('#npc-detail-damage').val('');
    });

    $('#npc-detail-heal-btn').click(function() {
        var health = $('#npc-detail-heal').val();
        if ($.isNumeric(health)) {
            health = parseInt(health, 10);
            var npcid = $('#npc-detail').attr('npc-id');
            encounter.heal_npc(npcid, health);
            $('#npc-detail-stats').html(npc_detail_template(encounter.npcs[npcid]));
            $('#npc-' + npcid).html(npc_overview_row_template(encounter.npcs[npcid]));
        }
        $('#npc-detail-heal').val('');
    });

    $('#npc-detail-init-btn').click(function() {
        var init = $('#npc-detail-init').val();
        if ($.isNumeric(init)) {
            init = parseInt(init, 10);
            var npcid = $('#npc-detail').attr('npc-id');
            encounter.set_init_npc(npcid, init);
            $('#npc-detail-stats').html(npc_detail_template(encounter.npcs[npcid]));
            $('#npc-' + npcid).html(npc_overview_row_template(encounter.npcs[npcid]));
        }
        $('#npc-detail-init').val('');
    });

    $('#npc-detail-symbol-btn').click(function() {
        var symbol = $('#npc-detail-symbol').val();
        var npcid = $('#npc-detail').attr('npc-id');
        encounter.set_symbol_npc(npcid, symbol);
        $('#npc-detail-stats').html(npc_detail_template(encounter.npcs[npcid]));
        $('#npc-' + npcid).html(npc_overview_row_template(encounter.npcs[npcid]));
        $('#npc-detail-symbol').val('');
    });


    // Handle Enter on all DM Input Fields
    $('.dm-action').keyup(function(e) {
        if (e.which === 13) {
            var element_id = $(this).attr('id');
            $('#' + element_id + '-btn').click();
        }
    });

    // Notes
    $('#save-notes-button').click(function() {
        var notes = $('#encounter-notes').val();
        if (encounter.notes != notes) {
            encounter.notes = notes;
            encounter.save_notes();
        }
        return false;
    });
});
