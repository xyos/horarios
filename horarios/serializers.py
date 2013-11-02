import Models
import simplejson as json
class Serializer:
    def __init__(self,serializedClass):
        self.serializedClass = serializedClass

    def serialize(self,data):
        out={}
        if isinstance(data,list):
            out = []
            for i in data:
                out.append(self.serialize_single(i))
        elif (data,self.serializedClass):
            out = self.serialize_single(data)

        return out

class ScheduleSerializer(Serializer):
    
    def __init__(self):
        Serializer.__init__(self,Models.Schedule)

    def serialize_single(self,schedule):
        out = {}
        out['groups'] = []
        for g in schedule.groups:
            out['groups'].append({"code":g.code,"subject":g.subjectCode,"schedule":g.schedule})
        out['busy'] = schedule.busy
        return out

class SimpleSubjectsSerializer(Serializer):

    def __init__(self):
        Serializer.__init__(self,Models.Subject)
    
    def serialize_single(self,subject):
        out = {}
        out['name'] = subject.name
        out['code'] = subject.code
        return out

class GroupSerializer(Serializer):

    def __init__(self):
        Serializer.__init__(self,Models.Group)
    
    def serialize_single(self,group):
        out = {}
        out['teacher'] = group.teacher
        out['code'] = group.code
        out['schedule'] = group.schedule
        out['subject'] = group.subjectCode
        return out
