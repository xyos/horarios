[![Stories in Ready](https://badge.waffle.io/xyos/horarios.png?label=ready)](https://waffle.io/xyos/horarios)  
horarios
========
Installation:


clone in git

    # Install virtualenv via pip or easy_install
    # Beginning from the clone directory execute:
    virtualenv horarios
    cd horarios
    source ./bin/activate
    pip install -r requirements.txt
    cd horarios/static/js/
    #this step requires node.js, bower, and require.js (npm install -g bower && npm install -g requirejs & npm intall -g grunt-cli)
    npm install
    bower install
    grunt
    cd -
    python manage.py flush
    python manage.py syncdb
    python manage.py syncsia
    python manage.py rebuild_index
    python manage.py runserver
    

for stylesheet development sass is required `gem install sass`
