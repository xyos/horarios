#Let services manage for now the complexity of having differente data sources
#In other words, the services may lean on differente data sources to get different info.

class SubjectsServices:
    
    def __init__(self,factory):
        self.factory = factory

    def getGroups(self,subjectCode):
        dao = self.factory.getGroupDao()
        return dao.getGroupsBySubjectCode(subjectCode)

    def getSimpleGroups(self,subjectCode):
        dao = self.factory.getGroupDao()
        return dao.getSimpleGroupsBySubjectCode(subjectCode)

    def getNumGroups(self,subjectCode):
        dao = self.factory.getGroupDao()
        return len(dao.getSimpleGroupsBySubjectCode(subjectCode))

    def getSubjectsByName(self,name,level,maxResults=100):
        dao = self.factory.getSubjectDao()
        #subjects = [i for i in dao.getSubjectsByName(name,level,maxResults) if self.getNumGroups(i.code) > 0]
        subjects = dao.getSubjectsByName(name,level,maxResults)
        return subjects

    def getSubjectsByNameSmart(self,name,level,maxResults=100):
        from haystack.query import SearchQuerySet
        data = SearchQuerySet().filter(content=name).load_all();
        #out = [i.object for i in data if self.getNumGroups(i.object.code) > 0]
        out = [i.object for i in data]
        return out

    def getSubjectByCode(self,code):
        dao = self.factory.getSubjectDao()
        return dao.getSubjectByCode(code)
