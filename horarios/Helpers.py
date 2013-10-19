import json
import urllib2

class SIA:

    def existsCourse(this,name,level):
        return this.queryNumCoursesWithName(name,level)>0

    def queryNumCoursesWithName(this,name,level):
        data = json.dumps({"method": "buscador.obtenerAsignaturas", "params": [name, level, "", level, "", "", 1, 1]})
        req = urllib2.Request("http://www.sia.unal.edu.co/buscador/JSON-RPC", data, {'Content-Type': 'application/json'})
        f = urllib2.urlopen(req)
        result = json.loads(f.read())["result"]["totalAsignaturas"]
        f.close()
        return result

    def queryCourseByName(this,name,level,maxRetrieve):
        data = json.dumps({"method": "buscador.obtenerAsignaturas", "params": [name, level, "", level, "", "", 1, maxRetrieve]})
        req = urllib2.Request("http://www.sia.unal.edu.co/buscador/JSON-RPC", data, {'Content-Type': 'application/json'})
        f = urllib2.urlopen(req)
        result=json.loads(f.read())
        f.close()
        return result["result"]

    def queryGroupsByCourseCode(this,code):
        data = json.dumps({"method": "buscador.obtenerGruposAsignaturas", "params": [code, "0"]})
        req = urllib2.Request("http://www.sia.unal.edu.co/buscador/JSON-RPC", data, {'Content-Type': 'application/json'})
        f = urllib2.urlopen(req)
        result=json.loads(f.read())
        f.close()
        return result["result"]

             
sia = SIA()
result = sia.queryGroupsByCourseCode("2016696")
