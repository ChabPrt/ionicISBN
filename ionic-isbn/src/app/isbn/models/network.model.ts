import {StateSubject} from "../utils/StateSubject";
import {IsbnBookMeta} from "./isbn.model";

export enum NetworkSyncStatus {
  SYNC = "SYNC",
  OFFLINE_SYNC = "OFFLINE_SYNC",
  SERVER_LATE = "SERVER_LATE",
  UNKNOWN = "??",
}

export type IsbnPacket = {
  isbnCode: string
  response? : IsbnBookMeta
}

export enum PacketStatus {
  PENDING = "PENDING",
  WAITING_CONNECTION = "WAITING_CONNECTION",
  SENT = "SENT",
}

export class NetworkPacket extends StateSubject<IsbnBookMeta | undefined, PacketStatus>{

  packet: IsbnPacket;

  constructor(isbnPacket: IsbnPacket) {
    super(PacketStatus.PENDING);
    this.packet = isbnPacket;
  }
}
