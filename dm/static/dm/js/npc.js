function NPC(resource_uri) {
    this.resource_uri = resource_uri;
}

NPC.prototype.get_npc = function() {
    var this_npc = this;
    $.get(this_npc.resource_uri, '',
        function(data) {
            this_npc.id = data.id;
            this_npc.name = data.name;
            this_npc.hit_points = data.hit_points;
            this_npc.max_hit_points = data.max_hit_points;
            if (this_npc.max_hit_points > 1) {
                this_npc.bloodied = Math.floor(this_npc.max_hit_points / 2);
            }
            this_npc.role = data.role;
            this_npc.abilities = data.abilities;
            this_npc.defenses = data.defenses;
            this_npc.powers = data.powers;
            this_npc.level = data.level;
            this_npc.speed = data.speed;
            this_npc.initiative = data.initiative;
            this_npc.perception = data.perception;
            this_npc.xp_reward = data.xp_reward;
            this_npc.update_ui();
    }, "json");
}

NPC.prototype.set_npc = function() {
    var this_npc = this;
    $.ajax({
        url: this_npc.resource_uri,
        type: 'PATCH',
        contentType: 'application/json',
        data: JSON.stringify({ "hit_points": this_npc.hit_points }),
        dataType: 'json',
        processData: false,
        beforeSend: function(jqXHR, settings) {
            jqXHR.setRequestHeader('X-CSRFToken', $('input[name=csrfmiddlewaretoken]').val());
        },
        success: function(data, textStatus, jqXHR) {
            console.log('Updating ui for NPC');
            this_npc.update_ui();
        }
    });
}

NPC.prototype.update_ui = function() {
    console.log('Update UI for NPC.');
    if (this.hit_points <= 0) {
        $('#npc-' + this.id + ' > td').addClass('dead');
    } else {
        $('#npc-' + this.id + ' > td').removeClass('dead');
    }
    $('#npc-init-' + this.id).text(this.initiative);
    $('#npc-hp-text-' + this.id).text(this.hit_points);
    $('#npc-max-hp-text-' + this.id).text(this.max_hit_points);
}
