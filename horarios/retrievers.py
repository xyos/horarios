class HaystackRetriever:
    def getByName(self,name,level,maxResults):
        from haystack.query import SearchQuerySet
        data = SearchQuerySet().filter(content=name).load_all();
        #out = [i.object for i in data if self.getNumGroups(i.object.code) > 0]
        out = [i.object for i in data]
        return out

class PureRetriever:

    def __init__(self,dao):
        self.dao = dao

    def getByName(self,name,level,maxResults):
        #subjects = [i for i in dao.getSubjectsByName(name,level,maxResults) if self.getNumGroups(i.code) > 0]
        subjects = self.dao.getSubjectsByName(name,level,maxResults)
        return subjects
