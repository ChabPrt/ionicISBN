import { StateSubjectUtil } from "../utils/state-subject.util";
import { IsbnBookMeta } from "./barcode.model";

// Enum pour représenter les différents statuts de synchronisation réseau.
export enum NetworkSyncStatus {
  SYNC = "SYNC",
  OFFLINE_SYNC = "OFFLINE_SYNC",
  SERVER_LATE = "SERVER_LATE",
  UNKNOWN = "??",
}

// Type pour décrire un paquet ISBN avec un code et une réponse facultative.
export type IsbnPacket = {
  isbnCode: string;
  response?: IsbnBookMeta;
};

// Enum pour gérer les statuts d'un paquet réseau.
export enum PacketStatus {
  PENDING = "PENDING",
  WAITING_CONNECTION = "WAITING_CONNECTION",
  SENT = "SENT",
}

// Classe pour encapsuler un paquet réseau et gérer son état via StateSubjectUtil.
export class NetworkPacket extends StateSubjectUtil<IsbnBookMeta | undefined, PacketStatus> {
  public packet: IsbnPacket;

  constructor(isbnPacket: IsbnPacket) {
    super(PacketStatus.PENDING);
    this.packet = isbnPacket;
  }

  /**
   * Met à jour l'état actuel du paquet.
   * @param status - Nouveau statut à définir.
   */
  public updateStatus(status: PacketStatus): void {
    this.setState(status);
  }

  /**
   * Associe une réponse à ce paquet tout en mettant à jour son état.
   * @param response - Les métadonnées du livre (IsbnBookMeta).
   */
  public attachResponse(response: IsbnBookMeta): void {
    this.packet.response = response;
    this.setState(PacketStatus.SENT);
  }

  /**
   * Vérifie si le paquet est complet, c'est-à-dire s'il contient une réponse.
   * @returns `true` si le paquet a une réponse, sinon `false`.
   */
  public isComplete(): boolean {
    return !!this.packet.response;
  }
}
