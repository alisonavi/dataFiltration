import {Component, OnInit,  AfterViewInit, ViewChild, TemplateRef, ChangeDetectionStrategy} from '@angular/core';
import { CommonModule } from'@angular/common';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import {  MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule }from '@angular/material/select';
import { MatInputModule  } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog  } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ApiService, User } from './api.service';
import {MatIcon} from '@angular/material/icon';
@Component({
  standalone: true,
  selector: 'app-root',
  changeDetection:ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatSelectModule, MatInputModule, MatButtonModule, MatDialogModule, MatIcon, MatDialogModule, MatInputModule
  ],
  templateUrl:'./app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  displayedColumns = [
    'thumbnail','first','last',
    'gender','email','city','delete', 'edit'
  ];
  dataSource = new MatTableDataSource<User>([]);
  selectedGender = '';

  newUser = {
    gender: '',
    email:  '',
    name:   { first: '', last: '' },
    picture: { thumbnail: '' },
    location: { city: '' },
    id:      0
  } as User;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort)      sort!: MatSort;

  @ViewChild('addPersonDialog') addPersonDialog!: TemplateRef<any>;

  constructor(
    private api:    ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.dataSource.filterPredicate = (u, f) =>
      !f || u.gender.toLowerCase() === f.toLowerCase();
    this.dataSource.sortingDataAccessor = (u, prop) => {
      if (prop === 'first') return u.name.first;
      if (prop === 'last')  return u.name.last;
      return (u as any)[prop];
    };

    this.api.getUsers().subscribe(users => {
      this.dataSource.data = users;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort      = this.sort;
  }

  applyFilters() {
    this.dataSource.filter = this.selectedGender.trim();
    this.paginator.firstPage();
  }

  clearFilters() {
    this.selectedGender = '';
    this.dataSource.filter = '';
    this.sort.active    = '';
    this.sort.direction = '';
  }

  toggleSort() {
    const next = this.sort.direction === 'asc' ? 'desc' : 'asc';
    this.sort.sort({ id: 'first', start: next, disableClear: true });
  }

  removeUser(u: User) {
    const idx = this.dataSource.data.indexOf(u);
    if (idx > -1) {
      this.dataSource.data.splice(idx, 1);
      this.dataSource.data = [...this.dataSource.data];
    }
  }

  openAddDialog() {
    this.newUser = {
      gender: '',
      email:  '',
      name:   { first: '', last: '' },
      picture: { thumbnail: '' },
      location: { city: '' },
      id:      Date.now()
    };

    const ref = this.dialog.open(this.addPersonDialog, {
      width: '400px'
    });

    ref.afterClosed().subscribe((result: User|undefined) => {
      if (result) {
        this.dataSource.data = [ result, ...this.dataSource.data ];
        this.paginator.firstPage();
      }
    });
  }
  openEditDialog(user: User) {
    this.newUser = {...user, name: {...user.name}, picture: {...user.picture}, location: {...user.location} };

    const ref = this.dialog.open(this.addPersonDialog, {
      width: '400px'
    });
    ref.afterClosed().subscribe((result: User|undefined) => {
      if (!result) return;
      const idx = this.dataSource.data.findIndex(u => u.id === user.id);
      if (idx > -1) {
        this.dataSource.data[idx] = result;
        this.dataSource.data = [...this.dataSource.data];
      }
    });
  }
}
