import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.BounceMarker';
import {ActivityService} from '../_services/activity.service';
import {LoadingController, ModalController} from '@ionic/angular';
import {ActivityModalComponent} from '../activity-modal/activity-modal.component';
import {Marker} from "leaflet";
import {ViewActivityModalComponent} from "../view-activity-modal/view-activity-modal.component";
import { StorageService } from '../_services/storage.service';
import { Router } from '@angular/router';

interface CustomMarker {
  id: number;
  marker: L.Marker;
}

// Definisci markers come array di oggetti CustomMarker


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  map!: L.Map;
  content?: string;
  markersToAdd: { id: number, marker: L.Marker }[] = [];

  popupButtonId = 'activityButton';
  viewPopupButtonId = 'viewActivityButton';
  zoomThreshold = 13
  currentPosition!: L.LatLng;

  //Array in cui mettiamo i marker scaricati dal DB
  markers: CustomMarker[] = [];
  isLoading: boolean = false;

  constructor(private router: Router, private storageService: StorageService, private activityService: ActivityService,
              private modalController: ModalController, private loadingController: LoadingController) {
  }

  async ngOnInit() {
      const loading = await this.loadingController.create({
        message: 'Loading map...'
      });
      await loading.present();

      try {
        await this.initMap();
      } catch (error) {
        console.error('An error occurred while initializing the map:', error);
      } finally {
        await loading.dismiss();
      }
    }

  async initMap() {
    return new Promise<void>((resolve, reject) => {
      if (!navigator.geolocation) {
        console.log('Location not supported');
        reject('Location not supported');
      }

      navigator.geolocation.getCurrentPosition((position) => {
        const coord = position.coords;

        this.map = L.map('mapId').setView([coord.latitude, coord.longitude], 20);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        this.map.on('moveend', () => {
          this.loadMarkers();
          this.currentPosition = this.map.getBounds().getCenter();
        });

        this.map.on('zoomend', () => {
          this.loadMarkers();
          this.currentPosition = this.map.getBounds().getCenter();
        });

        this.loadMarkers();

        localStorage.setItem('longitude_marker', coord.longitude.toString());
        localStorage.setItem('latitude_marker', coord.latitude.toString());

        resolve();
      }, (error) => {
        console.error('An error occurred while getting the current position:', error);
        reject(error);
      });
    });
  }

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

          // Creazione di un nuovo array per memorizzare i marker da mantenere
          const newMarkers: { id: number, marker: L.Marker }[] = [];

          // Iterazione sui dati ricevuti per aggiungere i nuovi marker
          data.forEach((activity: any) => {
            // Verifica se il marker è già presente nella mappa
            const existingMarker = this.findExistingMarker(activity);
            if (existingMarker) {
              newMarkers.push(existingMarker);
            } else {
              const marker = L.marker([activity.latitudine, activity.longitudine]).addTo(this.map);

              marker.on('click', (e: L.LeafletMouseEvent) => {
                this.showPopupContent(e, activity);
              });

              // Assegna un ID al marker
              const markerId = activity.id;

              newMarkers.push({ id: markerId, marker: marker });
            }
          });

          // Rimozione dei marker non più visibili
          this.markers.forEach(markerData => {
            if (!newMarkers.some(newMarkerData => newMarkerData.marker === markerData.marker)) {
              this.map.removeLayer(markerData.marker);
            }
          });

          // Aggiornamento dell'array dei marker con gli ID
          this.markers = newMarkers;
        },
        error: err => {
          console.log("Errore durante il recupero dei dati:", err);
        }
      });
    } else {
      // Rimuovi tutti i marker se lo zoom non è sufficiente
      this.markers.forEach(markerData => {
        this.map.removeLayer(markerData.marker);
      });
      this.markers = [];
    }
  }


  findExistingMarker(activity: any): CustomMarker | undefined {
    // Cerca un marker esistente che corrisponda all'ID dell'attività specificata
    return this.markers.find(markerData => markerData.id === activity.id);
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
    marker.bindPopup("<b>Spostami</b> e clicca sul marker per creare una attività nel punto desiderato").openPopup(); // Aggiunge il popup con il messaggio personalizzato
  }

  // Aggiorna dinamicamente un popup di un marker con le sue coordinate per poi passarle alla modale
  updatePopupContent(e: L.LeafletMouseEvent, markerId: number) {
    const eventTarget = e.target as L.Marker;
    const markerPosition = eventTarget.getLatLng();
    const markerLatitude = markerPosition.lat
    const markerLongitude = markerPosition.lng

    const popupContent = `
      <ion-button id="${this.popupButtonId}${markerId}">Create activity</ion-button>
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

    const popupContent = `
      <ion-button id="${this.viewPopupButtonId}${activity.id}">View activity</ion-button>
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

    const button = document.getElementById(`${this.viewPopupButtonId}${activity.id}`);
    if (button) {

      // Rimuovi il listener dell'evento se già presente
      button.removeEventListener('click', () => {
        console.log("Button clicked");
        this.openViewActivityModal(activity);
      });

      button.addEventListener('click', () => {
        console.log("Button clicked");
        this.openViewActivityModal(activity);
      });
    }
  }

  // Apre una finestra modale per visualizzzare un evento (passando i dettagli di una attività)
  async openViewActivityModal(activity: any) {
    this.isLoading = true; // attiva il caricamento

    const loading = await this.loadingController.create({
      message: 'Loading...' // messaggio di caricamento
    });
    await loading.present();

    const modal = await this.modalController.create({
      component: ViewActivityModalComponent,
      componentProps: {
        activity
      }
    });

    await modal.present();

    await loading.dismiss(); // chiudi il caricamento quando la finestra modale è aperta
    this.isLoading = false; // disattiva il caricamento
  }

  //Apre la finestra modale per aggiungere dei marker
  async openAddActivityModal(latitude: number, longitude: number) {
    this.isLoading = true; // attiva il caricamento

    const loading = await this.loadingController.create({
      message: 'Loading...' // messaggio di caricamento
    });
    await loading.present();

    const modal = await this.modalController.create({
      component: ActivityModalComponent,
      componentProps: {
        latitude: latitude,
        longitude: longitude
      }
    });

    await modal.present();

    await loading.dismiss(); // chiudi il caricamento quando la finestra modale è aperta
    this.isLoading = false; // disattiva il caricamento
  }
}
