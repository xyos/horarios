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


@csrf_exempt
def random_schedules(request):
    """
    Random schedule generator
    :param request: JSON encoded payload sent by github.
    """
    import simplejson

    from django.http import HttpResponse, Http404

    if request.method != 'GET':
        raise Http404

    from Helpers import SIA,Generator
    sia = SIA()
    a = sia.getSubject("Algoritmos","PRE")
    b = sia.getSubject("Seguridad en redes","PRE")
    c = sia.getSubject("Lenguajes de programacion","PRE")

    #Generating simple scheudles first will fasten the algorithm
    s = [a,b,c]
    s = sorted(s, lambda x,y: 1 if len(x.groups)>len(y.groups) else -1 if len(x.groups)<len(y.groups) else 0)

    gen = Generator()
    s = gen.generateSchedule(s)

    from serializers import ScheduleSerializer
    serializer = ScheduleSerializer()
    out_json = serializer.serialize(s[0])

    return HttpResponse(out_json, content_type='application/json')
