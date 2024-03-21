import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.BounceMarker';
import {ActivityService} from '../_services/activity.service';
import {ModalController} from '@ionic/angular';
import {ActivityModalComponent} from '../activity-modal/activity-modal.component';
import {Marker} from "leaflet";
import {ViewActivityModalComponent} from "../view-activity-modal/view-activity-modal.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  map!: L.Map;
  content?: string;
  markersToAdd: { id: number, marker: L.Marker }[] = [];
  markers: L.Marker[] = [];
  popupButtonId = 'activityButton';
  viewPopupButtonId = 'viewActivityButton';
  zoomThreshold = 13
  currentPosition!: L.LatLng;

  constructor(private activityService: ActivityService, private modalController: ModalController) {
  }

  ngOnInit() {
    this.initMap();
    this.watchPosition();
  }

  initMap() {
    if (!navigator.geolocation) {
      console.log('Location not supported');
      return;
    }

    //TODO: distruggi la mappa ogni volta che viene chiamata questa funzione per evitare problemi

    navigator.geolocation.getCurrentPosition((position) => {
      const coord = position.coords;

      this.map = L.map('mapId').setView([coord.latitude, coord.longitude], 20);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      // Aggiungi event listener per gestire il caricamento dei marker in base alla posizione e allo zoom
      this.map.on('moveend', () => {
        this.loadMarkers();

        //Teniamo traccia della posizione in cui ci spostiamo lungo la mappa
        this.currentPosition = this.map.getBounds().getCenter()
      });

      this.map.on('zoomend', () => {
        this.loadMarkers();
        //Teniamo traccia della posizione in cui ci spostiamo lungo la mappa
        this.currentPosition = this.map.getBounds().getCenter()
      });

      // Carica i marker iniziali
      this.loadMarkers();

      localStorage.setItem('longitude_marker', coord.longitude.toString());
      localStorage.setItem('latitude_marker', coord.latitude.toString());
    });
  }

  //TODO: capire cosa fare con questa
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

  loadMarkers() {
    const bounds = this.map.getBounds();

    // Ottieni i limiti attuali della mappa
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();

    // Chiamata al servizio per ottenere i dati solo se lo zoom è maggiore o uguale a quello desiderato
    if (this.map.getZoom() >= this.zoomThreshold) {
      this.activityService.getActivitesByBounds(
        northEast.lat,
        northEast.lng,
        southWest.lat,
        southWest.lng
      ).subscribe({
        next: (data: any[]) => {
          console.log("Dati ricevuti:", data);

          // Creazione di un nuovo set per memorizzare i marker da mantenere
          const newMarkers = new Set<Marker<any>>();

          // Iterazione sui dati ricevuti per aggiungere i nuovi marker
          data.forEach((activity: any) => {
            // Verifica se il marker è già presente nella mappa
            const existingMarker = this.findExistingMarker(activity);
            if (existingMarker) {
              newMarkers.add(existingMarker);
            } else {
              const marker = L.marker([activity.latitudine, activity.longitudine]).addTo(this.map);

              marker.on('click', (e: L.LeafletMouseEvent) => {
                this.showPopupContent(e, activity);
              });

              newMarkers.add(marker);
            }
          });

          // Rimozione dei marker non più visibili
          this.markers.forEach(marker => {
            if (!newMarkers.has(marker)) {
              this.map.removeLayer(marker);
            }
          });

          // Aggiornamento della lista dei marker
          this.markers = Array.from(newMarkers);
        },
        error: err => {
          console.log("Errore durante il recupero dei dati:", err);
        }
      });
    } else {
      // Rimuovi tutti i marker se lo zoom non è sufficiente
      this.markers.forEach(marker => {
        this.map.removeLayer(marker);
      });
      this.markers = [];
    }
  }

  findExistingMarker(activity: any): Marker<any> | undefined {
    // Cerca un marker esistente che corrisponda all'attività specificata
    return this.markers.find(marker =>
      marker.getLatLng().lat === activity.latitudine && marker.getLatLng().lng === activity.longitudine
    );
  }

  //Aggiunge un marker nella mappa
  addMarker() {
    // Aggiungiamo un marker al centro della posizione che sta guardando attualmente l'utente
    const markerPosition = new L.LatLng(this.currentPosition.lat, this.currentPosition.lng);

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

    const markerId = this.markersToAdd.length; // Assign unique id to marker
    this.markersToAdd.push({id: markerId, marker});

    marker.on('click', (e: L.LeafletMouseEvent) => {
      this.updatePopupContent(e, markerId);
    });

    marker.addTo(this.map);
  }

  // Aggiorna dinamicamente un popup di un marker con le sue coordinate per poi passarle alla modale
  updatePopupContent(e: L.LeafletMouseEvent, markerId: number) {
    const eventTarget = e.target as L.Marker;
    const markerPosition = eventTarget.getLatLng();
    const markerLatitude = markerPosition.lat
    const markerLongitude = markerPosition.lng

    const popupContent = `
      <p>Latitude: ${markerLatitude}</p>
      <p>Longitude: ${markerLongitude}</p>
      <ion-button id="${this.popupButtonId}${markerId}">Default</ion-button>
    `;

    const popupOptions = {
      closeButton: true,
      maxWidth: 400,
      minWidth: 150
    };

    if (eventTarget.getPopup()) {
      eventTarget.unbindPopup();
    }

    const popup = L.popup(popupOptions).setContent(popupContent);
    eventTarget.bindPopup(popup);
    eventTarget.openPopup();

    const button = document.getElementById(`${this.popupButtonId}${markerId}`);
    if (button) {

      // Rimuovi il listener dell'evento se già presente
      button.removeEventListener('click', () => {
        console.log("Button clicked");
        this.openAddActivityModal(markerLatitude, markerLongitude);
      });

      button.addEventListener('click', () => {
        console.log("Button clicked");
        this.openAddActivityModal(markerLatitude, markerLongitude);
      });
    }
  }

  // Mostra il contenuto di un marker scaricato dal DB
  showPopupContent(e: L.LeafletMouseEvent, activity: any) {
    const eventTarget = e.target as L.Marker;

    const popupContent = `pippo anche topolino
      <ion-button id="${this.popupButtonId}">View activity</ion-button>
    `;

    const popupOptions = {
      closeButton: true,
      maxWidth: 400,
      minWidth: 150
    };

    if (eventTarget.getPopup()) {
      eventTarget.unbindPopup();
    }

    const popup = L.popup(popupOptions).setContent(popupContent);
    eventTarget.bindPopup(popup);
    eventTarget.openPopup();

    const button = document.getElementById(`${this.popupButtonId}`);
    if (button) {
      button.addEventListener('click', () => {
        console.log("Button clicked");
        this.openViewActivityModal(activity);
      });
    }
  }

  // Apre una finestra modale per visualizzzare un evento (passando i dettagli di una attività)
  async openViewActivityModal(activity: any) {
    const modal = await this.modalController.create({
      component: ViewActivityModalComponent,
      componentProps: {
        activity
      }
    });
    return await modal.present();
  }

  //Apre la finestra modale per aggiungere dei marker
  async openAddActivityModal(latitude: number, longitude: number) {
    const modal = await this.modalController.create({
      component: ActivityModalComponent,
      componentProps: {
        latitude: latitude,
        longitude: longitude
      }
    });
    return await modal.present();
  }
}
