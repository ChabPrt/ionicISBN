import {Component} from '@angular/core';
import {IsbnService} from "../../services/isbn.service";
import {Isbn} from "../../models/isbn.model";
import {Location} from "@angular/common";

@Component({
  selector: 'app-typecode',
  templateUrl: './typecode.component.html',
  styleUrls: ['./typecode.component.scss'],
  standalone: false,
})
export class TypeCodePage {

  constructor(private isbnService: IsbnService, private location: Location) { }

  handleAddIsbn(code: string) {
    const isbn : Isbn = {
      code: code,
    }
    this.isbnService.add(isbn);
    this.location.back();
  }
}
