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


class Encounter(models.Model):
    name = models.CharField(max_length=100)
    npcs = models.ManyToManyField(NPC)

    class Meta:
        app_label = 'dm'

    def __unicode__(self):
        return self.name

    def initiative_order(self):
        init_table = []
        for ei in EncounterInitiative.objects.filter(encounter=self):
            ei.participant = EncounterParticipant.get_subclass(id=ei.participant.id)
            if hasattr(ei.participant, 'character'):
                participant_type = 'pc'
            else:
                participant_type = 'npc'

            ei.append({
                        'initiative': ei.initiative,
                        'type': participant_type,
                        'id': ei.participant.id
            })

        return sorted(init_table, key=lambda k: k['initiative'])


class EncounterParticipant(models.Model):
    objects = InheritanceManager()

    class Meta:
        app_label = 'dm'


class PCEncounterParticipant(EncounterParticipant):
    character = models.ForeignKey(Character)

    class Meta:
        app_label = 'dm'


class NPCEncounterParticipant(EncounterParticipant):
    npc = models.ForeignKey(NPC)

    class Meta:
        app_label = 'dm'


class EncounterInitiative(models.Model):
    encounter = models.ForeignKey(Encounter)
    participant = models.ForeignKey(EncounterParticipant)
    initiative = models.IntegerField()

    class Meta:
        app_label = 'dm'
