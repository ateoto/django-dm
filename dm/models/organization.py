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

    class Meta:
        app_label = 'dm'

    def __unicode__(self):
        return self.name


class Encounter(EncounterTemplate):
    party = models.ForeignKey(Party)

    class Meta:
        app_label = 'dm'

    def __unicode__(self):
        return "%s instance for %s" % (self.name, self.party.name)

    def from_template(self, encounter_template):
        self = encounter_template
        self.pk = None
        self.id = None
        self.save()
        self.npcs = encounter_template.npcs.all()
        self.save()

    def initiative_order(self):
        init_table = []
        for ei in EncounterParticipant.objects.filter(encounter=self):
            ei.participant = EncounterParticipant.objects.get_subclass(id=ei.participant.id)
            if hasattr(ei.participant, 'character'):
                participant_type = 'pc'
            else:
                participant_type = 'npc'

            init_table.append({
                        'initiative': ei.initiative,
                        'type': participant_type,
                        'id': ei.participant.id
            })

        return sorted(init_table, key=lambda k: k['initiative'])


class EncounterParticipant(models.Model):
    encounter = models.ForeignKey(Encounter)
    initiative = models.IntegerField(default=0)
    symbol = models.CharField(max_length=3, blank=True)
    objects = InheritanceManager()

    class Meta:
        app_label = 'dm'

    def __unicode__(self):
        return EncounterParticipant.objects.get_subclass(id=self.id).__unicode__


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
        return 'NPC Name Coming Soon'
