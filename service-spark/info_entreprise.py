#!/usr/bin/env python3

from SPARQLWrapper import SPARQLWrapper, JSON
from pprint import pprint
import requests
import json

API_ENDPOINT = "https://www.wikidata.org/w/api.php"

nom_entreprise = "Ippon Technologie"

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

results1 = sparql.query().convert()

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

results2 = sparql2.query().convert()

res_dict = {}
if len(results1["results"]["bindings"])>0 :
    for x in results1["results"]["bindings"][0] :
        res_dict[x] = results1["results"]["bindings"][0][x]["value"]

if len(results2["results"]["bindings"])>0 :
    for x in results2["results"]["bindings"][0] :
        res_dict[x] = results2["results"]["bindings"][0][x]["value"]

obj_json = json.dumps(res_dict, sort_keys=True, indent=4, ensure_ascii=False)

print(obj_json)