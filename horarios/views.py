from django.shortcuts import get_object_or_404, render
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.views import generic
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

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

    from django.http import HttpResponse, Http404

    if request.method != 'GET':
        raise Http404
    import facades
    a = facades.getSubjectsByName("Algoritmos","PRE")[0]
    b = facades.getSubjectsByName("Seguridad en redes","PRE")[0]
    c = facades.getSubjectsByName("Lenguajes de programacion","PRE")[0]

    s = [a.code,b.code,c.code]

    s = facades.getSchedules(s)

    from serializers import ScheduleSerializer
    serializer = ScheduleSerializer()
    return HttpResponse(serializer.serialize(s[0]), content_type='application/json')

@csrf_exempt
def autocomplete_subject(request):
    """
    :param request: JSON with a name parameter
    """
    import simplejson

    from django.http import HttpResponse, Http404

    if request.method != 'POST':
        raise Http404

    request_data = simplejson.loads(request.body)
    if "name" in request_data:
        data = request_data["name"]
        import facades
        subjects = facades.autocomplete(data)
    
    from serializers import SimpleSubjectsSerializer
    serializer = SimpleSubjectsSerializer()

    return HttpResponse(serializer.serialize(subjects), content_type='application/json')



class RandomScheduleView(APIView):
    def get(self, request, *args, **kw):
        import facades
        a = facades.getSubjectsByName("Algoritmos","PRE")[0]
        b = facades.getSubjectsByName("Seguridad en redes","PRE")[0]
        c = facades.getSubjectsByName("Lenguajes de programacion","PRE")[0]

        s = [a.code,b.code,c.code]

        s = facades.getSchedules(s)

        from serializers import ScheduleSerializer
        serializer = ScheduleSerializer()
        return Response(serializer.serialize(s), status = status.HTTP_200_OK)

class SubjectAutocompleteView(APIView):
    def get(self, request, *args , **kw):
        name = kw['name']
        import facades
        subjects = facades.autocomplete(name)
        from serializers import SimpleSubjectsSerializer
        serializer = SimpleSubjectsSerializer()
        return Response(serializer.serialize(subjects), status = status.HTTP_200_OK)
