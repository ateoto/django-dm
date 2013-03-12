from django.db import models
from django.contrib.auth.models import User

from character_builder.models import Character
from .npc import NPC

from model_utils.managers import InheritanceManager


class Party(models.Model):
    name = models.CharField(max_length=100)
    background = models.TextField(blank=True)
    formed_on = models.DateField()
    characters = models.ManyToManyField(Character)

    class Meta:
        app_label = 'dm'

    def __unicode__(self):
        return "%s (est. %s)" % (self.name, self.formed_on)


class Campaign(models.Model):
    title = models.CharField(max_length=100)
    dm = models.ForeignKey(User)
    party = models.ForeignKey(Party)

    class Meta:
        app_label = 'dm'

    def __unicode__(self):
        return "%s: %s" % (self.party.name, self.title)


class Session(models.Model):
    start_time = models.DateTimeField(blank=True)
    end_time = models.DateTimeField(blank=True)
    campaign = models.ForeignKey(Campaign)

    class Meta:
        app_label = 'dm'


class HistoryLine(models.Model):
    session = models.ForeignKey(Session)
    text = models.TextField()
    logged_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'dm'


class EncounterTemplate(models.Model):
    name = models.CharField(max_length=100)
    npcs = models.ManyToManyField(NPC)
    setup = models.TextField(blank=True)
    tactics = models.TextField(blank=True)

    class Meta:
        app_label = 'dm'

    def __unicode__(self):
        return self.name


class Encounter(models.Model):
    template = models.ForeignKey(EncounterTemplate)
    party = models.ForeignKey(Party)
    is_completed = models.BooleanField(default=False)
    notes = models.TextField(blank=True)

    class Meta:
        app_label = 'dm'

    def __unicode__(self):
        return "%s instance for %s" % (self.template.name, self.party.name)

    def save(self, *args, **kwargs):
        super(Encounter, self).save(*args, **kwargs)
        for pc in self.party.characters.all():
            ep, created = PCEncounterParticipant.objects.get_or_create(character=pc, encounter=self)

        for npc in self.template.npcs.all():
            ep, created = NPCEncounterParticipant.objects.get_or_create(npc=npc, encounter=self)

    def get_pc_participants(self):
        response = {}

        for ep in EncounterParticipant.objects.filter(encounter=self).select_subclasses():
            if hasattr(ep, 'character'):
                pc_response = {}
                pc_response['id'] = ep.character.id
                pc_response['name'] = ep.character.name
                pc_response['hp'] = ep.character.hit_points
                pc_response['max_hp'] = ep.character.max_hit_points
                if ep.initiative == 0:
                    pc_response['initiative'] = ep.character.get_abilities()['dex']['modifier_half_level']
                else:
                    pc_response['initiative'] = ep.initiative
                pc_response['hp_percentage'] = ep.character.hp_percentage()

                response[pc_response['id']] = pc_response

        return response

    def get_npc_participants(self):
        response = {}

        for ep in EncounterParticipant.objects.filter(encounter=self).select_subclasses():
            if hasattr(ep, 'npc'):
                npc = NPC.objects.get_subclass(id=ep.npc.id)
                npc_response = {}
                npc_response['id'] = npc.id
                npc_response['name'] = npc.npc_type.name
                npc_response['hp'] = npc.hit_points
                npc_response['max_hp'] = npc.npc_type.max_hit_points
                if ep.initiative == 0:
                    npc_response['initiative'] = npc.get_abilities()['dex']['modifier_half_level']
                else:
                    npc_response['initiative'] = ep.initiative
                npc_response['symbol'] = ep.symbol
                npc_response['hp_percentage'] = npc.hp_percentage()

                response[npc_response['id']] = npc_response

        return response


class EncounterParticipant(models.Model):
    encounter = models.ForeignKey(Encounter)
    initiative = models.IntegerField(default=0)
    symbol = models.CharField(max_length=3, blank=True)
    objects = InheritanceManager()

    class Meta:
        app_label = 'dm'

    def __unicode__(self):
        return EncounterParticipant.objects.get_subclass(id=self.id).__unicode__()


class PCEncounterParticipant(EncounterParticipant):
    character = models.ForeignKey(Character)

    class Meta:
        app_label = 'dm'

    def __unicode__(self):
        return self.character.name


class NPCEncounterParticipant(EncounterParticipant):
    npc = models.ForeignKey(NPC)

    class Meta:
        app_label = 'dm'

    def __unicode__(self):
        npc = NPC.objects.get_subclass(id=self.npc.id)
        return npc.npc_type.name
