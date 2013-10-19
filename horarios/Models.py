DAYS=["LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","DOMINGO"]

class Subject():
    def __init__(self,name,code,credits,groups):
        self.name=name
        self.code=int(code)
        self.credits=int(credits)
        self.groups=grouops

class Group():
    def __init__(self,teacher,schedule):
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
        
