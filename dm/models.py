from django.db import models
from django.contrib.auth.models import User

from character_builder.models import Character


class Party(models.Model):
    name = models.CharField(max_length=100)
    background = models.TextField(blank=True)
    formed_on = models.DateField()
    characters = models.ManyToManyField(Character)

    def __unicode__(self):
        return "%s (est. %s)" % self.name, self.formed_on


class Campaign(models.Model):
    dm = models.ForeignKey(User)
    party = models.ForeignKey(Party)


class Session(models.Model):
    start_time = models.DateTimeField(blank=True)
    end_time = models.DateTimeField(blank=True)
    campaign = models.ForeignKey(Campaign)


class HistoryLine(models.Model):
    session = models.ForeignKey(Session)
    text = models.TextField()
