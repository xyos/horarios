from horarios.models import Session, Subject, Group, Profession
from rest_framework import serializers

class ProfessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profession

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session

class GroupSerializer(serializers.ModelSerializer):
    teacher = serializers.StringRelatedField()
    class Meta:
        model = Group

class SubjectSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, read_only=True)
    class Meta:
        model =  Subject

import BO as Models

class Serializer:
    def __init__(self,serializedClass):
        self.serializedClass = serializedClass

    def serialize(self,data):
        out = {}
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