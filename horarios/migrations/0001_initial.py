# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Subject'
        db.create_table(u'horarios_subject', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('code', self.gf('django.db.models.fields.IntegerField')()),
            ('credits', self.gf('django.db.models.fields.IntegerField')()),
            ('stype', self.gf('django.db.models.fields.CharField')(max_length=10)),
        ))
        db.send_create_signal(u'horarios', ['Subject'])

        # Adding model 'Teacher'
        db.create_table(u'horarios_teacher', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
        ))
        db.send_create_signal(u'horarios', ['Teacher'])

        # Adding model 'Profession'
        db.create_table(u'horarios_profession', (
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('code', self.gf('django.db.models.fields.IntegerField')(primary_key=True)),
        ))
        db.send_create_signal(u'horarios', ['Profession'])

        # Adding model 'Group'
        db.create_table(u'horarios_group', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('schedule', self.gf('django.db.models.fields.CommaSeparatedIntegerField')(max_length=100)),
            ('code', self.gf('django.db.models.fields.IntegerField')()),
            ('teacher', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['horarios.Teacher'])),
            ('subject', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['horarios.Subject'])),
        ))
        db.send_create_signal(u'horarios', ['Group'])

        # Adding M2M table for field professions on 'Group'
        m2m_table_name = db.shorten_name(u'horarios_group_professions')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('group', models.ForeignKey(orm[u'horarios.group'], null=False)),
            ('profession', models.ForeignKey(orm[u'horarios.profession'], null=False))
        ))
        db.create_unique(m2m_table_name, ['group_id', 'profession_id'])


    def backwards(self, orm):
        # Deleting model 'Subject'
        db.delete_table(u'horarios_subject')

        # Deleting model 'Teacher'
        db.delete_table(u'horarios_teacher')

        # Deleting model 'Profession'
        db.delete_table(u'horarios_profession')

        # Deleting model 'Group'
        db.delete_table(u'horarios_group')

        # Removing M2M table for field professions on 'Group'
        db.delete_table(db.shorten_name(u'horarios_group_professions'))


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
            'code': ('django.db.models.fields.IntegerField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'horarios.subject': {
            'Meta': {'object_name': 'Subject'},
            'code': ('django.db.models.fields.IntegerField', [], {}),
            'credits': ('django.db.models.fields.IntegerField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'stype': ('django.db.models.fields.CharField', [], {'max_length': '10'})
        },
        u'horarios.teacher': {
            'Meta': {'object_name': 'Teacher'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        }
    }

    complete_apps = ['horarios']