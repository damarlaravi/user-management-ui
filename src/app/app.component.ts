import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Utils} from './utils/utils';
import {ConfirmationService, MessageService} from 'primeng/api';
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
    private gridApi;
    private gridColumnApi;
    public headerDefs: any[] = [];
    public rowSelection = null;
    private officeServiceSubscription$: Subscription;
    private isFromEdit = false;

    constructor(private fb: FormBuilder, private ms: MessageService,
                private officeService: OfficeService,
                private confirmService: ConfirmationService) {

    }

    ngOnInit(): void {

        this.userManagementForm = this.fb.group({
            item: ['', [Validators.required, Validators.minLength(3)]],
            description: ['', [Validators.required, Validators.minLength(3)]],
            formulation: ['', [Validators.required, Validators.minLength(3)]],
            batchNo: ['', [Validators.required, Validators.minLength(3)]],
        });

        this.headerDefs = [
            {headerName: 'Item', field: 'item', width: 200, checkboxSelection: true},
            {headerName: 'Description', field: 'description', width: 200},
            {headerName: 'Formulation', field: 'formulation', width: 200},
            {headerName: 'Batch No', field: 'batchNo', width: 200}
        ];

        this.userTableDataForm = this.fb.group({
            stepperVal: [10, [Validators.required]],
            searchInput: ['', []]
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
            if (this.isFromEdit) {
                const findEditUserIndex = this.users.findIndex(userDetail => userDetail.id === this.rowSelection.id);
                this.users.splice(findEditUserIndex, 1, user);
            } else {
                this.users.push(user);
            }
            this.gridApi.setRowData(this.users);
            localStorage.setItem('user-management-info', JSON.stringify({users: this.users}));
            this.ms.add({key: 'save', severity: 'success', summary: 'User Info Saved', detail: 'User info saved successfully'});
            this.rowSelection = null;
            this.isFromEdit = false;
            this.submitted = false;
            this.resetHandler();
        }
    }

    public resetHandler(): void {
        this.userManagementForm.reset();
    }

    public editHandler(): void {
        const editedUserInfo = this.users.find(user => user.id === this.rowSelection.id);
        this.userManagementForm.patchValue(editedUserInfo);
        this.isFromEdit = true;
    }

    public onSelectionChanged(): void {
        const selectedUsers = this.gridApi.getSelectedRows();
        this.rowSelection = selectedUsers[0];
    }

    public onGridReady(params): void {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.users = Utils.getAllSavedUsers();
        // this.clonedUsers = JSON.parse(JSON.stringify(this.users));
    }

    public deleteHandler(): void {
        this.confirmService.confirm({
            message: 'Are you sure that you want to remove selected user?',
            accept: () => {
                const deleteUserId = this.users.findIndex(userInfo => userInfo.id === this.rowSelection.id);
                this.users.splice(deleteUserId, 1);
                this.gridApi.setRowData(this.users);
                this.resetHandler();
                localStorage.setItem('user-management-info', JSON.stringify({users: this.users}));
                this.ms.add({key: 'delete', severity: 'error', summary: 'User removed', detail: 'User removed successfully'});
            }
        });
    }
}
