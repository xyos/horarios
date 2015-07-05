from django.conf.urls import patterns, include, url
from horarios.views import ProfessionList, SessionList, SessionDetail, SubjectList, SubjectDetail, SubjectProfessionAutocompleteView
from django.contrib import admin

urlpatterns = patterns('',
    url(r'^$', 'horarios.views.home', name='home'),
    url(r'^deploy/$', 'horarios.views.do_deploy', name='deploy'),
    url(r'^api/v1.0/subjects/autocomplete/search_term=(?P<search_term>[^&]*)&profession=(?P<profession>[^&]*)&subject_type=(?P<subject_type>[^/]*)[/]?$', SubjectProfessionAutocompleteView.as_view()),
    url(r'^api/v1.0/subjects/$', SubjectList.as_view()),
    url(r'^api/v1.0/subjects/(?P<pk>\w+)$',SubjectDetail.as_view()),
    url(r'^api/v1.0/professions/$', ProfessionList.as_view()),
    url(r'^api/v1.0/sessions/$',SessionList.as_view()),
    url(r'^api/v1.0/sessions/(?P<pk>\w+)$',SessionDetail.as_view()),
    url(r'^admin/', include(admin.site.urls)),
)
