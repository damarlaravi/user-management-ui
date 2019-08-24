import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {OfficeInfo} from '../app.interface';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OfficeService {

    constructor(private httpClient: HttpClient) {
        this.getSearchData().subscribe(data => {
            // console.log(data);
        });
    }

    public getSearchData(): Observable<Array<OfficeInfo>> {
        return this.httpClient.get<Array<OfficeInfo>>(environment.OFFICE_JSON_URL);
    }
}
