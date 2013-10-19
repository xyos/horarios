from django.shortcuts import get_object_or_404, render
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.views import generic
from django.views.decorators.csrf import csrf_exempt

def home(request):
    """
    this will render the home page
    :param request:
    :return: home page of the project
    """
    return render(request, 'home.html')

@csrf_exempt
def do_deploy(request):
    """
    deploys on the server after github sends a POST-Receive hook.
    This is initiated by a push on the master branch on github.
    :param request: JSON encoded payload sent by github.
    """
    import simplejson
    import subprocess

    from django.http import HttpResponse, Http404
    from django.conf import settings

    if request.method != 'POST':
        raise Http404

    if not 'payload' in request.POST.keys():
        raise Http404

    payload = simplejson.loads(request.POST['payload'])

    out_json = {'status':'failed'}

    if payload['ref'] == 'refs/heads/master':
        DEPLOY_SCRIPT = getattr(settings,"DEPLOY_SCRIPT", "echo 0")
        subprocess.call(settings.DEPLOY_SCRIPT)
        out_json = {'status' : 'success'}

    return HttpResponse(simplejson.dumps(out_json), content_type='application/json')


