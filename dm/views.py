import logging
log = logging.getLogger(__name__)

from django.shortcuts import render_to_response, get_object_or_404
from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied

from dm.models import Party, Encounter, EncounterParticipant, NPC, NPCType
from dm.forms import NPCTypeForm, NPCStatsForm


@login_required
def encounter(request, encounter_id):
    if not request.user.is_superuser:
        raise PermissionDenied

    response_dict = {}
    encounter = get_object_or_404(Encounter, id=encounter_id)
    response_dict['encounter'] = encounter
    response_dict['party'] = encounter.party

    # TODO: This is not done.
    # I want to grab all the data before the page is loaded to avoid all this AJAX nonsense.

    participants = EncounterParticipant.objects.filter(encounter=encounter).select_subclasses()

    response_dict['pcs'] = []
    response_dict['npcs'] = []

    for participant in participants:
        if hasattr(participant, 'character'):
            response_dict['pcs'].append(participant)
        if hasattr(participant, 'npc'):
            response_dict['npcs'].append(participant)

    EncounterParticipant.objects.filter(encounter=encounter).select_subclasses()

    return render_to_response('dm/encounter.html',
            response_dict,
            context_instance=RequestContext(request))


@login_required
def encounter_test(request, encounter_id):
    if not request.user.is_superuser:
        raise PermissionDenied

    response_dict = {}
    encounter = get_object_or_404(Encounter, id=encounter_id)
    response_dict['encounter'] = encounter
    response_dict['party'] = encounter.party

    # TODO: This is not done.
    # I want to grab all the data before the page is loaded to avoid all this AJAX nonsense.

    participants = EncounterParticipant.objects.filter(encounter=encounter).select_subclasses()

    response_dict['pcs'] = []
    response_dict['npcs'] = []

    for participant in participants:
        if hasattr(participant, 'character'):
            response_dict['pcs'].append(participant)
        if hasattr(participant, 'npc'):
            npc = NPC.objects.get_subclass(id=participant.npc.id)
            response_dict['npcs'].append({'name': npc.npc_type.name })

    EncounterParticipant.objects.filter(encounter=encounter).select_subclasses()

    return render_to_response('dm/encounter_test.html',
            response_dict,
            context_instance=RequestContext(request))


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

    return render_to_response('dm/party.html',
            response_dict,
            context_instance=RequestContext(request))


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

    return render_to_response('dm/npc_builder.html',
            response_dict,
            context_instance=RequestContext(request))
