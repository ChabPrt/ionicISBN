import { Injectable } from '@angular/core';
import {Isbn, IsbnBookMeta} from "../models/isbn.model";
import {BehaviorSubject} from "rxjs";
import {NetworkService} from "./network.service";
import {NetworkPacket, PacketStatus} from "../models/network.model";

@Injectable({
  providedIn: 'root'
})

export class IsbnService {
  private static readonly LOCAL_STORAGE_KEY = "data";
  public data = new BehaviorSubject<Isbn[]>([]);

  constructor(public networkService: NetworkService) {
    //Chargement des tâches
    this.loadFromStorage();

    //A chaque changement d'état
    this.data.subscribe({next: (_) => {
        this.saveToStorage();
      }});
  }

  /**
   * Méthode utilisée pour retirer le code bar du cache
   * @param isbn Object code barre
   */
  delete(isbn: Isbn) {
    const newIsbn = this.data.value.filter(i => i != isbn);
    this.data.next(newIsbn);
  }

  /**
   * Méthode utilisée pour ajouter le code bar au cache
   * @param isbn Object code barre
   */
  add(isbn: Isbn) {
    const newIsbn = this.data.value;
    newIsbn.push(isbn);
    this.data.next(newIsbn);
  }

  /**
   * Méthode utilisée pour ajouter le code bar au cache
   * @param isbns Liste de codes barres
   */
  addMultiple(isbns: Isbn[]) {
    const newIsbn = this.data.value;
    isbns.forEach(i => newIsbn.push(i));
    this.data.next(newIsbn);
  }


  /**
   * Méthode utilisée pour récupérer les infos d'un livre grace à son code ISBN
   * Les informations sont directement mis à jour dans l'objet et dans le cache
   * La valeur de retour permet de suivre l'avancement de la requête
   *
   * @param isbn barcode data
   * @return NetworkPacket
   */
  fetchInfo(isbn: Isbn) : NetworkPacket {
    const netPacket = this.networkService.submitIsbnAction(isbn)
    netPacket.subscribe({next: (isbnInfo) => {
        //on met à jour les données
        let barcode = this.data.value.find(i=> i.code == isbn.code);
        if(!barcode || !isbnInfo) return;

        isbn.bookMeta = isbnInfo;
        barcode.bookMeta = isbnInfo;

        //on force l'update dans le localstorage
        this.data.next(this.data.value);
      }});
    return netPacket;
  }

  /**
   * Méthode utilisée pour charger les données depuis le localStorage
   * @private
   */
  private loadFromStorage(){
    const savedTasks = localStorage.getItem(IsbnService.LOCAL_STORAGE_KEY);
    let tasks = savedTasks ? JSON.parse(savedTasks) : [];

    this.data.next(tasks);
  }

  /**
   * Méthode utilisée pour enregistrer les tâches dans le localStorage
   * @private
   */
  saveToStorage(){
    localStorage.setItem(IsbnService.LOCAL_STORAGE_KEY, JSON.stringify(this.data.value));
  }
}
