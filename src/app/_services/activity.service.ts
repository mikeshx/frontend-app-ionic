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
  createActivity(nome: string, id_organizzatore: number, nome_tipo_evento: string, descrizione: string,
                 dataInizio: string, dataFine: string,
                 latitudine: String, longitudine: String, max_partecipanti: number): Observable<any> {
    return this.http.post(
       ACTIVITY_API + 'create',
      {
        nome,
        id_organizzatore,
        nome_tipo_evento,
        descrizione,
        dataInizio,
        dataFine,
        latitudine,
        longitudine,
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

  /** Richiesta per ottenere il nome del tipo di una attività in base al suo ID  */
  getActivityTypeNameByID(typeID: number): Observable<any> {
    return this.http.get(
      ACTIVITY_API + 'getActivityTypeNameByID',
      { params: { typeID: typeID} }
    );
  }

  getActivityOrganizerNameByID(organizerID: number): Observable<any> {
    return this.http.get(
      ACTIVITY_API + 'getActivityOrganizerNameByID',
      { params: { organizerID: organizerID} }
    );
  }

}
