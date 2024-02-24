import {Component, Input, OnInit} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivityService } from '../_services/activity.service';

@Component({
  selector: 'app-activity-modal',
  templateUrl: './activity-modal.component.html',
  styleUrls: ['./activity-modal.component.scss'],
})
export class ActivityModalComponent implements OnInit {

  // Parametri passati da home
  // Aggiungi un punto esclamativo per indicare a TypeScript che le verrà assegnato un valore
  // ...prima di essere utilizzate
  @Input() latitude!: String;
  @Input() longitude!: String;

  form: any = {
    name: null,
    description: null,
    type: null
  };
  errorMessage = '';
  createActivityFailed = false;

  constructor(private modalController: ModalController, private activityService: ActivityService) { }

  ngOnInit() {
    //this.fetchActivityDetails();
  }

  fetchActivityDetails() {
  }

  closeModal() {
    this.modalController.dismiss();
  }

  // On submit, andiamo a creare l'attività
  onSubmit() {
    const { name, description, type } = this.form;

    let max_partecipanti: number = 666

    // new Date().toISOString() restituirà una stringa nel formato ISO 8601
    //TODO: convertire quello che prendo dal calendario nello stesso formato
    let emptyDate: string = new Date().toISOString();

    this.activityService.createActivity(name, description, emptyDate,
                                        emptyDate, this.latitude, this.longitude,
                                        type, max_partecipanti).subscribe({
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
