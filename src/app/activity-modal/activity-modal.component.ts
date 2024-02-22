import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivityService } from '../_services/activity.service';

@Component({
  selector: 'app-activity-modal',
  templateUrl: './activity-modal.component.html',
  styleUrls: ['./activity-modal.component.scss'],
})
export class ActivityModalComponent implements OnInit {

  form: any = {
    name: null,
    description: null
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
    const { name, description } = this.form;

    // new Date().toISOString() restituirà una stringa nel formato ISO 8601
    //TODO: convertire quello che prendo dal calendario nello stesso formato
    let emptyDate: string = new Date().toISOString();

    this.activityService.createActivity(name, description, emptyDate, emptyDate).subscribe({
      next: data => {
          console.log(data)
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.createActivityFailed = false;
      }
    });
  }
}
