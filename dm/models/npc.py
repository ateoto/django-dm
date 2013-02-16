from django.db import models

from character_builder.models import (Race, Vision, Role, Alignment, Ability, Defense)
from model_utils.managers import InheritanceManager

import math


class NPCType(models.Model):
    name = models.CharField(max_length=100)
    race = models.ForeignKey(Race)
    level = models.IntegerField()
    vision = models.ForeignKey(Vision)
    roles = models.ManyToManyField(Role)
    xp_reward = models.IntegerField()
    max_hit_points = models.IntegerField()
    alignment = models.ForeignKey(Alignment, blank=True)

    class Meta:
        app_label = 'dm'

    def __unicode__(self):
        return "%s Level %i %s" % (self.name, self.level, self.pretty_role())

    def pretty_role(self):
        roles = [role.name for role in self.roles.all()]
        role_string = ' '.join(roles)
        if self.is_elite():
            role_string = role_string.replace('Elite', '')
            role_string = "Elite %s" % (role_string)
        if self.is_minion():
            role_string = role_string.replace('Minion', '')
            role_string = "%s Minion" % (role_string)
        if self.is_leader():
            role_string = role_string.replace('Leader', '')
            role_string = "%s (Leader)" % (role_string)

        return role_string

    def is_elite(self):
        elite = Role.objects.get(name='Elite')
        return elite in self.roles.all()

    def is_minion(self):
        minion = Role.objects.get(name='Minion')
        return minion in self.roles.all()

    def is_leader(self):
        leader = Role.objects.get(name='Leader')
        return leader in self.roles.all()


class NPCTypeAbility(models.Model):
    npc_type = models.ForeignKey(NPCType, related_name="abilities")
    ability = models.ForeignKey(Ability)
    value = models.IntegerField()

    class Meta:
        app_label = 'dm'
        verbose_name_plural = "NPC Type Abilities"

    def __unicode__(self):
        return "%s: %s %s" % (self.npc_type.name, self.ability.name, self.value)

    def modifier(self):
        return int(math.floor((math.fabs(self.value) - 10) / 2))

    def modifier_half_level(self):
        return self.modifier() + int(math.floor(self.npc_type.level / 2))

    def check(self):
        check = self.modifier_half_level()

        if check > 0:
            mod = "+"
        else:
            mod = ""

        return "%s%s" % (mod, check)


class NPCTypeDefense(models.Model):
    npc_type = models.ForeignKey(NPCType, related_name='defenses')
    defense = models.ForeignKey(Defense)
    value = models.IntegerField()

    class Meta:
        app_label = 'dm'

    def __unicode__(self):
        return "%s %s %s" % (self.npc_type.name, self.defense.name, self.value)


class NPC(models.Model):
    objects = InheritanceManager()

    class Meta:
        app_label = 'dm'

    def __unicode__(self):
        return NPC.objects.get_subclass(id=self.id).__unicode__()

    def get_abilities(self):
        response = {}
        npc = NPC.objects.get_subclass(id=self.id)
        if hasattr(npc, 'npc_type'):
            for ability in NPCTypeAbility.objects.filter(npc_type=npc.npc_type):
                response[ability.ability.abbreviation.lower()] = {
                    'name': ability.ability.name,
                    'score': ability.value,
                    'modifier_half_level': ability.modifier_half_level(),
                    'check': ability.check()
                }

        return response

    def get_defenses(self):
        response = {}
        npc = NPC.objects.get_subclass(id=self.id)
        if hasattr(npc, 'npc_type'):
            for defense in NPCTypeDefense.objects.filter(npc_type=npc.npc_type):
                response[defense.defense.abbreviation.lower()] = {
                    'name': defense.defense.name,
                    'total': defense.value,
                }

        return response


class MonsterNPC(NPC):
    npc_type = models.ForeignKey(NPCType)
    hit_points = models.IntegerField()

    class Meta:
        app_label = 'dm'

    def __unicode__(self):
        return "%s <instance id: %i>" % (self.npc_type.name, self.id)


class BasicStoryNPC(NPC):
    name = models.CharField(max_length=100)
    description = models.TextField()

    class Meta:
        app_label = 'dm'

    def __unicode__(self):
        return "%s (BasicStory NPC)" % (self.name)


class StoryNPC(BasicStoryNPC):
    npc_type = models.ForeignKey(NPCType)
    hit_points = models.IntegerField()

    class Meta:
        app_label = 'dm'

    def __unicode__(self):
        return "%s (Story NPC)" % (self.name)
