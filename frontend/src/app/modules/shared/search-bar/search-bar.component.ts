import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {debounce, map} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent implements AfterViewInit{
  queryString = new FormControl('');
  @Input() placeholder = "";
  @Output() onSearchChange: EventEmitter<string> = new EventEmitter();
  @Input() autoSearch: boolean = true;

  ngAfterViewInit(): void {
    if(this.autoSearch){
      this.queryString.valueChanges.pipe(
        debounceTime(350),
        distinctUntilChanged(),
        map(val => val?.toLowerCase())
      ).subscribe({
        next: value => {
          this.onSearchChange.emit(value);
        }
      })
    }
  }


  fitlerSearch() {
    this.onSearchChange.emit(this.queryString.value ?? "");
  }

  removeString() {
    this.queryString.setValue(null);
    this.onSearchChange.emit(this.queryString.value ?? "");
  }
}
