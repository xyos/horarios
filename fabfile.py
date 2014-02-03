from fabric.api import local
from fabric.colors import green, red
import os


file_path = os.getcwd()

def prepare_deploy():
    #local("./manage.py test horarios")
    local("git add -p && git commit")
    local("git push")


def activate(command):
    if os.name == "nt":
        local("%s/Scripts/activate.bat && " + command, file_path)
    elif os.name == "posix":
        local("source %s/bin/activate && " + command, file_path)

def git_pull():
    "updates the repo"
    print(green("pulling from master"))
    run("git pull origin master")
    print(green("installing requirements"))
    activate("pip install -r requirements.txt")
    print(green("syncing the db"))
    activate("python manage.py syncdb")
    print(green("migrating the db"))
    activate("python manage.py migrate")



