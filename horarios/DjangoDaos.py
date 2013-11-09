import BO 
import models
class SubjectDao:
    
    def BOfromDjango(self,data):
        groups = []
        return BO.Subject(data.name,data.code,data.credits,groups)

    def getSubjectsByName(self,name,level,maxResults):
        subjects = []
        print models.Subject.objects.filter(name__contains=name)
        for i in models.Subject.objects.filter(name__contains=name):
            subjects.append(self.BOfromDjango(i))
        return subjects

    def getSubjectByName(this,name,level):
        return self.BOfromDjango(models.Subject.objects.get(name__exact=name))

    def getSubjectByCode(this,name,level):
        raise Exception("Not implemented for SIA DAOs")


class GroupDao:
    
    def getGroupsBySubjectCode(self,code):
        groups = []
        s = models.Subject.objects.get(code__exact=code)
        for i in s.group_set.all():
            groups.append(BO.Group(i.code,i.teacher.name,i.schedule,s.code))
        return groups
