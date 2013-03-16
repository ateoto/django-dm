$(function() {
    $('#pc-detail').hide();
    $('#npc-detail').hide();

    $('#encounter-notes').css({'height':($("#encounter-content").height() + "px")});

    var encounter_id = $('#encounter-content').attr('encounter-id');
    var encounter = new Encounter('/dm/api/v1/encounter/' + encounter_id + '/');
    encounter.get_encounter_data();
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
    var pc_detail_template = Handlebars.compile($('#pc-detail-template').html());

    $('.pc-character-overview').click(function() {
        //Set Menu
        var pcid = $(this).attr('pc-id');
        var epid = $(this).attr('ep-id');
        $('#pc-detail-stats').html(pc_detail_template(encounter.pcs[pcid]));
        $('#pc-detail-stats').attr('pc-id', pcid);
        $('#pc-detail-stats').attr('ep-id', epid);

        $('#side-nav > li').removeClass('active');
        $('#pc-detail-nav').addClass('active');
        $('#overview').hide();
        $('#pc-detail').show();
    });

    // NPC Detail View
    $('.npc-character-overview').click(function() {
        var npcid = $(this).attr('npc-id');
        var epid = $(this).attr('ep-id');
        console.log(encounter.npcs[npcid].npc);
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