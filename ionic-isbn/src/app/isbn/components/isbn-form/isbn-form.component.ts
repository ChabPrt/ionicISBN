import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-isbn-form',
  templateUrl: './isbn-form.component.html',
  styleUrls: ['./isbn-form.component.scss'],
  standalone: false,
})
export class IsbnFormComponent {

  @Output()
  public isbnSubmit = new EventEmitter<string>();

  public form = this.fb.group({
    code: new FormControl<string>('',{nonNullable: true,validators: [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(4)]}),
  });

  constructor(private fb: FormBuilder) {}

  handleSubmit() {
    if(!this.form.valid) return;
    this.isbnSubmit.emit(this.form.value.code!);
    this.form.reset();
  }
}
