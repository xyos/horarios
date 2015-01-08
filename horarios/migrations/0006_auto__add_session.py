# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Session'
        db.create_table(u'horarios_session', (
            ('url', self.gf('django.db.models.fields.CharField')(max_length=20, primary_key=True)),
            ('json', self.gf('jsonfield.fields.JSONField')()),
        ))
        db.send_create_signal(u'horarios', ['Session'])


    def backwards(self, orm):
        # Deleting model 'Session'
        db.delete_table(u'horarios_session')


    models = {
        u'horarios.group': {
            'Meta': {'object_name': 'Group'},
            'code': ('django.db.models.fields.IntegerField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'professions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['horarios.Profession']", 'symmetrical': 'False'}),
            'schedule': ('django.db.models.fields.CommaSeparatedIntegerField', [], {'max_length': '100'}),
            'subject': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['horarios.Subject']"}),
            'teacher': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['horarios.Teacher']"})
        },
        u'horarios.profession': {
            'Meta': {'object_name': 'Profession'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '20', 'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'horarios.session': {
            'Meta': {'object_name': 'Session'},
            'json': ('jsonfield.fields.JSONField', [], {}),
            'url': ('django.db.models.fields.CharField', [], {'max_length': '20', 'primary_key': 'True'})
        },
        u'horarios.subject': {
            'Meta': {'object_name': 'Subject'},
            'code': ('django.db.models.fields.IntegerField', [], {'primary_key': 'True'}),
            'credits': ('django.db.models.fields.IntegerField', [], {}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'stype': ('django.db.models.fields.CharField', [], {'max_length': '10'})
        },
        u'horarios.teacher': {
            'Meta': {'object_name': 'Teacher'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '100'})
        }
    }

    complete_apps = ['horarios']