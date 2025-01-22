import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-barcode-form',
  templateUrl: './barcode-form.component.html',
  styleUrls: ['./barcode-form.component.scss'],
})
export class BarcodeFormComponent {
  @Output() barcodeSubmit = new EventEmitter<string>();

  public form = this.fb.group({
    code: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(4),
      ],
    }),
  });

  constructor(private fb: FormBuilder) {}

  handleSubmit() {
    if (!this.form.valid) return;

    this.barcodeSubmit.emit(this.form.value.code!);
    this.form.reset();
  }
}
