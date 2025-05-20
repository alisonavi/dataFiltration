import { CommonModule } from '@angular/common';
import { ApiService, User } from './api.service';
import { filter, Observable } from 'rxjs';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, MatPaginator, MatPaginatorModule,MatTableModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit {
  displayedColumns = ['thumbnail', 'first', 'last', 'gender', 'email', 'city' ];
  dataSource = new MatTableDataSource<User>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private api: ApiService) {
  }
  ngOnInit(): void {
    this.dataSource.filterPredicate = (data: User, filter: string) => 
      filter === '' || data.gender.toLowerCase() === filter.toLowerCase();

    this.api.getUsers().subscribe({
      next: users => this.dataSource.data = users,
      error: err => console.error(err)
    })
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  applyGenderFilter(filtervalue: string) {
    this.dataSource.filter = filtervalue.trim();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}