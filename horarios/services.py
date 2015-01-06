#Let services manage for now the complexity of having differente data sources
#In other words, the services may lean on differente data sources to get different info.

class SubjectsServices:
    
    def __init__(self,factory):
        self.factory = factory

    def getGroups(self,subjectCode):
        dao = self.factory.getGroupDao()
        return dao.getGroupsBySubjectCode(subjectCode)

    def getProfessions(self):
        dao = self.factory.getProfessionDao()
        return dao.getProfessions()


    def getSimpleGroups(self,subjectCode):
        dao = self.factory.getGroupDao()
        return dao.getSimpleGroupsBySubjectCode(subjectCode)

    def getNumGroups(self,subjectCode):
        dao = self.factory.getGroupDao()
        return len(dao.getSimpleGroupsBySubjectCode(subjectCode))

    def getSubjectsByName(self,name,level,maxResults=100):
        retriever = self.factory.getSubjectsRetriever()
        subjects = retriever.getByName(name,level,maxResults)
        return subjects

    def getSubjectByCode(self,code):
        dao = self.factory.getSubjectDao()
        return dao.getSubjectByCode(code)
