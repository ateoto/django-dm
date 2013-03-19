function NPC(resource_uri) {
    this.resource_uri = resource_uri;
}

NPC.prototype.get_npc = function() {
    var that = this;
    $.get(that.resource_uri, '',
        function(data) {
            if (that.max_hit_points > 1) {
                that.bloodied = Math.floor(that.max_hit_points / 2);
            }
            that.role = data.role;
            that.abilities = data.abilities;
            that.defenses = data.defenses;
            that.powers = data.powers;
            that.level = data.level;
            that.speed = data.speed;
            that.is_alive = data.is_alive;
            that.perception = data.perception;
            that.xp_reward = data.xp_reward;
    }, "json");
}

NPC.prototype.set_npc = function() {
    var that = this;
    $.ajax({
        url: that.resource_uri,
        type: 'PATCH',
        contentType: 'application/json',
        data: JSON.stringify({ "hit_points": that.hit_points }),
        dataType: 'json',
        processData: false,
        beforeSend: function(jqXHR, settings) {
            jqXHR.setRequestHeader('X-CSRFToken', $('input[name=csrfmiddlewaretoken]').val());
        },
        success: function(data, status, jqXHR) {
            if (that.hit_points > 0) {
                that.is_alive = true;
            } else {
                that.is_alive = false;
            }
        }
    });
}