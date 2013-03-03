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
            bundle.data['speed'] = bundle.obj.npc_type.race.speed
            bundle.data['xp_reward'] = bundle.obj.npc_type.xp_reward
            bundle.data['abilities'] = bundle.obj.get_abilities()
            bundle.data['defenses'] = bundle.obj.get_defenses()
            bundle.data['max_hit_points'] = bundle.obj.npc_type.max_hit_points
            bundle.data['initiative'] = bundle.data['abilities']['dex']['check']
            bundle.data['perception'] = bundle.data['abilities']['wis']['check']
            bundle.data['powers'] = bundle.obj.get_powers()

        if hasattr(bundle.obj, 'hit_points'):
            bundle.data['hit_points'] = bundle.obj.hit_points

        return bundle

    def hydrate(self, bundle):
        if hasattr(bundle.obj, 'hit_points'):
            bundle.obj.hit_points = bundle.data['hit_points']
            bundle.obj.save()

        return bundle


class EncounterResource(ModelResource):
    class Meta:
        queryset = Encounter.objects.all()
        resource_name = 'encounter'
        authentication = SessionAuthentication()
        authorization = DjangoAuthorization()

    def dehydrate(self, bundle):
        # TODO: Reverse URI possible?
        bundle.data['npcs'] = ['/dm/api/v1/npc/%i/' % (npc.id) for npc in bundle.obj.template.npcs.all()]
        bundle.data['pcs'] = ['/DnD/api/v1/character/%i/' % (pc.id) for pc in bundle.obj.party.characters.all()]
        bundle.data['setup'] = bundle.obj.template.setup
        bundle.data['tactics'] = bundle.obj.template.tactics

        return bundle


class EncounterParticipantResource(ModelResource):
    encounter = fields.ForeignKey(EncounterResource, 'encounter')

    class Meta:
        queryset = EncounterParticipant.objects.all().select_subclasses()
        filtering = {
            'encounter': ('exact')
        }
        resource_name = 'encounter_participant'
        authentication = SessionAuthentication()
        authorization = DjangoAuthorization()

    def dehydrate(self, bundle):
        if hasattr(bundle.obj, 'character'):
            bundle.data['pc_id'] = bundle.obj.character.id
            bundle.data['is_pc'] = True
        if hasattr(bundle.obj, 'npc'):
            bundle.data['npc_id'] = bundle.obj.npc.id
            bundle.data['is_pc'] = False

        return bundle
