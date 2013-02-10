from tastypie.resources import ModelResource
from tastypie import fields
from dm.models import (Party, Campaign, Session, HistoryLine)


class PartyResource(ModelResource):
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
