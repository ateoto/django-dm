function Encounter(resource_uri) {
    this.resource_uri = resource_uri;
    this.participant_table = {
        pcs: {},
        npcs: {}
    };
}

Encounter.prototype.get_encounter = function() {
    var that = this;
    var jqxhr = $.get(that.resource_uri, '',
        function(data, textStatus, jqXHR) {
            that.setup = data.setup;
            that.tactics = data.tactics;
            that.pcs = data.pcs;
            that.npcs = data.npcs;
            that.notes = data.notes;
            _.each(that.pcs, function(pc) {
                var character = new Character('/DnD/api/v1/character/' + pc.id + '/');
                character.get_character();
                pc.character = character;
            });
            _.each(that.npcs, function(npc) {
                var npci = new NPC('/dm/api/v1/npc/' + npc.id + '/');
                npci.get_npc();
                npc.npc = npci;
            });
    }, "json");
}

Encounter.prototype.damage_pc = function(pcid, damage) {
    this.pcs[pcid].hp = this.pcs[pcid].hp - damage;
    this.pcs[pcid].character.hit_points = this.pcs[pcid].hp;
    this.pcs[pcid].character.set_character();
}

Encounter.prototype.heal_pc = function(pcid, health) {
    this.pcs[pcid].hp = this.pcs[pcid].hp + health;
    this.pcs[pcid].character.hit_points = this.pcs[pcid].hp;
    this.pcs[pcid].character.set_character();
}

Encounter.prototype.set_init_pc = function(pcid, init) {
    this.pcs[pcid].initiative = init;
    this.save_pc(pcid);
}

Encounter.prototype.give_xp_pc = function(pcid, xp) {
    this.pcs[pcid].character.xp = this.pcs[pcid].character.xp + xp;
    this.pcs[pcid].character.set_character();
}

Encounter.prototype.save_pc = function(pcid) {
    var that = this;
    $.ajax({
        url: '/dm/api/v1/encounter_participant/' + that.pcs[pcid].ep_id + '/',
        type: 'PATCH',
        contentType: 'application/json',
        data: JSON.stringify({ initiative: that.pcs[pcid].initiative }),
        dataType: 'json',
        processData: false,
        beforeSend: function(jqXHR, settings) {
            jqXHR.setRequestHeader('X-CSRFToken', $('input[name=csrfmiddlewaretoken]').val());
        },
    });
}

Encounter.prototype.damage_npc = function(npcid, damage) {
    this.npcs[npcid].hp = this.npcs[npcid].hp - damage;
    this.npcs[npcid].npc.hit_points = this.npcs[npcid].hp;
    this.npcs[npcid].npc.set_npc();
}

Encounter.prototype.heal_npc = function(npcid, health) {
    this.npcs[npcid].hp = this.npcs[npcid].hp + health;
    this.npcs[npcid].npc.hit_points = this.npcs[npcid].hp;
    this.npcs[npcid].npc.set_npc();
}

Encounter.prototype.set_init_npc = function(npcid, init) {
    this.npcs[npcid].initiative = init;
    this.save_npc(npcid);
}

Encounter.prototype.set_symbol_npc = function(npcid, symbol) {
    this.npcs[npcid].symbol = symbol;
    this.save_npc(npcid);
}

Encounter.prototype.save_npc = function(npcid) {
    var that = this;
    $.ajax({
        url: '/dm/api/v1/encounter_participant/' + that.npcs[npcid].ep_id + '/',
        type: 'PATCH',
        contentType: 'application/json',
        data: JSON.stringify({
            initiative: that.npcs[npcid].initiative,
            symbol: that.npcs[npcid].symbol }),
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
