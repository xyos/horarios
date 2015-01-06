import BO as Models


class ProfessionDAO:
    def __init__(self,sia):
        self.sia = sia

    def getProfessions(self):
        data = self.sia.getProfessions()
        result = []
        for i in data:
            result.append(self.createProfession(i))
        return result

    @staticmethod
    def createProfession(data):
        return Models.Profession(data["name"],data["code"])

class SubjectDao:
    def __init__(self,sia):
        self.sia = sia

    def getSubjectsByName(self, name, level, maxResults):
        data = self.sia.querySubjectsByName(name, level, maxResults)
        result = []
        for i in data:
            result.append(self.createSubject(i))
        return result

    @staticmethod
    def createSubject(data):
        groups = []
        return Models.Subject(data["nombre"],data["codigo"],data["creditos"],groups,data["tipologia"])

    def getSubjectByName(self, name, level):
        data = self.sia.querySubjectsByName(name, level, 1)[0]
        return self.createSubject(data)

    def getSubjectByCode(self,code):
        data = self.sia.querySubjectsByName(code, level, 1)[0]
        return self.createSubject(data)


class GroupDao:
    def __init__(self,sia):
        self.sia = sia 

    def getSimpleGroupsBySubjectCode(self,code):
        groups = []
        groupsData = self.sia.queryGroupsBySubjectCode(code)
        for group in groupsData:
            schedule = self.getSchedule(group)
            professions = None
            groups.append(
                Models.Group(group["codigo"],
                             group["nombredocente"],
                             schedule,
                             code,
                             professions,
                             group["cuposdisponibles"],
                             group["cupostotal"]
                )
            )
        return groups
    
    def getGroupsBySubjectCode(self,code):
        groups = []
        groupsData = self.sia.queryGroupsBySubjectCode(code)
        for group in groupsData:
            schedule = self.getSchedule(group)
            professions = self.getProfessions(code, group["codigo"])
            groups.append(
                Models.Group(group["codigo"],
                             group["nombredocente"],
                             schedule,
                             code,
                             professions,
                             group["cuposdisponibles"],
                             group["cupostotal"]
                )
            )
        return groups

    @staticmethod
    def getSchedule(group):
        scheduleDict = {}
        for day in Models.DAYS:
            if group["horario_" + day.lower()] != "--":
                scheduleDict[day] = group["horario_" + day.lower()]
        return GroupDao._parseSchedule(scheduleDict)

    def getProfessions(self, code, group):
        professions = []
        for i in self.sia.queryGroupsProfessions(code, group):
            professions.append(Models.Profession(i[0], i[1]))
        return professions




    @staticmethod
    def _parseSchedule(scheduleDict):
        """
                schedule is a dictionary of {day : begin-end}*
                returns an array of ints which follows : The i-th (for i = [1,24]) less significant bit represents the time period between i-1 hours and i hours.
        """
        schedule=[]
        for i in Models.DAYS:
            try:
                scheduleString = scheduleDict[i]
                hours = ["0"]*24
                hourBlocks = scheduleString.split(" ")
                for hourBlock in hourBlocks:
                    split = hourBlock.split("-")
                    try:
                        for i in range(int(split[0]),int(split[1])):
                            #from i%24 to (i%24)+1
                            hours[23-(i%24)]="1"
                    except Exception:
                        print "Problem while parsing schedule described as :", scheduleString
                schedule.append(int("".join(hours),2))
            except KeyError:
                schedule.append(0)
        return schedule
