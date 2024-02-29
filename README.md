# Acty
Map using Leaflet made with:

Ionic: **7.2.0** <br>
Angular: **17.2** <br>
NodeJS: **21.6.2** <br>


# Buildare app per Android

1) **Elimina tutto il contenuto della cartella /android**

Aggiorna capacitor

```
npx cap update
```   

Aggiungi la piattaforma android da capacitor
```
npx cap add android
```

Builda il progetto ionic
```
ionic build
```

Copia la build corrente nell'app nativa in */android* e */ios*

```
ionic cap copy
```
Se si modifica anche il codice nativo:

```
ionic cap sync
```

Esegui l'app con android studio:
```
npx cap open android
```

# Link e guide utili

1) [Guida di capacitor per altre info](https://ionicframework.com/docs/angular/your-first-app/deploying-mobile)
2) [Template usato per login registrazione](https://github.com/juned-adenwalla/Ionic-Angular-Login-Template)
3) [Spring boot backend](https://github.com/bezkoder/spring-boot-login-example)

# Impostazioni utili

Geolocalizzazione: 
**in /src/app/AndroidManifest.xml**

```
 <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

# Todo-list

**TODO:**
- Quando vado a inserire una attività, posso inserirla solo se si svolgerà da qui a breve (es tra una settimana? qualche giorno?) non posso inserirla se avverrà tra un mese, ad esempio
- Quando mi sposto sulla mappa (al dragend), vado ad aggiornare la posizione in cui viene inserito ln marker

**Bugfix minori**
- Se clicco su un marker, e senza chiuderlo dalla x in alto a destra, riclicco sul marker, la modale non si apre più

**Decisioni da prendere**

- Uso il footer in tutte le pagine(o lo tolgo da registrazione?)
