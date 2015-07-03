from django.db import models
from helpers import sanitize_search_term
import json
import shortuuid

class Subject(models.Model):
    name = models.CharField(max_length=200)
    code = models.IntegerField(primary_key=True)
    credits = models.IntegerField()
    stype = models.CharField(max_length=10)
    @staticmethod
    def autocomplete(search_term="", profession="", subject_type=[]):
        if search_term == "":
            if profession == "":
                return Subject.objects.none()
            else:
                query = Subject.objects.filter(
                    group__in=Group.objects.filter(professions__code=profession))
                if len(subject_type) != 0:
                    query = query.filter(stype__in=subject_type)
                return query.distinct()
        else:
            search_term = sanitize_search_term(search_term)
            query = Subject.objects.extra(
                    where=["name @@ to_tsquery('sp', %s)"], params=[search_term])
            if profession != "":
                query = query.filter(groups__in=Group.objects.filter(professions__code=profession))
            if len(subject_type) != 0:
                query = query.filter(stype__in=subject_type)
            return query.distinct()

class Teacher(models.Model):
    name = models.CharField(max_length=100, unique=True)
    def __unicode__(self):
        return self.name

class Profession(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(primary_key=True, max_length=20)

class Group(models.Model):
    schedule = models.CommaSeparatedIntegerField(max_length=100)
    code = models.IntegerField()
    teacher = models.ForeignKey(Teacher, related_name='groups')
    subject = models.ForeignKey(Subject, related_name='groups')
    professions = models.ManyToManyField(Profession)

def make_uuid():
    return shortuuid.ShortUUID().random(length = 10)

class Session(models.Model):
    url  = models.CharField(primary_key=True, max_length=10, default=make_uuid)
    session = models.CharField(max_length=500000)
    

