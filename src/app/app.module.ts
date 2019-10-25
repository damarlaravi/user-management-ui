import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {CalendarModule} from 'primeng/calendar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {KeyFilterModule} from 'primeng/keyfilter';
import {SpinnerModule} from 'primeng/spinner';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {HttpClientModule} from '@angular/common/http';
import {OfficeService} from './service/office.service';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {AgGridModule} from 'ag-grid-angular';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        ButtonModule,
        CardModule,
        InputTextModule,
        CalendarModule,
        ToastModule,
        TableModule,
        KeyFilterModule,
        SpinnerModule,
        AutoCompleteModule,
        ConfirmDialogModule,
        AgGridModule.withComponents([])
    ],
    providers: [MessageService, OfficeService, ConfirmationService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
