from django.core.management.base import BaseCommand, CommandError
from horarios.Helpers import syncsia

class Command(BaseCommand):
    help = 'Synchronizes the SIA subjects DB'

    def handle(self, *args, **options):
        syncsia();
