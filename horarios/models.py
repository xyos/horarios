from django.db import models

class Subject(models.Model):
    name = models.CharField(max_length=100)
    code = models.IntegerField()
    credits = models.IntegerField()

class Teacher(models.Model):
    name = models.CharField(max_length=100)

class Group(models.Model):
    schedule = models.CommaSeparatedIntegerField(max_length=100)
    code = models.IntegerField()
    teacher = models.ForeignKey(Teacher)
    subject = models.ForeignKey(Subject)
