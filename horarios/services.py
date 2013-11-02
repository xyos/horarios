#Let services manage for now the complexity of having differente data sources
#In other words, the services may lean on differente data sources to get different info.
from Helpers import SIA
globalSia = SIA()

class SubjectsServices:
    
    def __init__(self,sia=globalSia):
        self.sia = sia

    def getGroups(self,subjectCode):
        from SiaDaos import GroupDao
        dao = GroupDao(self.sia)
        return dao.getGroupsBySubjectCode(subjectCode)

    def getSubjectsByName(self,name,level,maxResults=100):
        from SiaDaos import SubjectDao
        dao = SubjectDao(self.sia)
        subjects = dao.getSubjectsByName(name,level,maxResults)
        for i in range(0,len(subjects)):
            subjects[i].gropus = self.getGroups(subjects[i].code)
        return subjects
