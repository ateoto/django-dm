$(function() {
    $('#pc-detail-stats').hide();
    $('#pc-detail-dm').hide();
    $('#encounter-dm').hide();
    $('#pc-party-dm').hide();
    $('#npc-detail-stats').hide();
    $('#npc-detail-dm').hide();
    $('#npc-detail').hide();

    $('#encounter-notes').css({'height':($("#encounter-content").height() + "px")});

    var encounter_id = $('#encounter-content').attr('encounter-id');

    var encounter = new Encounter('/dm/api/v1/encounter/' + encounter_id + '/');

    encounter.get_encounter_data();

    encounter.notes = $('#encounter-notes').val();

    // PC Detail View

    $('.pc-character-overview').click(function() {
        //Set Menu
        var pcid = $(this).attr('pc-id');
        var epid = $(this).attr('ep-id');





        console.log(pcid, epid);
    });

    $('.npc-character-overview').click(function() {
        var npcid = $(this).attr('npc-id');
        var epid = $(this).attr('ep-id');
        console.log(npcid, epid);
    });





    $('#save-notes-button').click(function() {
        var notes = $('#encounter-notes').val();
        if (encounter.notes != notes) {
            encounter.notes = notes;
            encounter.save_notes();
        }
    });
});