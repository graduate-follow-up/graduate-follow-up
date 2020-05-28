#!/usr/bin/env python3

from SPARQLWrapper import SPARQLWrapper, JSON
import requests
import json
from flask import Flask

app = Flask(__name__)


def send_sarpql_wiki (nom_entreprise) :
    API_ENDPOINT = "https://www.wikidata.org/w/api.php"
    params = {
      'action': 'wbsearchentities',
       'format': 'json',
      'language': 'fr',
      'search': nom_entreprise
    }

    r = requests.get(API_ENDPOINT, params = params)

    id_entreprise = r.json()['search'][0]['id']


    #requete wikidata
    endpoint = "https://query.wikidata.org/bigdata/namespace/wdq/sparql"


    sparql = SPARQLWrapper(endpoint)
    sparql.setQuery("""
    SELECT ?hqLabel ?directeurLabel ?domaineLabel  ?caLabel ?siteLabel WHERE {{
        OPTIONAL { wd:"""+id_entreprise+""" wdt:P159 ?hq. }
        OPTIONAL { wd:"""+id_entreprise+""" wdt:P1037 ?directeur. }
        OPTIONAL { wd:"""+id_entreprise+""" wdt:P101 ?domaine. }
        OPTIONAL { wd:"""+id_entreprise+""" wdt:P2139 ?ca. }
        OPTIONAL { wd:"""+id_entreprise+""" wdt:P856 ?site. }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],fr". }
        }}
    """)

    sparql.setReturnFormat(JSON)

    return sparql.query().convert()

def send_sarpql_dbpedia (nom_entreprise) :

    #requete dbpedia
    sparql2 = SPARQLWrapper("http://dbpedia.org/sparql")
    sparql2.setReturnFormat(JSON)
    sparql2.setQuery("""
    SELECT  ?nom ?resume ?lieu ?nbemploye   WHERE {{
        ?entreprise a  <http://dbpedia.org/ontology/Company> .
        ?entreprise rdfs:label ?nom . FILTER(LANG(?nom) = "fr") .
        FILTER(STRSTARTS(?nom, "%s")) .
        OPTIONAL{ ?entreprise dbo:abstract ?resume}
        OPTIONAL{ ?entreprise dbo:location ?lieu}
        OPTIONAL{ ?entreprise dbo:numberOfEmployees ?nbemploye}
        }}LIMIT 1
    """%(nom_entreprise))

    return sparql2.query().convert()

def get_json_result(dict1,dict2):
    res_dict = {}
    if len(dict1["results"]["bindings"])>0 :
        for x in dict1["results"]["bindings"][0] :
            res_dict[x] = dict1["results"]["bindings"][0][x]["value"]

    if len(dict2["results"]["bindings"])>0 :
        for x in dict2["results"]["bindings"][0] :
            res_dict[x] = dict2["results"]["bindings"][0][x]["value"]

    return json.dumps(res_dict, sort_keys=True, indent=4, ensure_ascii=False)

@app.route("/<nomEntreprise>", methods = ["GET"])
def main(nomEntreprise):
    return get_json_result(send_sarpql_dbpedia(nomEntreprise),send_sarpql_wiki(nomEntreprise))


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=80)