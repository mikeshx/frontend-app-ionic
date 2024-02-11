import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.BounceMarker';
import { MarkerService } from '../_services/marker.service';
import {AuthService} from "../_services/auth.service";
import {StorageService} from "../_services/storage.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})



export class HomePage implements OnInit {
  map!: L.Map;

  constructor(private markerService: MarkerService) { }

  ngOnInit() {
    // Inizializza la mappa e imposta la vista
    this.initMap();

    // Avvia il watch della posizione dell'utente
    this.watchPosition();
  }

  // Inizializza la mappa e imposta la vista
  initMap() {
    if (!navigator.geolocation) {
      console.log('Location not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const coord = position.coords;

      this.map = L.map('mapId').setView([coord.latitude, coord.longitude], 20);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">MOpenStreetap</a> contributors'
      }).addTo(this.map);

      localStorage.setItem('longitude_marker', coord.longitude.toString());
      localStorage.setItem('latitude_marker', coord.latitude.toString());
    });
  }

  // Avvia il watch della posizione dell'utente
  watchPosition() {
    navigator.geolocation.watchPosition((position) => {
      console.log(`lat: ${position.coords.latitude}, lon: ${position.coords.longitude}`);
    }, (err) => {
      console.log(err);
    }, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000
    });
  }

  // Aggiunge un marker alle coordinate specificate
  addMarker() {
    const markerLatitude = Number(localStorage.getItem('latitude_marker'));
    const markerLongitude = Number(localStorage.getItem('longitude_marker'));
    const markerPosition = new L.LatLng(markerLatitude, markerLongitude);

    const mapIcon = L.icon({
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png',
      popupAnchor: [13, 0],
    });

    const marker = L.marker(markerPosition, {
      icon: mapIcon,
      draggable: true,
      bounceOnAdd: true
    });

    // Aggiunge l'evento click per aprire il popup
    marker.on('click', this.updatePopupContent.bind(this));
    this.map.addLayer(marker);
  }

  // Aggiorna il contenuto del popup quando viene aperto
  updatePopupContent(e: L.LeafletEvent) {
    const eventTarget = e.target as L.Marker;
    const popupContent = '<ion-button (click)="createActivity()">Default</ion-button>';

    const popupOptions = {
      closeButton: true,
      maxWidth: 400,
      minWidth: 140
    };

    // Rimuove il popup precedente se esiste
    if (eventTarget.getPopup()) {
      eventTarget.unbindPopup();
    }

    // Crea un nuovo popup e aggiungilo al marker
    const popup = L.popup(popupOptions).setContent(popupContent);
    eventTarget.bindPopup(popup);

    // Riapre il popup dopo aver spostato il marker
    eventTarget.openPopup();
  }

  //Utilizza il service per crere un attività
  createActivity() {
    this.markerService.getMarker()
  }
}
