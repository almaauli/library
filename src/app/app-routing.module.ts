import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookStockComponent } from './components/book-stock/book-stock.component';
import { PeminjamanComponent } from './components/peminjaman/peminjaman.component';
import { LaporanComponent } from './components/laporan/laporan.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { UpdateBookComponent } from './components/update-book/update-book.component';
import { AuthGuard } from './guards/auth.guard';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'add-book', component: AddBookComponent, canActivate: [AuthGuard], data: {role: 'admin'} },
  { path: 'book-stock', component: BookStockComponent, canActivate: [AuthGuard], data: {role: 'admin'} },
  { path: 'laporan', component: LaporanComponent, canActivate: [AuthGuard], data: {role: 'admin'} },
  { path: 'update-book/:id', component: UpdateBookComponent, canActivate: [AuthGuard], data: {role: 'admin'} },
  { path: 'book-list', component: BookListComponent, canActivate: [AuthGuard], data: {role: 'user'} },
  { path: 'peminjaman', component: PeminjamanComponent, canActivate: [AuthGuard], data: {role: 'user'} },
  { path: 'book-detail/:id', component: BookDetailComponent, canActivate: [AuthGuard], data: {role: 'user'} },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
