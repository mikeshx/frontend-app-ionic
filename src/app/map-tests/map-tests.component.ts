import { Component, OnInit } from '@angular/core';
import * as L from "leaflet";

@Component({
  selector: 'app-map-tests',
  templateUrl: './map-tests.component.html',
  styleUrls: ['./map-tests.component.scss'],
})
export class MapTestsComponent implements OnInit {
  map!: L.Map;
  markers: L.Marker[] = [];
  zoomThreshold = 14; // Imposta il livello di zoom minimo desiderato per visualizzare i marker

  constructor() { }

  ngOnInit() {
    // Inizializza la mappa e imposta la vista
    this.initMap();
  }

  initMap() {
    if (!navigator.geolocation) {
      console.log('Location not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const coord = position.coords;

      this.map = L.map('mapId').setView([coord.latitude, coord.longitude], 13); // Imposta lo zoom iniziale a 13
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      // Aggiungi event listener per gestire il caricamento dei marker in base alla posizione e allo zoom
      this.map.on('moveend', () => {
        this.loadMarkers();
      });

      this.map.on('zoomend', () => {
        this.loadMarkers();
      });

      // Carica i marker iniziali
      this.loadMarkers();
    });
  }

  loadMarkers() {
    // Rimuovi tutti i marker esistenti dalla mappa
    this.markers.forEach(marker => {
      this.map.removeLayer(marker);
    });
    this.markers = [];

    // Verifica lo zoom prima di aggiungere i marker
    if (this.map.getZoom() >= this.zoomThreshold) {
      // Ottieni i limiti attuali della mappa
      const bounds = this.map.getBounds();

      // Simulated data, sostituisci questo con i tuoi dati effettivi dei marker


      const data = [
        { lat: 41.903906, lng: 12.496739},
        { lat: 41.902640, lng: 12.498955}
        // Aggiungi altri dati secondo necessità
      ];

      // Filtra i marker per quelli all'interno dei limiti attuali della mappa
      const markersInBounds = data.filter(item => bounds.contains([item.lat, item.lng]));

      // Aggiungi i marker filtrati alla mappa
      markersInBounds.forEach(item => {
        const marker = L.marker([item.lat, item.lng]).addTo(this.map);
        this.markers.push(marker);
      });
    }
  }

  /** Load markers dal db
   loadMarkers() {
   // Rimuovi tutti i marker esistenti dalla mappa
   this.markers.forEach(marker => {
   this.map.removeLayer(marker);
   });
   this.markers = [];

   // Verifica lo zoom prima di aggiungere i marker
   if (this.map.getZoom() >= this.zoomThreshold) {
   // Ottieni i limiti attuali della mappa
   const bounds = this.map.getBounds();

   // Ottieni le coordinate del rettangolo della mappa
   const southWest = bounds.getSouthWest();
   const northEast = bounds.getNorthEast();

   // Recupera lo zoom attuale della mappa
   const currentZoom = this.map.getZoom();

   // Verifica se lo zoom è superiore a un certo valore
   if (currentZoom <= MAX_ZOOM_THRESHOLD) {
   // Effettua una richiesta HTTP al tuo backend per recuperare i marker della zona
   // Assicurati di implementare il metodo di recupero dei marker nel tuo backend
   this.http.post('url_del_tuo_backend/api/markers', { southWest, northEast }).subscribe((response: any) => {
   // Aggiungi i marker alla mappa
   response.markers.forEach((markerData: any) => {
   const marker = L.marker([markerData.lat, markerData.lng]).addTo(this.map);
   this.markers.push(marker);
   });
   });
   }
   }
   }
   */
}
