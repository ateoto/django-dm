from django.conf.urls import patterns, url, include
from dm.api import v1

urlpatterns = patterns('',
    url(r'^party/(?P<party_id>\d+)/$', 'dm.views.party', name='dm-party'),
    url(r'^encounter/(?P<encounter_id>\d+)/$', 'dm.views.encounter', name='dm-encounter'),
    url(r'^encounter/large/(?P<encounter_id>\d+)/$', 'dm.views.encounter_wm', name='dm-encounter-wm'),
    url(r'^build/encounter/$', 'dm.views.encounter_builder', name='dm-encounter-builder'),
    url(r'^build/npc/$', 'dm.views.npc_builder', name='dm-npc-builder'),
    url(r'^api/', include(v1.urls)),
)
