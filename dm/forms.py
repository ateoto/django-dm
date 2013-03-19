from django import forms
from django.forms import ModelForm
from dm.models import NPCType, NPCTypePower

from crispy_forms.helper import FormHelper


class NPCTypeForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(NPCTypeForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper(self)
        self.helper.form_tag = False
        self.helper.form_id = "npctype-form"

    class Meta:
        model = NPCType


class NPCTypePowerForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(NPCTypePowerForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper(self)
        self.helper.form_tag = False

    class Meta:
        model = NPCTypePower


class NPCStatsForm(forms.Form):
    ac = forms.IntegerField(label="Armor Class")
    fort = forms.IntegerField(label="Fortitude")
    ref = forms.IntegerField(label="Reflex")
    will = forms.IntegerField(label="Will")
    strength = forms.IntegerField()
    constitution = forms.IntegerField()
    dexterity = forms.IntegerField()
    intelligence = forms.IntegerField()
    wisdom = forms.IntegerField()
    charisma = forms.IntegerField()

    def __init__(self, *args, **kwargs):
        super(NPCStatsForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper(self)
        self.helper.form_tag = False
        self.helper.form_id = "npc-stats-form"
