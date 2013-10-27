import simplejson as json
import urllib2
import string
from horarios.models import Subject
from horarios.Helpers import SIA
import jsonpickle


sia = SIA()
subjects = set();
def serialize_subject(s):
    subject = Subject(s['nombre'],s['codigo'],s['creditos'],[])
    subjects.add(subject)
alphabet = string.ascii_lowercase

for t in ["PRE","POS"]:
    for i in alphabet:
        data = sia.querySubjectsByName(i,t,10000)
        for s in data:
            serialize_subject(s)


print(jsonpickle.encode(subjects))
