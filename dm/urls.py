from django.conf.urls import patterns, url, include
#from django.views.generic.base import TemplateView
from dm.api import v1

urlpatterns = patterns('',
    #url(r'^$', TemplateView.as_view(template_name = 'dm/home.html')),
    url(r'^playground/(?P<party_id>\d+)/$', 'dm.views.playground', name='dm-playground'),
    url(r'^api/', include(v1.urls)),
)