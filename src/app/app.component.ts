import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth.service';
import { EventBusService } from './_shared/event-bus.service';
import {HomePage} from "./home/home.page";
import {Router} from "@angular/router";

declare const L:any;
@Component({
  selector: 'app-root',
  "templateUrl": './app.component.html',
  "styleUrls": ['./app.component.css']
})
export class AppComponent {
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;

  eventBusSub?: Subscription;

  isModalOpen = false;


  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private eventBusService: EventBusService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
    }

    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: res => {
        console.log(res);
        this.storageService.clean();

        this.router.navigate(['/login']);
        this.reloadPage()
      },
      error: err => {
        console.log(err);
      }
    });
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  reloadPage() {
    window.location.reload();
  }

  protected readonly HomePage = HomePage;
}
