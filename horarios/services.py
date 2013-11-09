#Let services manage for now the complexity of having differente data sources
#In other words, the services may lean on differente data sources to get different info.

class SubjectsServices:
    
    def __init__(self,factory):
        self.factory = factory

    def getGroups(self,subjectCode):
        dao = self.factory.getGroupDao()
        return dao.getGroupsBySubjectCode(subjectCode)

    def getSubjectsByName(self,name,level,maxResults=100):
        dao = self.factory.getSubjectDao()
        subjects = dao.getSubjectsByName(name,level,maxResults)
        for i in range(0,len(subjects)):
            subjects[i].gropus = self.getGroups(subjects[i].code)
        return subjects
