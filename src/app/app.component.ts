import { CommonModule } from '@angular/common';
import { ApiService, User } from './api.service';
import { Observable } from 'rxjs';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, MatPaginator, MatPaginatorModule,MatTableModule],
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
    this.api.getUsers().subscribe({
      next: users => this.dataSource.data = users,
      error: err => console.error(err)
    })
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

}