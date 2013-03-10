from django.contrib import admin
from dm.models import (Party, Campaign, Session, HistoryLine, NPCType,
                        NPCTypeAbility, NPCTypeDefense, MonsterNPC,
                        EncounterTemplate, Encounter, NPCTypePower,
                        NPCEncounterParticipant)


admin.site.register(Party)
admin.site.register(Campaign)
admin.site.register(Session)
admin.site.register(HistoryLine)
admin.site.register(NPCType)
admin.site.register(NPCTypeAbility)
admin.site.register(NPCTypeDefense)
admin.site.register(MonsterNPC)
admin.site.register(EncounterTemplate)
admin.site.register(Encounter)
admin.site.register(NPCTypePower)
admin.site.register(NPCEncounterParticipant)
