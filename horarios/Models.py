DAYS=["LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","DOMINGO"]

class Subject():
    def __init__(self,name,code,credits,groups):
        self.name=name
        self.code=int(code)
        self.credits=int(credits)
        self.groups=grouops

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
                self.schedule.append(parseSchedule(schedule[i]))
            except KeyError:
                self.schedule.append(0)
        self.teacher = teacher
    
    def parseSchedule(scheduleString):
        split = scheduleString.split("-")
        hours = "0"*24
        for i in range(int(split[0]),int(split[1])+1):
            hours[i-1]=1
        return int(hours,2)
        
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

    def clone(self):
        pass


    def isCompatible(self,course):
        for i in zip(self.busy,course.schedule):
            if(i[0]&i[1] != 0) return False
        return True

    def addGroup(self,group):
        self.group.append(group)
        for i in range(0,len(self.busy)):
            self.busy[i] = self.busy[i] | group.schedule[i]
