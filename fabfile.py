from fabric.api import run, lcd, local
from fabric.colors import green, red
import os


file_path = os.getcwd()

def activate(command):
    if os.name == "nt":
        local("%s/Scripts/activate.bat && " + command, file_path)
    elif os.name == "posix":
        local("/bin/bash -c 'source " + file_path + "/bin/activate && " + command + "'")

def deploy():
    "updates the repo"
    print(green("pulling from master"))
    #local("git pull origin master")
    print(green("installing requirements"))
    activate("pip install -r requirements.txt")
    print(green("syncing the db"))
    activate("python manage.py syncdb")
    print(green("migrating the db"))
    activate("python manage.py migrate")
    print(green("running grunt"))
    with lcd(file_path + '/horarios/static/js/'):
        local("grunt")
    print(green("building stylesheets"))
    with lcd(file_path + '/horarios/static/css/'):
        local("scss style.scss:style.css")
    print(green("collect static"))
    activate("python manage.py collectstatic --noinput")







