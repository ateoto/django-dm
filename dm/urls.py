from django.conf.urls import patterns, url, include
from dm.api import v1

urlpatterns = patterns('',
    url(r'^party/(?P<party_id>\d+)/$', 'dm.views.party', name='dm-party'),
    url(r'^npc/$', 'dm.views.npc', name='dm-npc'),
    url(r'^api/', include(v1.urls)),
)
