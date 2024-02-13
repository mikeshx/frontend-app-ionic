import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import {MarkerPopupComponent} from "../marker-popup/marker-popup.component";
import {ActivityModalComponent} from "../activity-modal/activity-modal.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
  ],
  // In declarations vado ad aggiugere i componenti che voglio utilizzare nel modulo home
  declarations: [HomePage, MarkerPopupComponent, ActivityModalComponent]
})
export class HomePageModule {}
