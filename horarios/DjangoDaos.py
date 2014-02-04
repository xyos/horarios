import BO 
import models
class SubjectDao:
    
    def BOfromDjango(self,data):
        groups = []
        return BO.Subject(data.name,data.code,data.credits,groups,data.stype)

    def getSubjectsByName(self,name,level,maxResults):
        subjects = []
        for i in models.Subject.objects.filter(name__icontains=name):
            subjects.append(self.BOfromDjango(i))
        return subjects

    def getSubjectByName(self,name,level):
        return self.BOfromDjango(models.Subject.objects.get(name__iexact=name))

    def getSubjectByCode(self,code):
        return self.BOfromDjango(models.Subject.objects.get(code__exact=code))


class GroupDao:
    
    def getGroupsBySubjectCode(self,code):
        groups = []
        s = models.Subject.objects.get(code__exact=code)
        for i in s.group_set.all():
            prof = []
            for j in i.professions.all():
                prof.append(BO.Profession(j.code,j.name))
            groups.append(BO.Group(i.code,i.teacher.name,i.schedule,s.code,prof))
        return groups

    def getSimpleGroupsBySubjectCode(self,code):
        groups = []
        groupsData = models.Subject.objects.get(code__exact=code)
        for group in groupsData:
            professions = None
            groups.append(
                Models.Group(group["codigo"],
                             group["nombredocente"],
                             schedule,
                             code,
                             professions,
                             group["cuposdisponibles"],
                             group["cupostotal"]
                )
            )
        return groups

