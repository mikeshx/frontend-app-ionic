import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {ActivityService} from "../_services/activity.service";

@Component({
  selector: 'app-view-activity-modal',
  templateUrl: './view-activity-modal.component.html',
  styleUrls: ['./view-activity-modal.component.scss'],
})
export class ViewActivityModalComponent implements OnInit {

  // Parametri dell'attività passati da home
  @Input() activity!: any;
  errorMessage = '';
  getActivityTypeNameByIDFailed = false;
  activityTypeName!: string;

  activityStartDateValueString!: String
  activityEndDateValueString!: String


  constructor(private modalController: ModalController, private activityService: ActivityService) { }

  ngOnInit() {

    console.log("actname: "+this.activity.name)

    this.activityStartDateValueString = this.formatDateAndTime(this.activity.dataInizio)
    this.activityEndDateValueString = this.formatDateAndTime(this.activity.dataFine)
  }

  getActivityTypeNameByID() {
    if (this.activity.tipo != null) {
      this.activityService.getActivityTypeNameByID(this.activity.tipo)
        .subscribe({
          next: data => {
            this.activityTypeName = data; // Assegna il nome del tipo di attività alla variabile
          },
          error: err => {
            this.errorMessage = err.error.message;
            this.getActivityTypeNameByIDFailed = true;
          }
        });
    }
  }

  // Inviamo una richiesta POST per ottenere il nome di un organizzatore dato il suo ID
  getActivityOrganizerNameByID() {
    if (this.activity.organizzatore.id != null ) {

      this.activityService.getActivityOrganizerNameByID(
        this.activity.organizzatore.id
      ).subscribe({
        next: data => {
          console.log(data)
        },
        error: err => {
          this.errorMessage = err.error.message;
          this.getActivityTypeNameByIDFailed = true;
        }
      });

    }
  }

  formatDateAndTime(dateTimeString: string): string {
    console.log("eseguo")
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
      + ' ' + dateTime.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
