from django.contrib import admin
from dm.models import (Party, Campaign, Session, HistoryLine)


admin.site.register(Party)
admin.site.register(Campaign)
admin.site.register(Session)
admin.site.register(HistoryLine)
