#Let the facades be a more stable interface to the services
from services import SubjectsServices
subjectsServices = SubjectsServices()

def autocomplete(query):
    return subjectsServices.getSubjectsByName(query,"")

def getSubjectsByName(name,level,maxResults=100):
    return subjectsServices.getSubjectsByName(name,level,maxResults)

def getSchedulesByLists(lists,busy=None):
    #Generating simple scheudles first will fasten the algorithm
    lists = sorted(lists, lambda x,y: 1 if len(x)>len(y) else -1 if len(x)<len(y) else 0)
    from Helpers import Generator
    gen =  Generator()
    result = gen.generateSchedule(lists,busy)
    return result

def getSchedulesByQuery(query,busy=None):
    """
        query must be an array of dictionaries {code:str,groups:[int]}* if groups is None we suppose that all the groups for that subject's code are relevant
    """
    lists = []
    for subject in query:
        print subject["code"]
        groups = subjectsServices.getGroups(subject["code"])
        print subject["groups"]
        if(subject["groups"] != None and len(subject["groups"]) > 0):
            relevantGroups = []
            for g in groups:
                if g.code in subject["groups"]:
                    relevantGroups.append(g)
        else:
            relevantGroups = groups
        lists.append(relevantGroups)
    return getSchedulesByLists(lists,busy)

def getSchedulesBySubjectCodes(subjectsCodes,busy=None):
    """"
        subjecstCodes : Array of integers (may be strings rep. integers) for subjects codes to consider while generating schedules
        busy : A 7 integers array with the hours that are not avilable, 7 zeros would mean the whole week is avilable
    """
    query = [{"code" : x , "groups": None} for x in subjectsCodes]
    return getSchedulesByQuery(query,busy)

def getGroupsBySubjectCode(subjectCode):
    return subjectsServices.getGroups(subjectCode)
