from django.db import models

class Subject(models.Model):
    name = models.CharField(max_length=200)
    code = models.IntegerField(primary_key=True)
    credits = models.IntegerField()
    stype = models.CharField(max_length=10)

class Teacher(models.Model):
    name = models.CharField(max_length=100, unique=True)

class Profession(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(primary_key=True, max_length=20)

class Group(models.Model):
    schedule = models.CommaSeparatedIntegerField(max_length=100)
    code = models.IntegerField()
    teacher = models.ForeignKey(Teacher)
    subject = models.ForeignKey(Subject)
    professions = models.ManyToManyField(Profession)

