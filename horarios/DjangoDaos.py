import BO 
import models
from Helpers import sanitize_search_term
class ProfessionDAO:
    
    def BOfromDjango(self,data):
        groups = []
        return BO.Profession(data.code,data.name)

    def getProfessions(self):
        professions = []
        for i in models.Profession.objects.all():
            professions.append(self.BOfromDjango(i))
        return professions

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

    def getSearchResults(self, search_term="", profession="", subject_type=[]):
        subjects = []
        if search_term == "":
            if profession == "":
                pass
            else:
                query = models.Subject.objects.filter(
                        group__in=models.Group.objects.filter(professions__code=profession))
                if len(subject_type) != 0:
                    query = query.filter(stype__in=subject_type)
                query = query.distinct()
                for i in query:
                    subjects.append(self.BOfromDjango(i))
        else:
            search_term = sanitize_search_term(search_term)
            query = models.Subject.objects.extra(
                    where=["name @@ to_tsquery('sp', %s)"], params=[search_term])
            if profession != "":
                query = query.filter(group__in=models.Group.objects.filter(professions__code=profession))
            if len(subject_type) != 0:
                query = query.filter(stype__in=subject_type)
            query = query.distinct()
            for i in query:
                subjects.append(self.BOfromDjango(i))
        return subjects


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
        subject = models.Subject.objects.get(code__exact=code)
        for group in subject.group_set.all():
            professions = []
            groups.append(
                BO.Group(group.code,
                             group.teacher.name,
                             group.schedule,
                             subject.code,
                             professions,
                             0,
                             0
                )
            )
        return groups

