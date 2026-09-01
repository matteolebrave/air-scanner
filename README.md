# Air Scanner

Application web permettant de rechercher les aéronefs présents dans une zone géographique à partir de coordonnées GPS et d'un rayon.

## Présentation

Air Scanner est une application web développée en Python permettant d'effectuer une recherche d'aéronefs à partir d'une position géographique et d'un rayon défini par l'utilisateur.

L'application s'appuie sur Flask pour assurer la communication entre la logique Python et l'interface web. Les résultats sont ensuite présentés sous forme de liste et de marqueurs interactifs sur une carte Leaflet.

## Technologies utilisées

| Technologie | Rôle |
|---|---|
| Python | Logique de traitement et récupération des données |
| Flask | Serveur web et communication avec l'interface |
| HTML / CSS / JavaScript | Interface utilisateur |
| Leaflet | Affichage et interaction avec la carte |
| OpenSky Network | Source des données aéronautiques |

## Architecture du projet

```text
AirScanner/
│
├── main.py
├── Logic/
│   └── logic.py
├── templates/
│   └── index.html
├── static/
│   └── Avion.png
├── apiResponse.json
└── README.md
```

### Rôle des principaux fichiers

- `main.py` : point d'entrée de l'application Flask et gestion des requêtes HTTP.
- `Logic/logic.py` : logique de recherche et récupération des données aéronautiques.
- `templates/index.html` : interface web.
- `static/Avion.png` : icône utilisée pour représenter les aéronefs sur la carte.
- `apiResponse.json` : fichier contenant les données récupérées par la logique du scanner.
- `README.md` : documentation du projet.

## Installation

### Prérequis

Python 3 doit être installé sur la machine.

Vérifier l'installation avec :

```bash
python --version
```

Selon l'environnement, la commande peut également être :

```bash
python3 --version
```

### Installation de Flask

Installer Flask avec :

```bash
pip install flask
```

Ou, selon l'environnement :

```bash
pip3 install flask
```

## Lancement de l'application

Depuis le dossier principal du projet, exécuter :

```bash
python main.py
```

Le serveur Flask est alors accessible à l'adresse :

`http://127.0.0.1:5000`

Ouvrir cette adresse dans un navigateur pour accéder à l'application.

## Fonctionnement

L'utilisateur renseigne les paramètres suivants :

- Latitude
- Longitude
- Rayon de recherche (`radius`)

Après avoir cliqué sur **LANCER LE SCAN**, le navigateur envoie une requête à Flask :

```text
/scan?latitude=...&longitude=...&radius=...
```

Flask récupère ensuite les paramètres :

```python
LATITUDE = float(request.args.get("latitude"))
LONGITUDE = float(request.args.get("longitude"))
RADIUS = float(request.args.get("radius"))
```

La logique du scanner est appelée avec les valeurs reçues :

```python
start(LATITUDE, LONGITUDE, RADIUS)
```

La fonction `start()` récupère les données aéronautiques et génère le fichier :

```text
apiResponse.json
```

Flask lit ensuite ce fichier :

```python
with open("apiResponse.json", "r", encoding="utf-8") as fichier:
    avions = json.load(fichier)
```

Les données sont finalement retournées au navigateur au format JSON.

## Flux de communication

```text
Navigateur
    |
    | latitude / longitude / radius
    v
  Flask
    |
    v
  start()
    |
    v
 OpenSky
    |
    v
apiResponse.json
    |
    v
  Flask
    |
    | JSON
    v
Navigateur
    |
    +-- Liste des avions
    |
    +-- Carte Leaflet
```

Le navigateur communique avec Flask grâce à JavaScript et à l'API `fetch()` :

```javascript
const response = await fetch(
    "/scan?latitude=" + latitude +
    "&longitude=" + longitude +
    "&radius=" + radius
);

const data = await response.json();
```

## Affichage cartographique

La carte interactive est basée sur Leaflet.

Chaque aéronef est représenté par l'image :

```text
static/Avion.png
```

Les coordonnées GPS de chaque aéronef sont utilisées pour positionner son marqueur :

```javascript
[
    avion["latitude"],
    avion["longitude"]
]
```

La carte permet ainsi de visualiser directement la position des aéronefs retournés par le scan.

## Orientation des aéronefs

L'orientation de chaque avion est déterminée à partir de la valeur :

```javascript
avion["true_track"]
```

La convention utilisée est la suivante :

```text
0°   = Nord
90°  = Est
180° = Sud
270° = Ouest
```

L'image `Avion.png` doit donc être orientée vers le **Nord** lorsque sa rotation est de `0°`.

## Mode développement

Le serveur Flask est actuellement lancé avec :

```python
app.run(debug=True)
```

Le mode `debug` est adapté au développement. Il permet notamment :

- d'afficher les erreurs directement dans le terminal ;
- de faciliter le diagnostic des problèmes ;
- de redémarrer automatiquement le serveur lors de certaines modifications.

Pour un environnement de production, le mode debug ne doit pas être utilisé.

## Problèmes courants

### Page blanche

Vérifier que le fichier `index.html` se trouve bien dans :

```text
templates/index.html
```

Vérifier également que Flask est lancé depuis le dossier principal du projet.

### Image de l'avion absente

Vérifier que l'image est bien présente à l'emplacement :

```text
static/Avion.png
```

Le HTML doit référencer l'image avec :

```html
<img src="/static/Avion.png">
```

### `apiResponse.json` introuvable

Vérifier que la fonction `start()` génère bien :

```text
apiResponse.json
```

Vérifier également que le chemin utilisé dans `main.py` correspond à l'emplacement réel du fichier.

### Erreur pendant le scan

Consulter le terminal dans lequel Flask est lancé afin d'identifier l'erreur retournée.

Les paramètres reçus peuvent notamment être contrôlés avec :

```text
Latitude : ...
Longitude : ...
Radius : ...
```

Vérifier également la disponibilité du service OpenSky Network et la validité des coordonnées fournies.

## Architecture actuelle

```text
Interface Web
      |
      v
    Flask
      |
      v
Logique Python
      |
      v
   OpenSky
      |
      v
apiResponse.json
      |
      v
    Flask
      |
      v
Interface Web
      |
      v
   Leaflet
```

Cette architecture sépare les principales responsabilités du projet :

1. L'interface web collecte les paramètres de recherche.
2. Flask reçoit et transmet ces paramètres.
3. La logique Python effectue le traitement.
4. OpenSky Network fournit les données aéronautiques.
5. Les résultats sont stockés dans `apiResponse.json`.
6. Flask retourne les données au navigateur.
7. JavaScript affiche les résultats dans l'interface et sur la carte Leaflet.

## État du projet

**Statut : en développement**

Le projet a pour objectif de remplacer progressivement l'ancienne interface Tkinter par une interface web moderne, tout en conservant la logique Python existante.

Les évolutions futures pourront notamment porter sur :

- l'amélioration de l'interface utilisateur ;
- la gestion plus robuste des erreurs ;
- l'optimisation de la récupération des données ;
- l'amélioration de l'affichage des aéronefs sur la carte ;
- la réduction de la dépendance au fichier intermédiaire `apiResponse.json` ;
- la séparation plus poussée entre l'API Flask, la logique métier et l'interface.

## Licence

Aucune licence spécifique n'est actuellement définie pour ce projet.
