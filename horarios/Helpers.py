import json
import logging
import httplib
import urllib2
from django.core.exceptions import ValidationError
from django.conf import settings
siaUrl=settings.SIA_URL

import re
import string

def sanitize_search_term(term):
    # Replace all puncuation with spaces.
    allowed_punctuation = set(['&', '|', '"', "'"])
    all_punctuation = set(string.punctuation)
    punctuation = "".join(all_punctuation - allowed_punctuation)
    term = re.sub(r"[{}]+".format(re.escape(punctuation)), " ", \
            term)

    # Substitute all double quotes to single quotes.
    term = term.replace('"', "'")
    term = re.sub(r"[']+", "'", term)

    # Create regex to find strings within quotes.
    quoted_strings_re = re.compile(r"('[^']*')")
    space_between_words_re = re.compile(r'([^ &|])[ ]+([^ &|])')
    spaces_surrounding_letter_re = re.compile(r'[ ]+([^ &|])[ ]+')
    multiple_operator_re = re.compile(r"[ &]+(&|\|)[ &]+")

    tokens = quoted_strings_re.split(term)
    processed_tokens = []
    for token in tokens:
        # Remove all surrounding whitespace.
        token = token.strip()

        if token in ['', "'"]:
            continue

        if token[0] != "'":
            # Surround single letters with &'s
            token = spaces_surrounding_letter_re.sub(r' & \1 & ', token)

            # Specify '&' between words that have neither | or & specified.
            token = space_between_words_re.sub(r'\1 & \2', token)

            # Add a prefix wildcard to every search term.
            token = re.sub(r'([^ &|]+)', r'\1:*', token)

        processed_tokens.append(token)

    term = " & ".join(processed_tokens)

    # Replace ampersands or pipes surrounded by ampersands.
    term = multiple_operator_re.sub(r" \1 ", term)

    # Escape single quotes
    return term.replace("'", "''")

class SIA:

    from beaker.cache import CacheManager
    from beaker.util import parse_cache_config_options

    cache = CacheManager(**parse_cache_config_options({
        'cache.type': 'file',
        'cache.data_dir': '/tmp/horariossiacache/data',
        'cache.lock_dir': '/tmp/horariossiacache/lock',
        'cache.regions': 'short_term, long_term',
        'cache.short_term.type': 'memory',
        'cache.short_term.expire': '3600',
        'cache.long_term.type': 'file',
        'cache.long_term.expire': '86400'
    }))

    def existsSubject(this,name,level):
        return this.queryNumSubjectsWithName(name,level)>0

    def queryNumSubjectsWithName(this,name,level):
        data = json.dumps({"method": "buscador.obtenerAsignaturas", "params": [name, level, "", level, "", "", 1, 1]})
        req = urllib2.Request(siaUrl + "/JSON-RPC", data, {'Content-Type': 'application/json'})
        try:
            f = urllib2.urlopen(req)
            result = json.loads(f.read())["result"]["totalAsignaturas"]
            f.close()
        except urllib2.HTTPerror, e:
            logging.warning('HTTPError = ' + str(e.code))
        except urllib2.URLError, e:
            logging.warning('URLError = ' + e.reason)
        except httplib.HTTPException, e:
            logging.warn('HTTPException')
        return result

    @cache.region('short_term')
    def querySubjectsByName(this,name,level,maxRetrieve):
        data = json.dumps({"method": "buscador.obtenerAsignaturas", "params": [name, level, "", level, "", "", 1, maxRetrieve]})
        req = urllib2.Request(siaUrl + "/JSON-RPC", data, {'Content-Type': 'application/json'})
        try:
            f = urllib2.urlopen(req)
            result = json.loads(f.read())
            f.close()
        except urllib2.HTTPerror, e:
            logging.warning('HTTPError = ' + str(e.code))
        except urllib2.URLError, e:
            logging.warning('URLError = ' + e.reason)
        except httplib.HTTPException, e:
            logging.warn('HTTPException')

        return result["result"]["asignaturas"]["list"]

    @cache.region('short_term')
    def queryGroupsBySubjectCode(this,code):
        data = json.dumps({"method": "buscador.obtenerGruposAsignaturas", "params": [code, "0"]})
        req = urllib2.Request(siaUrl + "/JSON-RPC", data, {'Content-Type': 'application/json'})
        result = None
        try:
            f = urllib2.urlopen(req)
            result = json.loads(f.read())
            f.close()
        except urllib2.HTTPError, e:
            logging.warning('HTTPError = ' + str(e.code))
        except urllib2.URLError, e:
            logging.warning('URLError = ' + e.reason)
        except httplib.HTTPException, e:
            logging.warn('HTTPException')
        if result:
            return result["result"]["list"]
        else:
            return []

    @staticmethod
    @cache.region('short_term')
    def queryGroupsProfessions(code,group):
        import re
        while True:
            try:
                f = urllib2.urlopen(siaUrl + "/service/groupInfo.pub?cod_asignatura=" + str(code) + "&grp=" + str(group))
                html = f.read().decode("ISO-8859-1")
                break
            except urllib2.URLError, e:
                if e.code == 403:
                    pass
                else:
                    logging.warning(str(e))
                    break
            except Exception, e:
                logging.warning(str(e))
                break

        relevantSection = re.compile(r'Los planes de estudio para los cuales se ofrece esta asignatura son:</p><div><ul class="modulelist">(.*)</ul></div>').findall(html)
        professions = []
        if (len(relevantSection)>0):
            professionsHtml = re.compile('<li><p>(.*?)</p></li>').findall(relevantSection[0])
            for i in professionsHtml:
                data = i.split("-")
                professions.append((data[0].strip(),re.compile('<em>(.*)</em>').findall("".join(data[1:]))[0]))
        return professions