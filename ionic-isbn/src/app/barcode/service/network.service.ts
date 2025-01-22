import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IsbnPacket, NetworkPacket, NetworkSyncStatus, PacketStatus } from '../model/network.model';
import { Network } from '@capacitor/network';
import { Barcode, IsbnBookMeta } from '../model/barcode.model';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  public isOnline = new BehaviorSubject(false);
  public syncState = new BehaviorSubject<NetworkSyncStatus>(NetworkSyncStatus.UNKNOWN);
  private pendingPackets: NetworkPacket[] = [];

  constructor() {
    Network.addListener('networkStatusChange', (status) => this.updateConnectionState(status.connected));
    this.initializeNetworkState();
  }

  /** Initialise l'état réseau */
  private async initializeNetworkState(): Promise<void> {
    const status = await Network.getStatus();
    this.updateConnectionState(status.connected);
  }

  /** Met à jour l'état de la connexion réseau */
  private updateConnectionState(isOnline: boolean): void {
    this.isOnline.next(isOnline);
    if (isOnline) {
      this.processPendingPackets();
    }
  }

  /** Soumet une requête pour récupérer les informations ISBN */
  submitIsbnAction(barcode: Barcode): NetworkPacket {
    const isbnPacket: IsbnPacket = { isbnCode: `ISBN:${barcode.code}` };
    const packet = new NetworkPacket(isbnPacket);
    this.pendingPackets.push(packet);

    this.processPendingPackets();
    return packet;
  }

  /** Traite les packets en attente */
  private async processPendingPackets(): Promise<void> {
    while (this.pendingPackets.length > 0) {
      const packet = this.pendingPackets.shift()!;
      const success = await this.sendPacket(packet);

      if (!success) {
        this.pendingPackets.unshift(packet);
        break;
      }
    }

    this.updateSyncState();
  }

  /** Envoie un packet individuel */
  private async sendPacket(packet: NetworkPacket): Promise<boolean> {
    const isbn = packet.packet.isbnCode;
    const url = `https://openlibrary.org/api/books?bibkeys=${isbn}&jscmd=details&format=json`;

    try {
      const response = await fetch(url);
      const apiResult = await response.json();
      const result = Object.values(apiResult);
      const bookMeta = result.length > 0 ? (result[0] as IsbnBookMeta) : undefined;

      packet.nextWithState(bookMeta, PacketStatus.SENT);
      packet.complete();
      return true;
    } catch (error) {
      console.error(`Error sending packet for ISBN: ${isbn}`, error);
      packet.setState(PacketStatus.WAITING_CONNECTION);
      return false;
    }
  }

  /** Met à jour l'état de synchronisation */
  private updateSyncState(): void {
    const newState = this.pendingPackets.length > 0
      ? NetworkSyncStatus.SERVER_LATE
      : this.isOnline.value
        ? NetworkSyncStatus.SYNC
        : NetworkSyncStatus.OFFLINE_SYNC;

    this.syncState.next(newState);
  }
}
