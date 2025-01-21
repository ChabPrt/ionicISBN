import { Injectable } from '@angular/core';
import {Barcode} from "../model/barcode.declaration";
import {BehaviorSubject} from "rxjs";
import {NetworkService} from "./network.service";
import {NetworkPacket} from "../model/network.declaration";

@Injectable({
  providedIn: 'root'
})
export class BarcodeService {

  private static readonly LOCAL_STORAGE_KEY = "barcodes";
  public barcodes = new BehaviorSubject<Barcode[]>([]);

  constructor(private networkService: NetworkService) {
    //Chargement des tâches
    this.loadFromStorage();

    //A chaque changement d'état
    this.barcodes.subscribe({next: (_) => {
        this.saveToStorage();
      }});
  }

  /**
   * Méthode utilisée pour retirer le code bar du cache
   * @param bc Object code barre
   */
  delete(bc: Barcode) {
    const newBc = this.barcodes.value.filter(b => b != bc);
    this.barcodes.next(newBc);
  }

  /**
   * Méthode utilisée pour ajouter le code bar au cache
   * @param bc Object code barre
   */
  add(bc: Barcode) {
    const newBc = this.barcodes.value;
    newBc.push(bc);
    this.barcodes.next(newBc);
  }

  /**
   * Méthode utilisée pour ajouter le code bar au cache
   * @param bcs Liste de codes barres
   */
  addMultiple(bcs: Barcode[]) {
    const newBc = this.barcodes.value;
    bcs.forEach(b => newBc.push(b));
    this.barcodes.next(newBc);
  }


  /**
   * Méthode utilisée pour récupérer les infos d'un livre grace à son code ISBN
   * Les informations sont directement mis à jour dans l'objet et dans le cache
   * La valeur de retour permet de suivre l'avancement de la requête
   *
   * @param bc barcode data
   * @return NetworkPacket
   */
  fetchInfo(bc: Barcode) : NetworkPacket {
    const netPacket = this.networkService.submitIsbnAction(bc)
    netPacket.subscribe({next: (isbnInfo) => {
        //on met à jour les données
        let barcode = this.barcodes.value.find(b=> b.code == bc.code);
        if(!barcode || !isbnInfo) return;

        bc.bookMeta = isbnInfo;
        barcode.bookMeta = isbnInfo;

        //on force l'update dans le localstorage
        this.barcodes.next(this.barcodes.value);
    }});
    return netPacket;
  }

  /**
   * Méthode utilisée pour charger les données depuis le localStorage
   * @private
   */
  private loadFromStorage(){
    const savedTasks = localStorage.getItem(BarcodeService.LOCAL_STORAGE_KEY);
    let tasks = savedTasks ? JSON.parse(savedTasks) : [];

    this.barcodes.next(tasks);
  }

  /**
   * Méthode utilisée pour enregistrer les tâches dans le localStorage
   * @private
   */
  saveToStorage(){
    localStorage.setItem(BarcodeService.LOCAL_STORAGE_KEY, JSON.stringify(this.barcodes.value));
  }
}
