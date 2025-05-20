import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule }                                    from '@angular/common';
import { MatTableModule, MatTableDataSource }              from '@angular/material/table';
import { MatPaginatorModule, MatPaginator }                from '@angular/material/paginator';
import { MatSortModule, MatSort }                          from '@angular/material/sort';
import { MatFormFieldModule }                              from '@angular/material/form-field';
import { MatSelectModule }                                 from '@angular/material/select';
import { FormsModule }                                     from '@angular/forms';
import { ApiService, User }                                from './api.service';
import { MatButtonModule, MatIconButton } from '@angular/material/button';

@Component({
  standalone:  true,
  selector:    'app-root',
  imports:     [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
    MatIconButton
  ],
  templateUrl: './app.component.html',
  styleUrls:   ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  displayedColumns = ['thumbnail','first','last', 'gender', 'email','city', 'delete'];
  dataSource = new MatTableDataSource<User>([]);
  selectedGender = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort)      sort!: MatSort;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.dataSource.filterPredicate = (user, filter) =>
      !filter || user.gender.toLowerCase() === filter.toLowerCase();
    this.dataSource.sortingDataAccessor = (user, prop) => {
      if (prop === 'first') 
        return user.name.first;
      if (prop === 'last')  
        return user.name.last;
      return (user as any)
      [prop];
    };
    this.api.getUsers().subscribe(users => {
      this.dataSource.data = users;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilters() {
    this.dataSource.filter = this.selectedGender.trim();
    this.paginator.firstPage();
  }
  clearFilters() {
    this.selectedGender = '';
    this.dataSource.filter = '';
    this.sort.active = '';
    this.sort.direction = '';
  }
  toggleSort() {
    const nextDir = this.sort.direction === 'asc' ? 'desc' : 'asc';
    this.sort.sort({ id: 'first', start: nextDir, disableClear: true });
  }
removeUser(user: User) {
  const idx = this.dataSource.data.indexOf(user);
  if (idx > -1) {
    this.dataSource.data.splice(idx, 1);
    this.dataSource.data = [...this.dataSource.data];
  }
}

}
