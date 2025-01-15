import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Isbn} from "../../models/isbn.model";

@Component({
  selector: 'app-isbn',
  templateUrl: './isbn.component.html',
  styleUrls: ['./isbn.component.scss'],
  standalone: false,
})
export class IsbnComponent {
  @Input() isbn?: Isbn;
  @Output() fetchInfo : EventEmitter<Isbn> = new EventEmitter();
  @Output() delete : EventEmitter<Isbn> = new EventEmitter();
  @Input() infoLoading: boolean = false;

  constructor() { }
}
