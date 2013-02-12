from django.conf.urls import patterns, url, include
#from django.views.generic.base import TemplateView
from dm.api import v1

urlpatterns = patterns('',
    #url(r'^$', TemplateView.as_view(template_name = 'dm/home.html')),
    url(r'^party/(?P<party_id>\d+)/$', 'dm.views.party', name='dm-party'),
    url(r'^api/', include(v1.urls)),
)
