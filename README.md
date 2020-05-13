# Graduate Follow-up

EISTI academic project

# Déployer projet en local : 
Avant de déployer ; s'assurer que les volumes docker existants en cas de build ultérieurs ne vont pas géner l'exécution. 
Dans ce cas : 
```sh
$ docker volume rm [volumes graduate_follow_up]
```
Ensuite, déployez le projet : 
```sh
$ docker-compose build
$ docker-compose up
```

# Comment dev sur ce projet avec git !

Il existe 3 types de branches :

- __master__ : la branch de production, reçoit des merge depuis la branch __dev__. Elle contient les versions de l'applications lorsque l'on atteint une nouvelle version de l'application stable dans la branch __dev__.
- __dev__ : cette branch reçoit toutes les nouvelles features qui sont terminés. Les développeurs doivent merge leur feature dès que celle-ci est complétement implémentée
- __features__ : Il n'y a pas de branch nommé "features". Mais dès que vous voulez implémenter une nouvelle fonctionnalité, vous devez créer une nouvelle branch depuis la branch __dev__ en la nommant judicieusement. 
Exemple : `git checkout -b service-user_api-rest`


## Getting Started

Clone le projet :

```sh
$ git clone git@github.com:graduate-follow-up/graduate-follow-up.git
```

Se rendre sur la branch __dev__ :

```sh
$ git checkout dev
```

Créer une nouvelle branch pour votre features :

```sh
$ git checkout -b service-user_mongo
```

*Dev ce que vous voulez...*

Pusher vos modifications régulièrement même si ce n'est pas fini et que ça compile pas : 
```sh
$ git pull
$ git add -A
$ git commit -m "[service] Un message tout à fait intéressant"
$ git push --set-upstream origin service-user_mongo
```

Uns fois la feature fini, revenez sur dev et merge votre features

```sh
$ git checkout dev
$ git pull
$ git merge service-user_mongo 
$ git push origin dev
```

Et voilà ! vous avez ajouter une feature au projet ;)

Si jamais, vous pouvez toujours revenir sur la branch si vous voulez faire des améliorations, juste redéplacez vous dans la branch features :

```sh
$ git checkout service-user_mongo
```


