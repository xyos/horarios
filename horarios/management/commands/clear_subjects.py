from django.core.management.base import BaseCommand
from horarios.models import Subject, Group, Teacher, Profession
class Command(BaseCommand):

    help = 'resets subjects, groups and professions'

    def handle(self, *args, **options):
        Group.objects.all().delete()
        Teacher.objects.all().delete()
        Profession.objects.all().delete()
        Subject.objects.all().delete()
        print("cleared!")
