import {Component} from '@angular/core';
import {CameraService} from "../../services/camera.service";
import {IsbnService} from "../../services/isbn.service";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})

export class HomePage{
  constructor(public cameraService: CameraService,
              private barcodeService: IsbnService,
              private alertController: AlertController) { }

  handleScan() {
    if(!this.cameraService.isScanSupported) return;
    this.cameraService.scan().then(
      value => {

        //Gestion erreur
        if(value == null){
          this.showError();
          return;
        }
        //Ajout des résultats dans le service
        this.barcodeService.addMultiple(value);
      }
    );
  }

  async showError(): Promise<void> {
    const alert = await this.alertController.create({
      header: "Permission non autorisée",
      message: "Merci d'autoriser l'application a utilisé la caméra.",
      buttons: ['Ok'],
    });
    await alert.present();
  }
}
