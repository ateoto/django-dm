from tastypie.api import Api

from .resources import (PartyResource, CampaignResource,
                        SessionResource, HistoryLineResource,
                        NPCResource, EncounterResource,
                        EncounterInitiativeResource)

v1 = Api(api_name='v1')

v1.register(PartyResource())
v1.register(CampaignResource())
v1.register(SessionResource())
v1.register(HistoryLineResource())
v1.register(NPCResource())
v1.register(EncounterResource())
v1.register(EncounterInitiativeResource())
