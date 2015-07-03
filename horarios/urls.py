from django.conf.urls import patterns, include, url
from horarios.views import SchedulesView, ProfessionsView, SessionList, SessionDetail, SubjectList, SubjectDetail, SubjectProfessionAutocompleteView
from django.contrib import admin

urlpatterns = patterns('',
    url(r'^$', 'horarios.views.home', name='home'),
    url(r'^deploy/$', 'horarios.views.do_deploy', name='deploy'),
    url(r'^api/v1.0/subject/autocomplete/search_term=(?P<search_term>[^&]*)&profession=(?P<profession>[^&]*)&subject_type=(?P<subject_type>[^/]*)[/]?$', SubjectProfessionAutocompleteView.as_view() , name='subject_autocomplete'),
    url(r'^api/v1.0/subjects/$', SubjectList.as_view()),
    url(r'^api/v1.0/subjects/(?P<pk>\w+)$',SubjectDetail.as_view()),
    url(r'^api/v1.0/professions/$', ProfessionsView.as_view()),
    url(r'^api/v1.0/schedule/subjects=(?P<subjects>[\d,|]*)&busy=(?P<busy>[\d,]*)$', SchedulesView.as_view() , name='schedules'),
    url(r'^api/v1.0/schedule/subjects=(?P<subjects>[\d,|]*)&busy=(?P<busy>[\d,]*)/(?P<schedule>\d+)/ics$', 'horarios.views.getICS' , name='scheduleICS'),
    url(r'^api/v1.0/sessions/$',SessionList.as_view()),
    url(r'^api/v1.0/sessions/(?P<pk>\w+)$',SessionDetail.as_view()),
    url(r'^admin/', include(admin.site.urls)),
)
