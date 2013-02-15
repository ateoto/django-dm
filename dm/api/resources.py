from tastypie.resources import ModelResource
from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import DjangoAuthorization

from dm.models import (Party, Campaign, Session, HistoryLine, NPCType, NPC, Encounter)

from character_builder.api.resources import CharacterResource


class PartyResource(ModelResource):
    characters = fields.ToManyField(CharacterResource, 'characters')

    class Meta:
        queryset = Party.objects.all()
        resource_name = 'party'


class CampaignResource(ModelResource):
    class Meta:
        queryset = Campaign.objects.all()
        resource_name = 'campaign'


class SessionResource(ModelResource):
    class Meta:
        queryset = Session.objects.all()
        resource_name = 'session'


class HistoryLineResource(ModelResource):
    class Meta:
        queryset = HistoryLine.objects.all()
        resource_name = 'historyline'


class NPCTypeResource(ModelResource):
    class Meta:
        queryset = NPCType.objects.all()
        resource_name = 'npc_type'


class NPCResource(ModelResource):
    class Meta:
        queryset = NPC.objects.all()
        resource_name = 'npc'
        authentication = SessionAuthentication()
        authorization = DjangoAuthorization()

    def dehydrate(self, bundle):
        real_obj = NPC.objects.get_subclass(id=bundle.obj.id)
        if hasattr(real_obj, 'npc_type'):
            bundle.data['name'] = real_obj.npc_type.name
            bundle.data['level'] = real_obj.npc_type.level
            bundle.data['role'] = real_obj.npc_type.pretty_role()
            bundle.data['abilities'] = real_obj.get_abilities()
            bundle.data['defenses'] = real_obj.get_defenses()
            bundle.data['max_hit_points'] = real_obj.npc_type.max_hit_points
        if hasattr(real_obj, 'hit_points'):
            bundle.data['hit_points'] = real_obj.hit_points

        return bundle


class EncounterResource(ModelResource):
    npcs = fields.ToManyField(NPCResource, 'npcs')

    class Meta:
        queryset = Encounter.objects.all()
        resource_name = 'encounter'

    def dehydrate(self, bundle):
        bundle.data['initiative_table'] = bundle.obj.initiative_order()

        return bundle
