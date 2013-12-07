from django.db import models

class Subject(models.Model):
    name = models.CharField(max_length=100)
    code = models.IntegerField()
    credits = models.IntegerField()
    stype = models.CharField(max_length=10)

class Teacher(models.Model):
    name = models.CharField(max_length=100)

class Profession(models.Model):
    name = models.CharField(max_length=100)
    code = models.IntegerField(primary_key=True)

class Group(models.Model):
    schedule = models.CommaSeparatedIntegerField(max_length=100)
    code = models.IntegerField()
    teacher = models.ForeignKey(Teacher)
    subject = models.ForeignKey(Subject)
    professions = models.ManyToManyField(Profession)

