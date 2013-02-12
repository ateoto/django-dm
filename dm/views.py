import logging
log = logging.getLogger(__name__)

from django.shortcuts import render_to_response, get_object_or_404
from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied

from dm.models import Party


@login_required
def party(request, party_id):
    response_dict = {}

    party = get_object_or_404(Party, id=party_id)
    if not request.user.is_superuser:
        raise PermissionDenied

    response_dict['party'] = party

    return render_to_response('dm/party.html',
            response_dict,
            context_instance=RequestContext(request))
