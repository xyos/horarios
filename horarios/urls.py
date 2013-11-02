from django.conf.urls import patterns, include, url
from horarios.views import SubjectAutocompleteView, RandomScheduleView

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'horarios.views.home', name='home'),
    url(r'^deploy/$', 'horarios.views.do_deploy', name='deploy'),
    url(r'^test/$', 'horarios.views.random_schedules', name='random_schedules'),
    url(r'^api/v1.0/subject/autocomplete/(?P<name>\w+)[/]?$', SubjectAutocompleteView.as_view() , name='subject_autocomplete'),
    url(r'^api/v1.0/schedule/random/$', RandomScheduleView.as_view() , name='random_schedule'),
    url(r'^json/subject$', 'horarios.views.autocomplete_subject', name='autocomplete'),

    # url(r'^horarios/', include('horarios.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
