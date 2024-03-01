import {Component, Input, OnInit} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivityService } from '../_services/activity.service';
import * as moment from 'moment';

@Component({
  selector: 'app-activity-modal',
  templateUrl: './activity-modal.component.html',
  styleUrls: ['./activity-modal.component.scss'],
})
export class ActivityModalComponent implements OnInit {

  // Parametri passati da home
  @Input() latitude!: String;
  @Input() longitude!: String;

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
    this.endDateValue = val;
    console.log("endDateValue:" +this.endDateValue);
  };

  errorMessage = '';
  createActivityFailed = false;

  constructor(private modalController: ModalController, private activityService: ActivityService) { }

  ngOnInit() {

    //Inizializziamo le date tramite la libreria moment nel formato ISO 8601
    // la data viene presa in base al formato locale
    // il formato che prende in input il backend, è quello specificato tra parentesi (importante!)
    this.#startDateValue = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    this.#endDateValue = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
  }

  closeModal() {
    this.modalController.dismiss();
  }

  // On submit, andiamo a creare l'attività
  onSubmit() {
    const { name, description, activityType, maxPartecipanti} = this.form;

    this.activityService.createActivity(
      name,
      description,
      this.startDateValue,
      this.endDateValue,
      this.latitude,
      this.longitude,
      activityType,
      maxPartecipanti
    ).subscribe({
      next: data => {
        console.log(data)
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.createActivityFailed = true;
      }
    });
  }
}
