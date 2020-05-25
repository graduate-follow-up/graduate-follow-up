# Graduate Follow-up

EISTI academic project


# Comment dev sur ce projet avec git !

Il existe 3 types de branches :

- __master__ : la branche de production, reçoit des merge depuis la branche __dev__. Elle contient les versions de l'applications lorsque l'on atteint une nouvelle version de l'application stable dans la branche __dev__.
- __dev__ : cette branche reçoit toutes les nouvelles features qui sont terminées. Les développeurs doivent merge leur feature dès que celle-ci est complétement implémentée.
- __features__ : Il n'y a pas de branche nommée "features". Mais dès que vous voulez implémenter une nouvelle fonctionnalité, vous devez créer une nouvelle branche depuis la branche __dev__ en la nommant judicieusement. 
Exemple : `git checkout -b service-user_api-rest`


## Getting Started

Clone le projet :

```sh
$ git clone git@github.com:graduate-follow-up/graduate-follow-up.git
```

Se rendre sur la branche __dev__ :

```sh
$ git checkout dev
```

Créer une nouvelle branch pour votre feature :

```sh
$ git checkout -b service-user_mongo
```

*Dev ce que vous voulez...*

Pushez vos modifications régulièrement même si ce n'est pas fini et que ça compile pas : 
```sh
$ git pull
$ git add -A
$ git commit -m "[service] Un message tout à fait intéressant"
$ git push --set-upstream origin service-user_mongo
```

Uns fois la feature finie, revenez sur dev et mergez votre features

```sh
$ git checkout dev
$ git pull
$ git merge service-user_mongo 
$ git push origin dev
```

Et voilà ! Vous avez ajouté une feature au projet ;)

Si jamais, vous pouvez toujours revenir sur la branche si vous voulez faire des améliorations, juste redéplacez vous dans la branche features :

```sh
$ git checkout service-user_mongo
```


