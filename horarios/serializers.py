from horarios.models import Session, Subject, Group, Profession
from rest_framework import serializers
import json

class ProfessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profession

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
    def to_representation(self, group):
        return {
            "id": group.id,
            "teacher": group.teacher.name,
            "schedule": json.loads(group.schedule),
            "code": group.code,
            "subject": group.subject.code,
            "professions": [p.code for p in group.professions.all()]
        }

class SubjectSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, read_only=True)
    class Meta:
        model =  Subject


class SubjectSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model =  Subject
        fields = ('name','code')

class ScheduleSerializer(serializers.BaseSerializer):
    def to_representation(self, schedule):
        groups = []
        for g in schedule.groups:
            groups.append({"code":g.code,"subject":g.subject.code,"schedule":json.loads(g.schedule)})
        return {
            'busy': schedule.busy,
            'groups': groups
        }
