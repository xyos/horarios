import string
import json
import logging
import urllib2
import Queue
import threading

from django.core.management.base import BaseCommand
from horarios.models import Subject, Group, Teacher, Profession
from horarios.SiaDaos import GroupDao
from httplib import HTTPException
from horarios.Helpers import SIA
from django.conf import settings



class Command(BaseCommand):
    help = 'Synchronizes the SIA subjects DB'

    def __init__(self, *args, **kwargs):
        super(Command, self).__init__(*args, **kwargs)
        self.queue = Queue.Queue()

    def handle(self, *args, **options):
        self.sync()
        #syncsia()

    def get_subjects(self):
        subjects = dict()
        for letter in string.ascii_lowercase:
            data = json.dumps(
                {"method": "buscador.obtenerAsignaturas", "params": [letter, 1, "", 1, "", "", 1, 100000]})
            req = urllib2.Request(settings.SIA_URL + "/JSON-RPC", data, {'Content-Type': 'application/json'})
            response = self.open_req(req)
            for subject in response["result"]["asignaturas"]["list"]:
                subjects[subject["codigo"]] = subject
        self.stdout.write("number of subjects to fetch:" + len(subjects).__str__())
        return subjects

    def sync(self):
        subjects = self.get_subjects()
        #spawn a pool of threads
        for i in range(5):
            t = ThreadGroup(self.queue)
            t.setDaemon(True)
            t.start()
        #adding subjects to queue
        for subject in subjects.itervalues():
            try:
                s = Subject.objects.get(code=subject["codigo"])
                s.credits = subject["creditos"]
                s.name = subject["nombre"]
                s.stype = subject["tipologia"]

            except Subject.DoesNotExist:
                s = Subject(
                    code=subject["codigo"],
                    credits=subject["creditos"],
                    name=subject["nombre"],
                    stype=subject["tipologia"]
                )
            try:
                s.save()
            except Exception, e:
                self.stderr.write(str(e))
            self.queue.put(s)
        #wait until all subjects are in the queue
        self.queue.join()
        self.stdout.write("Job's Done!")

    @staticmethod
    def open_req(request):
        try:
            url = urllib2.urlopen(request)
            result = json.loads(url.read())
            return result
        except urllib2.URLError, e:
            logging.warning('URLError = ' + str(e))
            return e.code
        except HTTPException:
            logging.warn('HTTPException')


class ThreadGroup(threading.Thread):
    """Threaded Group Grab"""
    def __init__(self, queue):
        threading.Thread.__init__(self)
        self.queue = queue

    def run(self):
        while True:
            #grabs subject from queue
            subject = self.queue.get()
            try:
                data = json.dumps({"method": "buscador.obtenerGruposAsignaturas", "params": [subject.code, 0]})
                req = urllib2.Request(settings.SIA_URL + "/JSON-RPC", data, {'Content-Type': 'text/plain'})
                result = Command.open_req(req)
                if isinstance(result, int):
                    #putting back the subject into the queue if our request is rejected by the server
                    logging.warning("added back " + str(subject.code) + " to queue")
                    self.queue.put(subject)
                else:
                    print "grupos para " + str(subject.code) + " :" + len(result["result"]["list"]).__str__()
                    result_groups = result["result"]["list"]
                    for group in result_groups:
                        self.update_or_create_group(subject, group)
                    self.queue.task_done()
            except Exception:
                self.queue.put(subject)

    def update_or_create_group(self, subject, group):
        teacher, created = Teacher.objects.get_or_create(
            name=group["nombredocente"]
        )
        try:
            g = Group.objects.get(subject=subject, code__iexact=group["codigo"])
            g.teacher = teacher
            g.subject = subject
            g.schedule = GroupDao.getSchedule(group)

        except Group.DoesNotExist:
            g = Group.objects.create(
                teacher=teacher,
                subject=subject,
                code=group["codigo"],
                schedule=GroupDao.getSchedule(group)
            )
        try:
            g.save()
        except Exception, e:
            print str(e)
        professions_array = SIA.queryGroupsProfessions(subject.code, group["codigo"])
        for profession in professions_array:
            p, created = Profession.objects.get_or_create(
                code=profession[0],
                name=profession[1].strip()
            )
            g.professions.add(p)

        try:
            g.save()
        except Exception, e:
            print str(e)
