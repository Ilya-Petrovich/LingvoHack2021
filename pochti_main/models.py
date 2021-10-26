from django.db import models

class No(models.Model):
	word = models.CharField('word', max_length=50)
	translation = models.CharField('translation', max_length=50)
	abst = models.BooleanField('abst')

	def __str__(self):
		return self.word
	
	class Meta:
		verbose_name = 'СЛОВО'
		verbose_name_plural = 'МНОГО СЛОВ'