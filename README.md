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

# Configurazione tra Android Emulator e backend
1) **Frontend**: in /app/_services modifica tutte le chiamate API per utilizzare:

```
const ANDROID_EMULATOR_BASE_URL = 'http://10.0.2.2:8080/api/auth/';
```   
2) **Backend**: nel relativo controller (es: activityController), andiamo a settare la politica di CORS nel modo seguente:

```
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:8080", "http://localhost:8081", "http://localhost:8100", "http://10.0.2.16", "http://10.0.2.16:8000/", "http://10.0.2.2:8000/", "http://localhost", "http://localhost/*", "http://localhost/register"}, allowCredentials = "true", allowedHeaders = "*")
```

3) **App nativa / Android studio**: in /app/manifests aggiungere ad <application>:

```
android:usesCleartextTraffic="true"
android:networkSecurityConfig="@xml/network_security_config"
```

3) **App nativa / Android studio**: in /app/res/xml/ crea il file network_security_config.xml:

```
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <base-config cleartextTrafficPermitted="true" />
</network-security-config>
```


# Todo-list

**TODO:**
- Quando vado a inserire una attività, posso inserirla solo se si svolgerà da qui a breve (es tra una settimana? qualche giorno?) non posso inserirla se avverrà tra un mese, ad esempio
- Quando mi sposto sulla mappa (al dragend), vado ad aggiornare la posizione in cui viene inserito ln marker

**Bugfix minori**
- Se clicco su un marker, e senza chiuderlo dalla x in alto a destra, riclicco sul marker, la modale non si apre più
- Distruggi la mappa e ricreala ogni volta che si torna sul tab /home per evitare alcuni problemi di visualizzaizone su android
