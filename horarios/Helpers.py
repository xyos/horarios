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
        'cache.lock_dir': '/tmp/horariossiacache/lock',
        'cache.regions': 'short_term, long_term',
        'cache.short_term.type': 'memory',
        'cache.short_term.expire': '3600',
        'cache.long_term.type': 'file',
        'cache.long_term.expire': '86400'
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

    @cache.region('short_term')
    def querySubjectsByName(this,name,level,maxRetrieve):
        data = json.dumps({"method": "buscador.obtenerAsignaturas", "params": [name, level, "", level, "", "", 1, maxRetrieve]})
        req = urllib2.Request(siaUrl + "/JSON-RPC", data, {'Content-Type': 'application/json'})
        f = urllib2.urlopen(req)
        result=json.loads(f.read())
        f.close()
        return result["result"]["asignaturas"]["list"]

    @cache.region('short_term')
    def queryGroupsBySubjectCode(this,code):
        data = json.dumps({"method": "buscador.obtenerGruposAsignaturas", "params": [code, "0"]})
        req = urllib2.Request(siaUrl + "/JSON-RPC", data, {'Content-Type': 'application/json'})
        f = urllib2.urlopen(req)
        result=json.loads(f.read())
        f.close()
        return result["result"]["list"]

    @cache.region('short_term')
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
        if(len(listOfListOfGroups) == 0):
            return [Schedule(busy)]

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
    alphabet="abcdefghijklmnopqrstuvwxyz"
    c.getSubjects(alphabet)


def getIcsFromSchedule(schedule):
    import BO
    import datetime
    def next_weekday(d, weekday):
        # Taken from http://stackoverflow.com/questions/6558535/python-find-the-date-for-the-first-monday-after-a-given-a-date
        # 0 = Monday, 1=Tuesday, 2=Wednesday...
        days_ahead = weekday - d.weekday()
        if days_ahead <= 0: # Target day already happened this week
            days_ahead += 7
        return d + datetime.timedelta(days_ahead)

    def getDaysStart():
        import pytz
        tz = pytz.timezone('America/Bogota')
        starts = dict()
        if datetime.date.today().month<6:
            beginning = datetime.datetime(datetime.date.today().year,02,01,0,0,0,tzinfo=tz)
        else:
            beginning = datetime.datetime(datetime.date.today().year,07,01,0,0,0,tzinfo=tz)
            
        for i in range(0,len(BO.DAYS)):
            starts[i] = next_weekday(beginning,i)

        return starts

    def getEvent(startHour,endHour,start):
        starts = getDaysStart()
        if datetime.date.today().month<6:
            period = 1
        else:
            period = 2

        event = Event()
        event.add('summary', facades.getSubjectsByCode(group.subjectCode).name)
        event.add('dtstart', datetime.datetime.replace(starts[start],hour=startHour))
        event.add('dtend', datetime.datetime.replace(starts[start],hour=endHour))
        event.add('rrule',{'FREQ':'WEEKLY','COUNT':'14'})
        event['uid'] = str(group.subjectCode) + '/' + str(group.code) + '/' + BO.DAYS[start] + '/' + str(startHour) + '-' + str(endHour) + '/UN' + str(datetime.date.today().year)  +  '-' + str(period) + '@horariosUN@nomeroben.com'

        event.add('priority', 5)
        return event

    from icalendar import Calendar, Event
    cal = Calendar()
    cal.add('prodid', '-//Horario producido usando HorariosUN//mxm.dk//')
    cal.add('version', '2.0')
    import facades
    for group in schedule.groups:
        for i in range(0,len(group.schedule)):
            hours = "{0:024b}".format(group.schedule[i])
            hours = hours[::-1]
            j = 0
            activeChunk = False
            while (j < len(hours)):
                if (not activeChunk) and hours[j] == '1':
                    startHour = j
                    activeChunk=True
                else:
                    if(activeChunk):
                        endHour = j+1
                        cal.add_component(getEvent(startHour,endHour,i))
                        activeChunk=False
                j += 1
            if(activeChunk):
                endHour = 24
                cal.add_component(getEvent(startHour,endHour,i))
                activeChunk=False
                
            #event.add('dtstamp', datetime.datetime(2005,4,4,0,10,0,tzinfo=tz))
    return cal.to_ical()
