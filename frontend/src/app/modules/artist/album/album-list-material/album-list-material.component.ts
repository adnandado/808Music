import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlbumListMaterialDataSource, AlbumListMaterialItem } from './album-list-material-datasource';

@Component({
  selector: 'app-album-list-material',
  templateUrl: './album-list-material.component.html',
  styleUrl: './album-list-material.component.css'
})
export class AlbumListMaterialComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<AlbumListMaterialItem>;
  dataSource = new AlbumListMaterialDataSource();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
