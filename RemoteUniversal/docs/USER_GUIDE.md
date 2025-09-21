# 📱 Guide Utilisateur - RemoteUniversal

## 🎯 Introduction

RemoteUniversal est une télécommande universelle intelligente qui vous permet de contrôler toutes vos TVs, qu'elles soient smart ou non, via WiFi ou infrarouge.

## ✨ Fonctionnalités Principales

### 🔍 Découverte Automatique
- **Scan WiFi** : Détection automatique des TVs connectées au réseau
- **Support multi-marques** : Samsung, LG, Sony, Philips, Roku
- **Connexion instantanée** : Connexion en un clic

### 🎮 Contrôles Basiques
- **Allumer/Éteindre** : Bouton power principal
- **Volume** : Augmenter, diminuer, couper le son
- **Chaînes** : Navigation haut/bas, chaînes favorites
- **Sources d'entrée** : HDMI, USB, AV, etc.
- **Navigation** : Boutons directionnels et OK

### 🎤 Contrôle Vocal
- **Commandes en français** : "Allume la télé", "Augmente le volume"
- **Reconnaissance intelligente** : Comprend les variations de langage
- **Commandes personnalisables** : Ajoutez vos propres commandes

### 👆 Trackpad Virtuel
- **Gestes intuitifs** : Swipe, tap, long press
- **Navigation fluide** : Contrôle précis du curseur
- **Feedback haptique** : Sensations tactiles

### ⚙️ Automatisations
- **Programmation temporelle** : Allumage/extinction automatique
- **Déclencheurs multiples** : Heure, voix, gestes
- **Notifications** : Rappels et confirmations

## 🚀 Première Utilisation

### 1. Installation
```bash
# Cloner le repository
git clone https://github.com/your-username/remote-universal.git
cd remote-universal

# Installer les dépendances
npm install

# Démarrer l'application
npm start
```

### 2. Configuration Initiale
1. **Lancer l'application** sur votre téléphone
2. **Autoriser les permissions** (WiFi, microphone, notifications)
3. **Scanner les TVs** en appuyant sur "Scanner les TVs"
4. **Sélectionner votre TV** dans la liste

### 3. Première Connexion
1. **Choisir le type de connexion** :
   - **WiFi** : Pour les smart TVs
   - **IR** : Pour les TVs classiques
2. **Tester la connexion** avec le bouton power
3. **Sauvegarder le profil** si la connexion fonctionne

## 🎮 Utilisation des Contrôles

### Contrôles Basiques
- **Bouton Power** : Allumer/éteindre la TV
- **Volume +/-** : Ajuster le volume
- **Mute** : Couper/remettre le son
- **Chaînes +/-** : Changer de chaîne
- **Sources** : Sélectionner l'entrée (HDMI, USB, etc.)

### Contrôle Vocal
1. **Appuyer sur le bouton micro** 🎤
2. **Parler clairement** votre commande
3. **Attendre la confirmation** visuelle
4. **La commande s'exécute** automatiquement

**Commandes vocales disponibles :**
- "Allume la télé" / "Éteint la télé"
- "Augmente le volume" / "Diminue le volume"
- "Coupe le son" / "Remet le son"
- "Chaîne suivante" / "Chaîne précédente"
- "Valide" (bouton OK)

### Trackpad Virtuel
1. **Activer les contrôles avancés** (bouton "Avancé")
2. **Utiliser le trackpad circulaire** :
   - **Swipe haut/bas** : Navigation verticale
   - **Swipe gauche/droite** : Changement de chaîne
   - **Tap** : Sélection/OK
   - **Long press** : Menu contextuel

## ⚙️ Automatisations

### Créer une Automatisation
1. **Aller dans l'écran de contrôle** de votre TV
2. **Appuyer sur "Automatisations"** ⚙️
3. **Créer une nouvelle automatisation** :
   - **Nom** : "Allumage matinal"
   - **Déclencheur** : Temps
   - **Horaire** : 07:00
   - **Action** : power_on
   - **Activé** : Oui

### Types d'Automatisations
- **Temporelles** : Exécution à une heure précise
- **Vocales** : Déclenchement par commande vocale
- **Gestuelles** : Activation par geste sur le trackpad

### Gestion des Automatisations
- **Modifier** : Appuyer sur "Modifier"
- **Activer/Désactiver** : Utiliser le switch
- **Supprimer** : Appuyer sur "Supprimer"

## 🔧 Configuration Avancée

### Profils TV
- **Sauvegarde automatique** : Les profils sont sauvegardés localement
- **Codes IR personnalisés** : Ajoutez vos propres codes
- **Paramètres spécifiques** : Volume par défaut, chaînes favorites

### Commandes Personnalisées
1. **Aller dans les paramètres** de la TV
2. **Sélectionner "Commandes vocales"**
3. **Ajouter une commande** :
   - **Phrase** : "Netflix"
   - **Action** : "source_hdmi1"
4. **Sauvegarder**

### Intégration Smart Home
- **Home Assistant** : Support des webhooks
- **IFTTT** : Intégration avec d'autres services
- **Alexa/Google** : Commandes vocales externes

## 🐛 Résolution de Problèmes

### Problèmes de Connexion
- **Vérifier le WiFi** : Assurez-vous que le téléphone et la TV sont sur le même réseau
- **Redémarrer l'application** : Fermer et relancer l'app
- **Vérifier les permissions** : WiFi, microphone, notifications

### Commandes Vocales
- **Parler clairement** : Éviter le bruit de fond
- **Attendre la confirmation** : Ne pas répéter la commande
- **Vérifier le microphone** : Autoriser l'accès au micro

### Trackpad
- **Gestes nets** : Éviter les mouvements tremblants
- **Surface propre** : Nettoyer l'écran si nécessaire
- **Calibrage** : Redémarrer l'application

### Automatisations
- **Vérifier les permissions** : Notifications autorisées
- **Heure système** : Vérifier que l'heure est correcte
- **Batterie** : Éviter l'optimisation de batterie

## 📞 Support

### Documentation
- **README.md** : Documentation technique
- **API Reference** : Documentation des services
- **Changelog** : Historique des versions

### Communauté
- **GitHub Issues** : Signaler des bugs
- **Discussions** : Poser des questions
- **Wiki** : Guides et tutoriels

### Contact
- **Email** : support@remoteuniversal.com
- **GitHub** : @remoteuniversal
- **Twitter** : @RemoteUniversal

## 🔄 Mises à Jour

### Vérification des Mises à Jour
L'application vérifie automatiquement les mises à jour disponibles.

### Installation des Mises à Jour
1. **Télécharger** la nouvelle version
2. **Sauvegarder** vos profils (export)
3. **Installer** la mise à jour
4. **Restaurer** vos profils (import)

## 📋 Changelog

### Version 1.0.0 (21/09/2025)
- ✅ Découverte automatique des TVs
- ✅ Contrôles basiques (power, volume, chaînes)
- ✅ Commandes vocales en français
- ✅ Trackpad virtuel avec gestes
- ✅ Automatisations programmables
- ✅ Support multi-marques
- ✅ Interface moderne et intuitive

---

**RemoteUniversal** - Votre télécommande universelle intelligente 🎮✨
