# Acty
Map using Leaflet made with:

Ionic **7.2.0** <br>
Angular **17.2** <br>
NodeJS **21.6.2** <br>


# Buildare app per Android

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
[Guida di capacitor per altre info](https://ionicframework.com/docs/angular/your-first-app/deploying-mobile).

TODO:
- Quando vado a inserire una attività, posso inserirla solo se si svolgerà da qui a breve (es tra una settimana? qualche giorno?) non posso inserirla se avverrà tra un mese, ad esempio

FIX
- Se clicco su un marker, e senza chiuderlo dalla x in alto a destra, riclicco sul marker, la modale non si apre più



