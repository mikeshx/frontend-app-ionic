import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.BounceMarker';
import { ActivityService } from '../_services/activity.service';
import { ModalController } from '@ionic/angular';
import { ActivityModalComponent } from '../activity-modal/activity-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  map!: L.Map;
  content?: string;
  markers: { id: number, marker: L.Marker }[] = [];
  popupButtonId = 'activityButton';

  constructor(private activityService: ActivityService, private modalController: ModalController) { }

  ngOnInit() {
    this.initMap();
    this.watchPosition();
  }

  initMap() {
    if (!navigator.geolocation) {
      console.log('Location not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const coord = position.coords;

      this.map = L.map('mapId').setView([coord.latitude, coord.longitude], 20);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      localStorage.setItem('longitude_marker', coord.longitude.toString());
      localStorage.setItem('latitude_marker', coord.latitude.toString());
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

    const markerId = this.markers.length; // Assign unique id to marker
    this.markers.push({ id: markerId, marker });

    marker.on('click', (e: L.LeafletMouseEvent) => {
      this.updatePopupContent(e, markerId);
    });

    marker.addTo(this.map);
  }

  updatePopupContent(e: L.LeafletMouseEvent, markerId: number) {
    const eventTarget = e.target as L.Marker;
    const markerPosition = eventTarget.getLatLng();
    const markerLatitude = markerPosition.lat.toFixed(6);
    const markerLongitude = markerPosition.lng.toFixed(6);

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
      button.addEventListener('click', () => {
        console.log("Button clicked");
        this.openActivityModal();
      });
    }
  }

  createActivity() {
    this.activityService.createActivity("testargument").subscribe({
      next: data => {
        this.content = data;
      },
      error: err => {
        if (err.error) {
          try {
            const res = JSON.parse(err.error);
            this.content = res.message;
          } catch {
            this.content = `Error with status: ${err.status} - ${err.statusText}`;
          }
        } else {
          this.content = `Error with status: ${err.status}`;
        }
      }
    });
  }

  async openActivityModal() {
    const modal = await this.modalController.create({
      component: ActivityModalComponent,
    });
    return await modal.present();
  }
}
