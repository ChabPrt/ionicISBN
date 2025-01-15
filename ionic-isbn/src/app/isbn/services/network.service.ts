import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {IsbnPacket, NetworkPacket, NetworkSyncStatus, PacketStatus} from "../models/network.model";
import {Network} from "@capacitor/network";
import {Isbn, IsbnBookMeta} from "../models/isbn.model";

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  public isOnline = new BehaviorSubject(false);
  public syncState = new BehaviorSubject<NetworkSyncStatus>(NetworkSyncStatus.UNKNOWN);
  public pendingPackets : NetworkPacket[] = [];

  constructor() {
    Network.addListener('networkStatusChange', status => {
      this.updateConnectionState(status.connected);
    });
    this.logCurrentNetworkStatus().then(status => this.updateConnectionState(status.connected))
  }

  private updateConnectionState(isOnline: boolean){
    this.isOnline.next(isOnline);
    //Si internet est dispo, on transmet les packets
    if(isOnline) this.sendPackets().then();
  }

  /**
   * Méthode utilisée pour savoir s'il y a une connexion internet
   */
  async logCurrentNetworkStatus(){
    const status = await Network.getStatus();
    return status;
  };

  /**
   * Permet de soumettre une requête pour obtenir des infos sur
   * un livre (à partir de son code ISBN)
   */
  submitIsbnAction(isbn: Isbn) : NetworkPacket{
    const isbnPacket : IsbnPacket = {isbnCode: "ISBN:"+isbn.code};
    const packet = new NetworkPacket(isbnPacket);
    this.pendingPackets.push(packet);

    this.sendPackets().then();
    return packet;
  }


  /**
   * La méthode transmet les packets en attente au serveur
   * @private
   */
  private async sendPackets(){

    while(this.pendingPackets.length != 0){
      //On prend le 1er
      let packet = this.pendingPackets.shift()!;
      let success = false;

      const isbn = packet.packet.isbnCode;
      const url = "https://openlibrary.org/api/books?bibkeys="+isbn+"&jscmd=details&format=json";
      await fetch(url)
        .then((response) => response.json())
        .then((apiResult) => {
          const result = Object.values(apiResult);
          const bookMeta = result.length > 0 ? result[0] as IsbnBookMeta : undefined;
          success = true;

          packet.nextWithState(bookMeta,PacketStatus.SENT);
          packet.complete();
        }).catch(reason => {
          //Impossible d'obtebir la réponse, on replace le packet dans la liste
          success = false;
          packet.setState(PacketStatus.WAITING_CONNECTION);
          this.pendingPackets.unshift(packet)
      });

      if(!success){
        //Suite au problème de connexion, on annule l'envoie des autres
        break;
      }
    }
    this.updateSyncState();
  }

  /**
   * La méthode met à jour l'état de la synchro entre le serveur et le client
   * @private
   */
  private updateSyncState() : NetworkSyncStatus{
    let newSync: NetworkSyncStatus;
    if(this.pendingPackets.length != 0) newSync = NetworkSyncStatus.SERVER_LATE;
    else newSync = this.isOnline.value ? NetworkSyncStatus.SYNC : NetworkSyncStatus.OFFLINE_SYNC;

    this.syncState.next(newSync);
    return newSync;
  }
}
