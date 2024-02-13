import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivityService } from '../_services/activity.service';

@Component({
  selector: 'app-activity-modal',
  templateUrl: './activity-modal.component.html',
  styleUrls: ['./activity-modal.component.scss'],
})
export class ActivityModalComponent implements OnInit {

  constructor(private modalController: ModalController, private activityService: ActivityService) { }

  ngOnInit() {
    //this.fetchActivityDetails();
  }

  fetchActivityDetails() {
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
