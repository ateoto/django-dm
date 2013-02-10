from tastypie.api import Api

from .resources import (PartyResource, CampaignResource,
						SessionResource, HistoryLineResource)

v1 = Api(api_name='v1')

v1.register(PartyResource())
v1.register(CampaignResource())
v1.register(SessionResource())
v1.register(HistoryLineResource())
