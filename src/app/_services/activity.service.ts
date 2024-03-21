import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const ACTIVITY_API = 'http://localhost:8080/api/activity/';
const ANDROID_EMULATOR_BASE_URL = 'http://10.0.2.2:8080/api/activity/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  constructor(private http: HttpClient) {}

  /** Richeista post per la creaizone di una attività */
  createActivity(id_organizzatore: number, nome: string, descrizione: string,
                 dataInizio: string, dataFine: string,
                 latitudine: String, longitudine: String,
                 tipo: number, max_partecipanti: number): Observable<any> {
    return this.http.post(
       ACTIVITY_API + 'create',
      {
        id_organizzatore,
        nome,
        descrizione,
        dataInizio,
        dataFine,
        latitudine,
        longitudine,
        tipo,
        max_partecipanti
      },
      httpOptions
    );
  }

  /** Richiesta per ottenere la lista delle attività all'interno dei bound della mappa visualizzata dall'utente */
  getActivitesByBounds(northEastLat: number, northEastLng: number, southWestLat: number, southWestLng: number): Observable<any> {
    return this.http.post(
      ACTIVITY_API + 'getActivitiesByBounds',
      {
        northEastLat,
        northEastLng,
        southWestLat,
        southWestLng
      },
      httpOptions
    );
  }

}
