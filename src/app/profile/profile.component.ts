import { Component, OnInit } from '@angular/core';
import { StorageService } from '../_services/storage.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any;

  constructor(private router: Router, private storageService: StorageService) { }

  ngOnInit(): void {

    if (!this.storageService.isLoggedIn()) {

      // Se l'utente non è autenticato, reindirizzalo alla pagina di login
      this.router.navigate(['/login']);
    }
    this.currentUser = this.storageService.getUser();
  }
}
