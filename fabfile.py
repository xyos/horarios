from fabric.api import local

def prepare_deploy():
    #local("./manage.py test horarios")
    local("git add -p && git commit")
    local("git push")
