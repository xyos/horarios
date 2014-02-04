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

class LocalFactory:
    def getSubjectDao(self):
        from DjangoDaos import SubjectDao
        return SubjectDao()
    def getGroupDao(self):
        from DjangoDaos import GroupDao
        return GroupDao()

class MixedFactory:
    def __init__(self):
        self.sia = Helpers.globalSia
    def getSubjectDao(self):
        from DjangoDaos import SubjectDao
        return SubjectDao()
    def getGroupDao(self):
        from SiaDaos import GroupDao
        return GroupDao(self.sia)
