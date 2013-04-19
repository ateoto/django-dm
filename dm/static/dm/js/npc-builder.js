$(function() {
    $('#npc-stats').hide();
    $('#npc-powers').hide();

    $('#npc-next-btn').click(function() {
        //Check to make sure it's all filled out.
        $('#npc').hide();
        $('#npc-stats').show();
    });
    $('#npc-stats-next-btn').click(function() {
        //Check to make sure it's all filled out.
        $('#npc-stats').hide();
        $('#npc-powers').show();
    });
});
