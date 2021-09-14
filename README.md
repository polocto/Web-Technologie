# Web-Technologie
Cours de Web Technology ING 4

# Prérequis
- Lire l'index suivant
> https://github.com/adaltas/ece-webtech-2021-fall/blob/master/webtech/00.prerequisite/index.md

# Cours
- Liens pratiques
> https://github.com/adaltas/ece-webtech-2021-fall

# Règle Git

>**Avant de commit __vérifiez__** qu'il n'y ni de fichiers ni de dossier comprenant des fichiers propre à votre IDE. Si celà venait à arriver toujours **avant de commit**, ajouter le nom du dossier ou le nom de fichier avec son extention : 
>- _nom_fichier.extention_ pour un fichier particulier.
>- _*.extention_ pour ignorer tout les fichier d'une même extention
>- _nom_dossier_ pour ignorer le dossier

> Les actions ci-dessus sont pour des fichiers ou dossiers ce trouvant dans le même sous-dossier que le gitignore. Si vous souhaitez ignorer un fichier dans un autre sous-dossier il faudra y indiquer le chemin depuis le .gitignore.

Toutes modifications ou ajout sur le code doit être accompagner d'un __commentaire__.

**Aucune modification** n'est censé être faites **sur la branche principal 'main'**. L'ensemble du _développement est en parallèle_ sur une branche développe où se trouve des partie de code fonctionnel. Lorsque le code sur la branche développe sera fonctionnel et prêt à l'emploi, alors il sera mit sur la branche principale.

Les modification mineur (ajout de commentaires, de points virgules...), peuvent être directement effectué depuis la branche développe. Lors d'autre modification plus conséquente risquant d'entraîner des bugs (corrections de bugs, ajout de nouvelles fonctions...) devront être fait sur une autre branche et suivre la procédure suivante : 

> - **Créé une nouvelle branche** ayant pour nom un mot clef X correspondant aux modifications intentionnelles
> - Modifié le code
> - _Vérifier que celui-ci est fonctionnel_
> - **Merge Developpe dans la branche X**
> - Gérer les conflits sur la branche X que celles ci pourrait avoir avec développe au cas où d'autres programmeurs est apporté des modifications à Developpe entre temps
> - Vérifier à nouveau que le code fonctionne (compile correctement suffira)
> - Enfin **merge X dans Developpe** après modifications
> - Supprimer X si plus nécessaire ou conserver X si d'autres modifications du même type à effectuer et recommencer
