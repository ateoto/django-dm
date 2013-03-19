import logging
log = logging.getLogger(__name__)

from django.shortcuts import render_to_response, get_object_or_404
from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied

from dm.models import Campaign, Party, Encounter
from dm.forms import NPCTypeForm, NPCStatsForm


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
        if npc_form.is_valid() and npc_stats_form.is_valid():
            return HttpResponse('Cool.')

    response_dict = {}
    response_dict['npc_form'] = NPCTypeForm()
    response_dict['npc_stats_form'] = NPCStatsForm()

    return render_to_response(
        'dm/npc_builder.html',
        response_dict,
        context_instance=RequestContext(request)
    )
