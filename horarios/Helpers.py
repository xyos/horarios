import json
import urllib2
from BO import Subject,Group,Schedule
siaBogotaUrl="http://www.sia.unal.edu.co/buscador"
siaMedellinUrl="http://sia1.medellin.unal.edu.co:9401/buscador"
siaUrl=siaBogotaUrl
import models as djangoModels
import SiaDaos

class SIA:

    from beaker.cache import CacheManager
    from beaker.util import parse_cache_config_options

    cache = CacheManager(**parse_cache_config_options({
        'cache.type': 'file',
        'cache.data_dir': '/tmp/horariossiacache/data',
        'cache.lock_dir': '/tmp/horariossiacache/lock'
    }))

    def existsSubject(this,name,level):
        return this.queryNumSubjectsWithName(name,level)>0

    def queryNumSubjectsWithName(this,name,level):
        data = json.dumps({"method": "buscador.obtenerAsignaturas", "params": [name, level, "", level, "", "", 1, 1]})
        req = urllib2.Request(siaUrl + "/JSON-RPC", data, {'Content-Type': 'application/json'})
        f = urllib2.urlopen(req)
        result = json.loads(f.read())["result"]["totalAsignaturas"]
        f.close()
        return result

    @cache.cache(expire=60*60*24)
    def querySubjectsByName(this,name,level,maxRetrieve):
        data = json.dumps({"method": "buscador.obtenerAsignaturas", "params": [name, level, "", level, "", "", 1, maxRetrieve]})
        req = urllib2.Request(siaUrl + "/JSON-RPC", data, {'Content-Type': 'application/json'})
        f = urllib2.urlopen(req)
        result=json.loads(f.read())
        f.close()
        return result["result"]["asignaturas"]["list"]

    @cache.cache(expire=60*60*24)
    def queryGroupsBySubjectCode(this,code):
        data = json.dumps({"method": "buscador.obtenerGruposAsignaturas", "params": [code, "0"]})
        req = urllib2.Request(siaUrl + "/JSON-RPC", data, {'Content-Type': 'application/json'})
        f = urllib2.urlopen(req)
        result=json.loads(f.read())
        f.close()
        return result["result"]["list"]

    @cache.cache(expire=60*60*24)
    def queryGroupsProfessions(this,code,group):
        import re
        f = urllib2.urlopen("http://www.sia.unal.edu.co/buscador/service/groupInfo.pub?cod_asignatura=" + str(code) + "&grp=" + str(group))
        html = f.read().decode("ISO-8859-1")
        f.close()
        relevantSection = re.compile(r'Los planes de estudio para los cuales se ofrece esta asignatura son:</p><div><ul class="modulelist">(.*)</ul></div>').findall(html)
        professions = []
        if (len(relevantSection)>0):
            professionsHtml = re.compile('<li><p>(.*?)</p></li>').findall(relevantSection[0])
            for i in professionsHtml:
                data = i.split("-")
                professions.append((int(data[0]),re.compile('<em>(.*)</em>').findall("".join(data[1:]))[0]))
        return professions

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
                print "Skipping already processed ", subject.name.encode('ascii','ignore')
            except Exception:
                s = djangoModels.Subject.objects.create(name=subject.name,code=subject.code,credits=subject.credits,stype=subject.type)
                for i in groups:
                    t,created = djangoModels.Teacher.objects.get_or_create(name=i.teacher)
                    g = djangoModels.Group.objects.create(teacher=t,subject=s,code=i.code,schedule=i.schedule)
                    g.save()
                    for j in i.professions:
                        p,created = djangoModels.Profession.objects.get_or_create(code=j.code,name=j.name.strip())
                        g.professions.add(p)
                    g.save()



        dao = SiaDaos.SubjectDao(self.sia)
        gDao = SiaDaos.GroupDao(self.sia)
        for j in letters:
            print "Synchronizing letter",j
            for i in dao.getSubjectsByName(j,"",1000000):
                createSubject(i,gDao.getGroupsBySubjectCode(i.code))

def syncsia():
    c = DatabaseCreator(SIA())
    c.getSubjects("abcdefghijklmnopqrstuvwxyz")
