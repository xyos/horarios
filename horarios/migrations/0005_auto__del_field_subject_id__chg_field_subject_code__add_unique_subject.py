# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'Subject.id'
        db.delete_column(u'horarios_subject', u'id')


        # Changing field 'Subject.code'
        db.alter_column(u'horarios_subject', 'code', self.gf('django.db.models.fields.IntegerField')(primary_key=True))
        # Adding unique constraint on 'Subject', fields ['code']
        db.create_unique(u'horarios_subject', ['code'])


    def backwards(self, orm):
        # Removing unique constraint on 'Subject', fields ['code']
        db.delete_unique(u'horarios_subject', ['code'])


        # User chose to not deal with backwards NULL issues for 'Subject.id'
        raise RuntimeError("Cannot reverse this migration. 'Subject.id' and its values cannot be restored.")
        
        # The following code is provided here to aid in writing a correct migration        # Adding field 'Subject.id'
        db.add_column(u'horarios_subject', u'id',
                      self.gf('django.db.models.fields.AutoField')(primary_key=True),
                      keep_default=False)


        # Changing field 'Subject.code'
        db.alter_column(u'horarios_subject', 'code', self.gf('django.db.models.fields.IntegerField')())

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