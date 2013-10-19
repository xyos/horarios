from django.shortcuts import get_object_or_404, render
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.views import generic
from django.views.decorators.csrf import csrf_exempt

def home(request):
    return render(request, 'home.html')

@csrf_exempt
def do_deploy(request):
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


