import Helpers 
class SiaFactory:
    def __init__(self):
        self.sia = Helpers.globalSia
    def getSubjectDao(self):
        from SiaDaos import SubjectDao
        return SubjectDao(self.sia)
    def getGroupDao(self):
        from SiaDaos import GroupDao
        return GroupDao(self.sia)
    def getSubjectsRetriever(self):
        from retrievers import PureRetriever
        return PureRetriever(self.getSubjectDao())
    def getProfessionDao(self):
        from DjangoDaos import ProfessionDAO
        return ProfessionDAO()

class LocalFactory:
    def getSubjectDao(self):
        from DjangoDaos import SubjectDao
        return SubjectDao()
    def getGroupDao(self):
        from DjangoDaos import GroupDao
        return GroupDao()
    def getSubjectsRetriever(self):
        from retrievers import HaystackRetriever
        return HaystackRetriever()
    def getProfessionDao(self):
        from DjangoDaos import ProfessionDAO
        return ProfessionDAO()

class MixedFactory:
    def __init__(self):
        self.sia = Helpers.globalSia
    def getSubjectDao(self):
        from DjangoDaos import SubjectDao
        return SubjectDao()
    def getGroupDao(self):
        from SiaDaos import GroupDao
        return GroupDao(self.sia)
    def getSubjectsRetriever(self):
        from retrievers import HaystackRetriever
        return HaystackRetriever()
    def getProfessionDao(self):
        from DjangoDaos import ProfessionDAO
        return ProfessionDAO()
