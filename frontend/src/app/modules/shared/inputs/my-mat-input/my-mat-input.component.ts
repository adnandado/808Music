import {AfterViewInit, Component, forwardRef, Input, OnChanges, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ValidatorFn, Validators} from '@angular/forms';

@Component({
  selector: 'app-my-mat-input',
  templateUrl: './my-mat-input.component.html',
  styleUrl: './my-mat-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MyMatInputComponent),
      multi: true,
    },
  ]
})
export class MyMatInputComponent implements ControlValueAccessor, OnChanges, AfterViewInit {
    ngAfterViewInit(): void {
      this.formControl.addValidators(this.validators);
      if(this.initialValue != "")
      {
        this.writeValue(this.initialValue);
      }
    }
    @Input() name = "";
    @Input() title = "";
    @Input() placeholder = "";
    @Input() validators : ValidatorFn[] = [];
    @Input() initialValue = "";
    @Input() type = "text";
    public formControl = new FormControl();

    ngOnChanges(): void {
        this.formControl.addValidators(this.validators);
        if(this.initialValue != "")
        {
          this.writeValue(this.initialValue);
        }
    }

    writeValue(obj: any): void {
        this.formControl.setValue(obj);
        console.log(this.formControl.value);
    }

    registerOnChange(fn: Function): void {
        this.formControl.valueChanges.subscribe((value: any) => fn(value))
    }

    registerOnTouched(fn: Function): void {
      this.formControl.valueChanges.subscribe((value: any) => fn(value))
    }
}
