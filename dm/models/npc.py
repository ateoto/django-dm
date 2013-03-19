from django.db import models

from character_builder.models import (Race, Vision, Role, Alignment,
                                    Ability, Defense, Condition, Skill,
                                    PowerRange, ActionType, PowerKeyword,
                                    PowerUsage)

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
        role_string = ' '.join([role.name for role in self.roles.all()])
        if self.is_elite():
            role_string = role_string.replace('Elite', '')
            role_string = "Elite %s" % (role_string)
        if self.is_minion():
            role_string = role_string.replace('Minion', '')
            role_string = "%s Minion" % (role_string)
        if self.is_leader():
            role_string = role_string.replace('Leader', '')
            role_string = "%s (Leader)" % (role_string)

        return role_string.strip()

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


class NPCTypeSkill(models.Model):
    npc_type = models.ForeignKey(NPCType, related_name='skills')
    skill = models.ForeignKey(Skill)
    value = models.IntegerField()

    class Meta:
        app_label = 'dm'

    def __unicode__(self):
        return "%s %s %s" % (self.npc_type.name, self.skill.name, self.value)


class NPCTypePower(models.Model):
    npc_type = models.ForeignKey(NPCType, related_name='powers')
    name = models.CharField(max_length=100)
    attack_type = models.ForeignKey(PowerRange, blank=True, null=True)
    action_type = models.ForeignKey(ActionType, blank=True, null=True)
    keywords = models.ManyToManyField(PowerKeyword, blank=True, null=True)
    recharge_text = models.CharField(max_length=20, blank=True)
    usage = models.ForeignKey(PowerUsage, blank=True, null=True)
    description = models.TextField(blank=True)

    class Meta:
        app_label = 'dm'

    def __unicode__(self):
        return self.name

    def pretty_action_line(self):
        action_line_list = []

        if self.action_type is not None:
            action_line_list.append(self.action_type.name)

        if self.usage is not None:
            action_line_list.append(self.usage.name)

        if self.recharge_text != '':
            action_line_list.append(self.recharge_text)

        if len(action_line_list) >= 1:
            action_line = '; '.join(action_line_list)
            action_line = "(%s)" % (action_line)
        else:
            action_line = ''

        return action_line

    def pretty_keywords(self):
        if self.keywords.exists():
            return ', '.join([kw.name for kw in self.keywords.all()])
        else:
            return ''


class NPCTypeEquipment(models.Model):
    pass


class NPC(models.Model):
    objects = InheritanceManager()
    is_alive = models.BooleanField(default=True)
    conditions = models.ManyToManyField(Condition, blank=True)

    class Meta:
        app_label = 'dm'

    def __unicode__(self):
        return NPC.objects.get_subclass(id=self.id).__unicode__()

    def save(self, *args, **kwargs):
        if self.id:
            npc = NPC.objects.get_subclass(id=self.id)
            if hasattr(npc, 'hit_points'):
                if self.hit_points <= 0:
                    self.is_alive = False
                else:
                    self.is_alive = True

        super(NPC, self).save(*args, **kwargs)

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

    def get_powers(self):
        response = []
        npc = NPC.objects.get_subclass(id=self.id)
        if hasattr(npc, 'npc_type'):
            for power in NPCTypePower.objects.filter(npc_type=npc.npc_type):
                response.append({'name': power.name,
                                'keywords': power.pretty_keywords(),
                                'action_line': power.pretty_action_line(),
                                'description': power.description})

        return response

    def hp_percentage(self):
        npc = NPC.objects.get_subclass(id=self.id)
        if hasattr(npc, 'npc_type'):
            return "%i%%" % (int(float(self.hit_points) / float(self.npc_type.max_hit_points) * 100))
        else:
            return "100%"


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
