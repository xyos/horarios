import json
import urllib2
from Models import Subject,Group,Schedule
import Models

class SIA:

    subjects_cache = {}
    groups_cache = {}

    def existsSubject(this,name,level):
        return this.queryNumSubjectsWithName(name,level)>0

    def queryNumSubjectsWithName(this,name,level):
        data = json.dumps({"method": "buscador.obtenerAsignaturas", "params": [name, level, "", level, "", "", 1, 1]})
        req = urllib2.Request("http://www.sia.unal.edu.co/buscador/JSON-RPC", data, {'Content-Type': 'application/json'})
        f = urllib2.urlopen(req)
        result = json.loads(f.read())["result"]["totalAsignaturas"]
        f.close()
        return result

    def querySubjectsByName(this,name,level,maxRetrieve):
        if not (name in this.subjects_cache):
            data = json.dumps({"method": "buscador.obtenerAsignaturas", "params": [name, level, "", level, "", "", 1, maxRetrieve]})
            req = urllib2.Request("http://www.sia.unal.edu.co/buscador/JSON-RPC", data, {'Content-Type': 'application/json'})
            f = urllib2.urlopen(req)
            result=json.loads(f.read())
            f.close()
            this.subjects_cache[name] = result["result"]["asignaturas"]["list"]

        return this.subjects_cache[name]

    def queryGroupsBySubjectCode(this,code):
        if not (code in this.groups_cache):
            data = json.dumps({"method": "buscador.obtenerGruposAsignaturas", "params": [code, "0"]})
            req = urllib2.Request("http://www.sia.unal.edu.co/buscador/JSON-RPC", data, {'Content-Type': 'application/json'})
            f = urllib2.urlopen(req)
            result=json.loads(f.read())
            f.close()
            this.groups_cache[code] = result["result"]["list"]
        return this.groups_cache[code]

    def create_subject(this,data):
        groupsData = this.queryGroupsBySubjectCode(data["codigo"])
        groups=[]
        for g in groupsData:
            schedule = {}
            if(g["horario_lunes"] != "--"):
                schedule[Models.DAYS[0]] = g["horario_lunes"]
            if(g["horario_martes"] != "--"):
                schedule[Models.DAYS[1]] = g["horario_martes"]
            if(g["horario_miercoles"] != "--"):
                schedule[Models.DAYS[2]] = g["horario_miercoles"]
            if(g["horario_jueves"] != "--"):
                schedule[Models.DAYS[3]] = g["horario_jueves"]
            if(g["horario_viernes"] != "--"):
                schedule[Models.DAYS[4]] = g["horario_viernes"]
            if(g["horario_sabado"] != "--"):
                schedule[Models.DAYS[5]] = g["horario_sabado"]
            if(g["horario_domingo"] != "--"):
                schedule[Models.DAYS[6]] = g["horario_domingo"]

            groups.append(Group(g["codigo"],g["nombredocente"],schedule))

        return Subject(data["nombre"],data["codigo"],data["creditos"],groups)

    def getSubject(this,name,level):
        data = this.querySubjectsByName(name,level,1)[0]
        return this.create_subject(data);

    def get_subjects(this,name,level,maxResults=100):
        data = this.querySubjectsByName(name,level,maxResults)
        result = []
        for i in data:
            result.append(this.create_subject(i))
        return result;


class Generator:

    def generateSchedule(self,listOfSubjects):
        result = []
        if(len(listOfSubjects) == 1):
            for g in listOfSubjects[0].groups:
                result.append(Schedule(None,g))
            return result

        subject = listOfSubjects.pop()
        subSchedules = self.generateSchedule(listOfSubjects)
        for group in subject.groups:
            for schedule in subSchedules:
                if(schedule._isCompatible(group)):
                    result.append(schedule.clone().addGroup(group))

        if(len(result) == 0):
            print "No schedule can be generated so that it includes " , subject.name
        return result
