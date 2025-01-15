import {Component} from '@angular/core';
import {IsbnService} from "../../services/isbn.service";
import {Isbn} from "../../models/isbn.model";
import {PacketStatus} from "../../models/network.declaration";

@Component({
  selector: 'app-isbn-list',
  templateUrl: './isbn-list.component.html',
  styleUrls: ['./isbn-list.component.CommonModule'],
  standalone: false
})
export class IsbnListComponent {

  public spinnerOn : string[] = [];
  isbn: Isbn = {} as Isbn;

  constructor(public isbnService: IsbnService) { }

  handleDelete(isbn: Isbn) {
    this.spinnerOn = this.spinnerOn.filter(code => code != isbn.code);
    this.isbnService.delete(isbn);
  }

  handleFetchInfo(isbn: Isbn){
    this.spinnerOn.push(isbn.code);
    this.isbnService.fetchInfo(isbn).state.subscribe({
      next: (state) => {
        if(state == PacketStatus.SENT){
          this.spinnerOn = this.spinnerOn.filter(code => code != isbn.code);
        }
      }
    });
  }
}
