lancement du site 

IL faut commencer par installer les modules node avec la commande :

-    npm install express mongodb body-parser hogan consolidate express-session https chart.js crypto multer

ouvrir un premier git et lancer la database avec la commande  :

-    mongod --dbpath fichier/data/  --> ou fichier est le path 


On lance ensuite le serveur avec les commande :

-    openssl req -x509 -newkey rsa:4096 -nodes -sha256 -keyout key.pem -out cert.pem -days 365

-    node server.js

Finalement, afin d'accéder au site :
  Taper https://localhost:8080/home dans la barre de recherche de votre navigateur.
  Vous serez redirigé vers une page de register afin de vous connecter au site

Pour vous connecter, vous pouvez utiliser :

-  Utilisateur : "Admin" 
-  Mot de passe : "Admin"





