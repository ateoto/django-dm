from django.contrib import admin
from dm.models import (Party, Campaign, Session, HistoryLine, NPCType,
						NPCTypeAbility, NPCTypeDefense)


admin.site.register(Party)
admin.site.register(Campaign)
admin.site.register(Session)
admin.site.register(HistoryLine)
admin.site.register(NPCType)
admin.site.register(NPCTypeAbility)
admin.site.register(NPCTypeDefense)
