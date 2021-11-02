from django.core.management.base import BaseCommand, CommandError
import subprocess
import json

class Command(BaseCommand):
	help = 'Parse 1.2'

	def handle(self, *args, **options):
		status = 'error'
		try:
			status = subprocess.check_output(['node', '--no-warnings', '1.2/parseAndAppend.js']).decode('utf-8')
		except: pass
		if status != 'ok':
			print('Дружочек-пирожочек! Было бы не плохо, прежде чем пытаться запускать что-то, сначала прочитать README.')