#Let the facades be a more stable interface to the services
from services import SubjectsServices
subjectsServices = SubjectsServices()

def autocomplete(query):
    return subjectsServices.getSubjectsByName(query,"")

def getSubjectsByName(name,level,maxResults=100):
    return subjectsServices.getSubjectsByName(name,level,maxResults)

def getSchedules(subjectsCodes,busy=None):
    """"
        subjecstCodes : Array of integers (may be strings rep. integers) for subjects codes to consider while generating schedules
        busy : A 7 integers array with the hours that are not avilable, 7 zeros would mean the whole week is avilable
    """
    groups = []
    for s in subjectsCodes:
        groups.append(subjectsServices.getGroups(s))
    #Generating simple scheudles first will fasten the algorithm
    groups = sorted(groups, lambda x,y: 1 if len(x)>len(y) else -1 if len(x)<len(y) else 0)
    from Helpers import Generator
    gen =  Generator()
    result = gen.generateSchedule(groups,busy)
    return result

def getGroupsBySubjectCode(subjectCode):
    return subjectsServices.getGroups(subjectCode)
