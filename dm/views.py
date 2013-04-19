import logging
log = logging.getLogger(__name__)

from django.shortcuts import render_to_response, get_object_or_404
from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied

from character_builder.models import Ability, Defense
from dm.models import Campaign, Party, Encounter, NPCType, NPCTypeAbility, NPCTypeDefense
from dm.forms import NPCTypeForm, NPCStatsForm, NPCTypePowerForm


@login_required
def home(request):
    response_dict = {}
    response_dict['campaigns'] = Campaign.objects.filter(dm=request.user)

    return render_to_response(
        'dm/home.html',
        response_dict,
        context_instance=RequestContext(request)
    )


@login_required
def encounter(request, encounter_id):
    response_dict = {}
    encounter = get_object_or_404(Encounter, id=encounter_id)
    if encounter.campaign.dm != request.user:
        raise PermissionDenied

    response_dict['encounter'] = encounter
    response_dict['party'] = encounter.campaign.party
    response_dict['pcs'] = encounter.get_pc_participants()
    response_dict['npcs'] = encounter.get_npc_participants()

    return render_to_response(
        'dm/encounter.html',
        response_dict,
        context_instance=RequestContext(request)
    )


@login_required
def encounter_builder(request):
    pass


@login_required
def party(request, party_id):
    response_dict = {}

    party = get_object_or_404(Party, id=party_id)
    if not request.user.is_superuser:
        raise PermissionDenied

    response_dict['party'] = party
    response_dict['encounter'] = Encounter.objects.get(id=1)

    return render_to_response(
        'dm/party.html',
        response_dict,
        context_instance=RequestContext(request)
    )


@login_required
def campaign(request, campaign_id):
    response_dict = {}

    campaign = get_object_or_404(Campaign, id=campaign_id)
    response_dict['campaign'] = campaign
    response_dict['encounters'] = Encounter.objects.filter(campaign=campaign)

    return render_to_response(
        'dm/campaign.html',
        response_dict,
        context_instance=RequestContext(request)
    )


@login_required
def npc_builder(request):
    if request.method == "POST":
        npc_form = NPCTypeForm(request.POST)
        npc_stats_form = NPCStatsForm(request.POST)
        npc_power_form = NPCTypePowerForm(request.POST)
        if npc_form.is_valid() and npc_stats_form.is_valid():
            npc = NPCType()
            npc.name = npc_form.cleaned_data['name']
            npc.race = npc_form.cleaned_data['race']
            npc.level = npc_form.cleaned_data['level']
            npc.vision = npc_form.cleaned_data['vision']
            npc.xp_reward = npc_form.cleaned_data['xp_reward']
            npc.max_hit_points = npc_form.cleaned_data['max_hit_points']
            npc.alignment = npc_form.cleaned_data['alignment']
            npc.save()
            for role in npc_form.cleaned_data['roles']:
                npc.roles.add(role)

            for defense in Defense.objects.all():
                value = npc_stats_form.cleaned_data[defense.abbreviation.lower()]
                npcd, created = NPCTypeDefense.objects.get_or_create(npc_type=npc,
                                                                    defense=defense,
                                                                    defaults={'value': value})
                npcd.value = value
                npcd.save()

            for ability in Ability.objects.all():
                value = npc_stats_form.cleaned_data[ability.name.lower()]
                npca, created = NPCTypeAbility.objects.get_or_create(npc_type=npc,
                                                                    ability=ability,
                                                                    defaults={'value': value})
                npca.value = value
                npca.save()

    response_dict = {}
    response_dict['npc_form'] = NPCTypeForm()
    response_dict['npc_stats_form'] = NPCStatsForm()
    response_dict['npc_power_form'] = NPCTypePowerForm()

    return render_to_response(
        'dm/npc_builder_powers.html',
        response_dict,
        context_instance=RequestContext(request)
    )
