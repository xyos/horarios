import json
import urllib2
from BO import Subject,Group,Schedule
siaBogotaUrl="http://www.sia.unal.edu.co/buscador"
siaMedellinUrl="http://sia1.medellin.unal.edu.co:9401/buscador"
siaUrl=siaBogotaUrl
import models as djangoModels
import SiaDaos

class SIA:

    subjects_cache = {}
    groups_cache = {}

    def existsSubject(this,name,level):
        return this.queryNumSubjectsWithName(name,level)>0

    def queryNumSubjectsWithName(this,name,level):
        data = json.dumps({"method": "buscador.obtenerAsignaturas", "params": [name, level, "", level, "", "", 1, 1]})
        req = urllib2.Request(siaUrl + "/JSON-RPC", data, {'Content-Type': 'application/json'})
        f = urllib2.urlopen(req)
        result = json.loads(f.read())["result"]["totalAsignaturas"]
        f.close()
        return result

    def querySubjectsByName(this,name,level,maxRetrieve):
        if not (name in this.subjects_cache):
            data = json.dumps({"method": "buscador.obtenerAsignaturas", "params": [name, level, "", level, "", "", 1, maxRetrieve]})
            req = urllib2.Request(siaUrl + "/JSON-RPC", data, {'Content-Type': 'application/json'})
            f = urllib2.urlopen(req)
            result=json.loads(f.read())
            f.close()
            this.subjects_cache[name] = result["result"]["asignaturas"]["list"]

        return this.subjects_cache[name]

    def queryGroupsBySubjectCode(this,code):
        if not (code in this.groups_cache):
            data = json.dumps({"method": "buscador.obtenerGruposAsignaturas", "params": [code, "0"]})
            req = urllib2.Request(siaUrl + "/JSON-RPC", data, {'Content-Type': 'application/json'})
            f = urllib2.urlopen(req)
            result=json.loads(f.read())
            f.close()
            this.groups_cache[code] = result["result"]["list"]
        return this.groups_cache[code]

class Generator:
    
    def generateSchedulesFromSubjects(self,listOfSubjects):
        groups = []
        for s in listOfSubjects:
            groups.append(s.groups)
        self.generateSchedule(groups)

    def generateSchedule(self,listOfListOfGroups,busy=None):
        result = []
        if(len(listOfListOfGroups) == 1):
            for g in listOfListOfGroups[0]:
                result.append(Schedule(busy,g))
            return result

        listOfGroups = listOfListOfGroups.pop()
        subSchedules = self.generateSchedule(listOfListOfGroups,busy)
        for group in listOfGroups:
            for schedule in subSchedules:
                if(schedule._isCompatible(group)):
                    result.append(schedule.clone().addGroup(group))

        if(len(result) == 0):
            raise Exception("No schedule can be generated" )
        return result


class DatabaseCreator:
    def __init__(self,sia):
        self.sia = sia

    def getSubjects(self,letters):

        def createSubject(subject,groups):
            print "Processing ", subject.name.encode('ascii','ignore')
            try:
                djangoModels.Subject.objects.get(name__exact=subject.name)
                s = djangoModels.Subject.objects.create(name=subject.name,code=subject.code,credits=subject.credits)
                for i in groups:
                    t,creted = djangoModels.Teacher.objects.get_or_create(name=i.teacher)
                    g = djangoModels.Group.objects.create(teacher=t,subject=s,code=i.code,schedule=i.schedule)
            except Exception:
                print "Skipping already processed ", subject.name.encode('ascii','ignore')

        dao = SiaDaos.SubjectDao(self.sia)
        gDao = SiaDaos.GroupDao(self.sia)
        for j in letters:
            print "Synchronizing letter",j
            for i in dao.getSubjectsByName(j,"",1000000):
                createSubject(i,gDao.getGroupsBySubjectCode(i.code))

def syncsia(request):
    c = DatabaseCreator(SIA())
    c.getSubjects("abcdefghijklmnopqrstuvwxyz")
    from django.http import HttpResponse
    return HttpResponse(["abcdefghijklmnopqrstuvwxyz"], content_type='application/json')
