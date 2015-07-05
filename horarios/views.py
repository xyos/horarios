from django.shortcuts import get_object_or_404, render
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.views import generic
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from horarios.serializers import SessionSerializer, SubjectSimpleSerializer, SubjectSerializer, GroupSerializer, ProfessionSerializer
from horarios.models import Session, Subject, Group, Profession
from rest_framework import generics
from rest_framework.permissions import IsAdminUser, AllowAny

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
    import json
    import subprocess

    from django.http import HttpResponse, Http404
    from django.conf import settings

    if request.method != 'POST':
        raise Http404

    if not 'payload' in request.POST.keys():
        raise Http404

    payload = json.loads(request.POST['payload'])

    out_json = {'status':'failed'}

    if payload['ref'] == 'refs/heads/master':
        DEPLOY_SCRIPT = getattr(settings,"DEPLOY_SCRIPT", "pwd")
        out = subprocess.check_output(settings.DEPLOY_SCRIPT)
        if not getattr(settings,"DEBUG",False):
            out = ""
        out_json = {'status' : 'success', 'output' : out }

    return HttpResponse(json.dumps(out_json), content_type='application/json')

class SubjectProfessionAutocompleteView(APIView):
    def get(self, request, *args , **kw):
        import json
        search_term = kw['search_term']
        try:
            profession  = int(kw['profession'])
        except:
            profession = ""
        try:
            subject_type = json.loads(kw['subject_type'])
        except:
            subject_type = []
        queryset = Subject.autocomplete(search_term,profession,subject_type)
        print queryset
        serializer = SubjectSimpleSerializer(queryset, many=True)
        return Response(serializer.data)

class SessionList(generics.ListCreateAPIView):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer

class SessionDetail(generics.RetrieveUpdateAPIView):
    permission_classes = (AllowAny,)
    queryset = Session.objects.all()
    serializer_class = SessionSerializer

class SubjectList(generics.ListAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = (IsAdminUser,)

class SubjectDetail(generics.RetrieveAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    
class ProfessionList(generics.ListAPIView):
    queryset = Profession.objects.all()
    serializer_class = ProfessionSerializer