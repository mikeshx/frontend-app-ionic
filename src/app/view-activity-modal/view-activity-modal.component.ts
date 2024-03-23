import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-view-activity-modal',
  templateUrl: './view-activity-modal.component.html',
  styleUrls: ['./view-activity-modal.component.scss'],
})
export class ViewActivityModalComponent implements OnInit {

  // Parametri dell'attività passati da home
  @Input() activity!: any;


  constructor(private modalController: ModalController) { }

  ngOnInit() {

  }

  formatDateAndTime(dateTimeString: string): string {
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
      + ' ' + dateTime.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
