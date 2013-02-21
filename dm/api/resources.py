from tastypie.resources import ModelResource
from tastypie import fields
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import DjangoAuthorization

from dm.models import (Party, Campaign, Session, HistoryLine, NPCType,
                        NPC, Encounter,EncounterParticipant)

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
        authentication = SessionAuthentication()
        authorization = DjangoAuthorization()


class NPCTypeResource(ModelResource):
    class Meta:
        queryset = NPCType.objects.all()
        resource_name = 'npc_type'


class NPCResource(ModelResource):
    class Meta:
        queryset = NPC.objects.all().select_subclasses()
        resource_name = 'npc'
        authentication = SessionAuthentication()
        authorization = DjangoAuthorization()

    def dehydrate(self, bundle):
        if hasattr(bundle.obj, 'npc_type'):
            bundle.data['name'] = bundle.obj.npc_type.name
            bundle.data['level'] = bundle.obj.npc_type.level
            bundle.data['role'] = bundle.obj.npc_type.pretty_role()
            bundle.data['abilities'] = bundle.obj.get_abilities()
            bundle.data['defenses'] = bundle.obj.get_defenses()
            bundle.data['max_hit_points'] = bundle.obj.npc_type.max_hit_points
            bundle.data['initiative'] = bundle.data['abilities']['dex']['check']
            bundle.data['perception'] = bundle.data['abilities']['wis']['check']

        if hasattr(bundle.obj, 'hit_points'):
            bundle.data['hit_points'] = bundle.obj.hit_points

        return bundle

    def hydrate(self, bundle):
        if hasattr(bundle.obj, 'hit_points'):
            bundle.obj.hit_points = bundle.data['hit_points']
            bundle.obj.save()

        return bundle


class EncounterResource(ModelResource):
    npcs = fields.ToManyField(NPCResource, 'npcs')
    party = fields.ForeignKey(PartyResource, 'party')

    class Meta:
        queryset = Encounter.objects.all()
        resource_name = 'encounter'

    def dehydrate(self, bundle):
        bundle.data['initiative_table'] = {}  # bundle.obj.initiative_order()

        return bundle


class EncounterParticipantResource(ModelResource):
    class Meta:
        queryset = EncounterParticipant.objects.all()
