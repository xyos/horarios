import Models
class ScheduleSerializer:
    def serialize(self,data):
        if isinstance(data,list):
            out = []
            for i in data:
                out.append(self.serialize_single(i))
        elif isinstance(data,Models.Schedule):
            out = self.serialize_single(data)

        import simplejson
        return simplejson.dumps(out)

    def serialize_single(self,schedule):
        out = {}
        out['groups'] = []
        for g in schedule.groups:
            out['groups'].append([g.code,g.schedule])
        out['busy'] = schedule.busy
        return out
