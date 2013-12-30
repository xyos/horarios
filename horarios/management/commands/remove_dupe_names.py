from django.db.models import Count
from django.db import DatabaseError
from horarios.models import Subject, Group, Profession
from django.core.management.base import BaseCommand

import re


class Command(BaseCommand):

    def handle(self, *args, **options):
        dupes = Subject.objects.values("name").annotate(count=Count("code")).order_by().filter(count__gt=1)
        pattern = re.compile(r' \| ')
        for item in dupes:
            subjects = Subject.objects.filter(name__iexact=item["name"])
            for subject in subjects:

                if pattern.findall(subject.name):
                    self.stdout.write("skipping: " + subject.name)
                else:
                    groups = Group.objects.filter(subject=subject)
                    subject_professions = set()
                    for group in groups:
                        professions = Profession.objects.filter(group=group)
                        for profession in professions:
                            subject_professions.add(profession.name)
                    if len(subject_professions) == 1:
                        name = subject.name + " | " + subject_professions.pop()
                        subject.name = name
                        try:
                            subject.save()
                        except DatabaseError:
                            self.stderr.write("error on : " + name)
                            self.stderr.write("len: " + str(len(name)))
                    else:
                        self.stdout.write("couldn't find profession for : " + subject.name)


        self.stdout.write("processing " + str(item["count"]) + " items in: " + item["name"])