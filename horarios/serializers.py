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
        
class SubjectSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model =  Subject
        fields = ('name','code')