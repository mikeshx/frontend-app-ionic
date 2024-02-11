import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import {MarkerPopupComponent} from "../marker-popup/marker-popup.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
  ],
  // in declarations vado ad aggiugere i componenti che voglio utilizzare
  declarations: [HomePage, MarkerPopupComponent]
})
export class HomePageModule {}
