from django.conf.urls import patterns, include, url
from horarios.views import SubjectAutocompleteView, RandomScheduleView,GroupsView,SchedulesView,SubjectView

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'horarios.views.home', name='home'),
    url(r'^deploy/$', 'horarios.views.do_deploy', name='deploy'),
    url(r'^test/$', 'horarios.views.random_schedules', name='random_schedules'),
    url(r'^api/v1.0/subject/autocomplete/(?P<name>[^/]+)[/]?$', SubjectAutocompleteView.as_view() , name='subject_autocomplete'),
    url(r'^api/v1.0/schedule/random/$', RandomScheduleView.as_view() , name='random_schedule'),
    url(r'^api/v1.0/subject/(?P<subjectCode>\d+)/groups/$', GroupsView.as_view() , name='subjectsGroup'),
    url(r'^api/v1.0/subject/(?P<subjectCode>\d+)$', SubjectView.as_view() , name='subject'),
    url(r'^api/v1.0/schedule/subjects=(?P<subjects>[\d,|]*)&busy=(?P<busy>[\d,]*)$', SchedulesView.as_view() , name='schedules'),
    url(r'^api/v1.0/schedule/subjects=(?P<subjects>[\d,|]*)&busy=(?P<busy>[\d,]*)/(?P<schedule>\d+)/ics$', 'horarios.views.getICS' , name='scheduleICS'),

    # url(r'^horarios/', include('horarios.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
