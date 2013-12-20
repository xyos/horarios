[![Stories in Ready](https://badge.waffle.io/xyos/horarios.png?label=ready)](https://waffle.io/xyos/horarios)  
horarios
========
Installation:


clone in git

    #install virtualenv via pip or easy_install, change horarios for your clone dir
    virtualenv horarios
    cd horarios
    source ./bin/activate
    pip install -r requirements.txt
    cd horarios/static/js/
    #this step requires node.js and bower (npm install -g bower)
    bower install
    cd -
    python manage.py flush
    python manage.py syncdb
    python manage.py syncsia
    python manage.py runserver

for stylesheet development sass 3.3 is required (gem install sass --pre)