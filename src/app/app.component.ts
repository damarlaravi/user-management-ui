import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Utils} from './utils/utils';
import {ConfirmationService, MessageService} from 'primeng/api';
import {OfficeInfo, User} from './app.interface';
import {Subscription} from 'rxjs';
import {OfficeService} from './service/office.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    public userManagementForm: FormGroup;
    public submitted = false;
    public userTableDataForm: FormGroup;
    public users = [];
    public positions = [];
    public rowCount = 10;
    public results: OfficeInfo[] = [];
    private officeData: Array<OfficeInfo> = [];
    private officeServiceSubscription$: Subscription;
    private isFromEdit = false;
    private clonedUsers: Array<User> = [];
    private selectedRowId = null;

    constructor(private fb: FormBuilder, private ms: MessageService,
                private officeService: OfficeService,
                private confirmService: ConfirmationService) {

    }

    ngOnInit(): void {
        this.positions = [
            {label: 'Select Position', value: null},
            {label: 'New York', value: 'NY'},
            {label: 'Rome', value: 'RM'},
            {label: 'London', value: 'LDN'},
            {label: 'Istanbul', value: 'IST'},
            {label: 'Paris', value: 'PRS'}
        ];

        this.userManagementForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            position: ['', [Validators.required]],
            age: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2)]],
            office: ['', [Validators.required, Validators.minLength(1)]],
            date: ['', [Validators.required]],
        });

        this.userTableDataForm = this.fb.group({
            stepperVal: [10, [Validators.required]],
            searchInput: ['', []]
        });
        this.users = Utils.getAllSavedUsers();
        this.clonedUsers = JSON.parse(JSON.stringify(this.users));
        this.officeServiceSubscription$ = this.officeService.getSearchData().subscribe((res) => {
            this.officeData = res;
        });
    }

    ngOnDestroy(): void {
        this.officeServiceSubscription$.unsubscribe();
    }

    public saveHandler(): void {
        this.submitted = true;
        if (this.userManagementForm.valid) {
            const user = this.userManagementForm.value;
            user.id = Utils.getDynamicId();
            console.log(user);
            if (this.isFromEdit) {
                const findEditUserIndex = this.users.findIndex(userDetail => userDetail.id === this.selectedRowId);
                this.users.splice(findEditUserIndex, 1, user);
            } else {
                this.users.push(user);
            }
            localStorage.setItem('user-management-info', JSON.stringify({users: this.users}));
            this.ms.add({key: 'save', severity: 'success', summary: 'User Info Saved', detail: 'User info saved successfully'});
            this.selectedRowId = null;
            this.isFromEdit = false;
            this.submitted = false;
            this.resetHandler();
        }
    }

    public resetHandler(): void {
        this.userManagementForm.reset();
    }

    public stepperChangeHandler(): void {
        this.rowCount = this.userTableDataForm.get('stepperVal').value;
    }

    public searchInputChangeHandler(): void {
        // console.log(this.userTableDataForm.get('searchInput').value);
        const searchInput = this.userTableDataForm.get('searchInput').value;
        const filterData = JSON.parse(JSON.stringify(this.users));
        if (searchInput) {
            this.users = filterData.filter(userInfo => userInfo.name.toLowerCase().match(searchInput.toLowerCase()));
        } else {
            this.users = this.clonedUsers;
        }
    }

    public editHandler(rowId): void {
        const editedUserInfo = this.users.find(user => user.id === rowId);
        this.userManagementForm.get('name').setValue(editedUserInfo.name);
        this.userManagementForm.get('age').setValue(editedUserInfo.age);
        this.userManagementForm.get('position').setValue(editedUserInfo.position);
        this.userManagementForm.get('office').setValue(editedUserInfo.office);
        console.log(this.results, editedUserInfo);
        this.userManagementForm.get('date').setValue(new Date(editedUserInfo.date));
        this.isFromEdit = true;
        this.selectedRowId = rowId;
    }

    public deleteHandler(rowId): void {
        this.confirmService.confirm({
            message: 'Are you sure that you want to remove selected user?',
            accept: () => {
                const deleteUserId = this.users.findIndex(userInfo => userInfo.id === rowId);
                this.users.splice(deleteUserId, 1);
                localStorage.setItem('user-management-info', JSON.stringify({users: this.users}));
                this.ms.add({key: 'delete', severity: 'error', summary: 'User removed', detail: 'User removed successfully'});
            }
        });
    }

    public search(e): void {
        this.results = this.officeData.filter((officeObj) => officeObj.label.toLowerCase().match(e.query.toLowerCase()));
    }
}
