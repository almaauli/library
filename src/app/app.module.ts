import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookStockComponent } from './components/book-stock/book-stock.component';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PeminjamanComponent } from './components/peminjaman/peminjaman.component';
import { LaporanComponent } from './components/laporan/laporan.component';
import { HttpClientModule } from '@angular/common/http';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { UpdateBookComponent } from './components/update-book/update-book.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    AddBookComponent,
    BookListComponent,
    BookStockComponent,
    NavbarComponent,
    PeminjamanComponent,
    LaporanComponent,
    BookDetailComponent,
    UpdateBookComponent,
    ForbiddenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule // hanya ini yang dibutuhkan
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
