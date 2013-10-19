DAYS=["LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","DOMINGO"]

class Subject():
    def __init__(self,name,code,credits,groups):
        self.name=name
        self.code=int(code)
        self.credits=int(credits)
        self.groups=groups

class Group():
    def __init__(self,code,teacher,schedule):
        """ 
            rooms is a dictionary of day : room
            schedule is a dictionary of day : begin-end
            teacher is a string
        """
        self.schedule=[]
        j=0
        for i in DAYS:
            try:
                self.schedule.append(self.parseSchedule(schedule[i]))
            except KeyError:
                self.schedule.append(0)
        self.teacher = teacher
    
    def parseSchedule(self,scheduleString):
        split = scheduleString.split("-")
        hours = ["0"]*24
        for i in range(int(split[0]),int(split[1])+1):
            hours[23-i+1]="1"
        return int("".join(hours),2)
        
class Schedule():
    def __init__(self,busy,*args):
        """
        busy is an array of integers, each integer is one day's hours
        """
        self.groups = []
        if(busy != None):
            self.busy = busy
        else:
            self.busy=[0]*7

        for arg in args:
            if(isinstance(arg,list)):
                for i in arg:
                    self.addGroup(i)
            else:
                self.addGroup(arg)

    def __str__(self):
        ret = ""
        for i in range(0,len(self.busy)):
            ret = ret + DAYS[i] + " : " + "{0:024b}".format(self.busy[i]) + "\n"

    def clone(self):
        clone = Schedule(self.busy)
        clone.groups = self.groups
        return clone


    def _isCompatible(self,course):
        for i in zip(self.busy,course.schedule):
            if((i[0]&i[1]) != 0):
                return False
        return True

    def addGroup(self,group):
        if(not self._isCompatible(group)):
            raise Exception("Trying to add an incompatible group to this schedule.")
        self.groups.append(group)
        for i in range(0,len(self.busy)):
            self.busy[i] = self.busy[i] | group.schedule[i]
        return self
