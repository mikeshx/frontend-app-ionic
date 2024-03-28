import {Component, Input, OnInit} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivityService } from '../_services/activity.service';
import { StorageService } from '../_services/storage.service';
import * as moment from 'moment';
import { AlertController } from '@ionic/angular';
import {HomePage} from "../home/home.page";

@Component({
  selector: 'app-activity-modal',
  templateUrl: './activity-modal.component.html',
  styleUrls: ['./activity-modal.component.scss'],
})
export class ActivityModalComponent implements OnInit {

  // Parametri passati da home
  @Input() latitude!: String;
  @Input() longitude!: String;

  currentUser: any

  form: any = {
    name: null,
    description: null,
    activityType: null,
    maxPartecipanti: null
  };

  #startDateValue: string = '';
  #endDateValue: string = '';
  get startDateValue(): string { return this.#startDateValue };
  set startDateValue(val: string) {
    this.#startDateValue = val;
    console.log("startDateValue:" +this.startDateValue);
  };

  get endDateValue(): string { return this.#endDateValue };
  set endDateValue(val: string) {
    this.#endDateValue = val;
    console.log("endDateValue:" +this.endDateValue);
  };

  errorMessage = '';
  createActivityFailed = false;

  constructor(private modalController: ModalController, private activityService: ActivityService,
              private storageService: StorageService, private alertController: AlertController) { }

  ngOnInit() {

    //Inizializziamo le date tramite la libreria moment nel formato ISO 8601
    // la data viene presa in base al formato locale
    // il formato che prende in input il backend, è quello specificato tra parentesi (importante!)
    this.#startDateValue = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    this.#endDateValue = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');

    // Prendiamo i dati dell'utente loggato
    this.currentUser = this.storageService.getUser();
  }

  closeModal() {
    this.modalController.dismiss();
  }

  // On submit, andiamo a creare l'attività
  onSubmit() {
    const { nome, nome_tipo_evento, description, activityType, maxPartecipanti} = this.form;

    this.activityService.createActivity(
      nome,
      this.currentUser.id,
      nome_tipo_evento,
      description,
      this.startDateValue,
      this.endDateValue,
      this.latitude,
      this.longitude,
      maxPartecipanti
    ).subscribe({
      next: data => {
        console.log(data);
        this.presentAlert('Successo', 'L\'attività è stata creata con successo!');
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.createActivityFailed = true;
        this.presentErrorAlert('Errore', 'Controlla di aver inserito i dati correttamente');
      }
    });
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [{
        text: 'OK',
        handler: () => {
          // azione da eseguire quando l'utente fa clic su "OK"
          this.modalController.dismiss();
        }
      }]
    });

    await alert.present();
  }

  // Presenta alert di errore, ma al contrario della funzione sopra non chiude la finestra modale
  async presentErrorAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [{
        text: 'OK',
      }]
    });

    await alert.present();
  }

}
