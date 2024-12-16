import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  queryString = new FormControl('');
  @Input() placeholder = "";
  @Output() onSearchChange: EventEmitter<string> = new EventEmitter();

  fitlerSearch() {
    this.onSearchChange.emit(this.queryString.value ?? "");
  }
}
