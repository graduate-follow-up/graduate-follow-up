# README

EISTI academic project


# Comment dev sur ce projet avec git !

Il existe 3 types de branch :

- __master__ : la branch de production, reçoit des merge depuis la branch __dev__. Elle contient les versions de l'applications lorsque l'on atteint une nouvelle version de l'application stable dans la branch __dev__.
- __dev__ : cette branch reçoit toutes les nouvelles features qui sont terminés. Les développeurs doivent merge leur feature dès que celle-ci est complétement implémentée
- __features__ : Il n'y a pas de branch nommé "features". Mais dès que vous voulez implémenter une nouvelle fonctionnalité, vous devez créer une nouvelle branch depuis la branch __dev__ en la nommant judicieusement. Exemple : * git checkout -b service-user_api-rest* 
