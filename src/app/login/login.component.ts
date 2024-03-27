import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';
import { Router } from '@angular/router';
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  alertButtons = ['Action'];

  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private router: Router, private authService: AuthService, private storageService: StorageService, public alertController: AlertController) { }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
      this.goToHome()
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe({
      next: data => {
        this.storageService.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        this.goToHome();
      },
      error: err => {
        //TODO: mostra messaggio di errore tramite modale quando si verifica un errore
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  // Metodo per aprire l'alert
  async presentAlert() {
    console.log('eseguo al volo')
    const alert = await this.alertController.create({
      header: 'A Short Title Is Best',
      subHeader: 'A Sub Header Is Optional',
      message: 'A message should be a short, complete sentence.',
      buttons: ['OK']
    });

    await alert.present();
  }

  reloadPage(): void {
    window.location.reload();
  }

  goToHome(): void {
    window.location.assign("/home");
  }

}
