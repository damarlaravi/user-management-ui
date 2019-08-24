import {User} from '../app.interface';

export class Utils {
    public static getDynamicId(): any {
        let dt = new Date().getTime();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            // tslint:disable-next-line:no-bitwise
            const r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            // tslint:disable-next-line:no-bitwise
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    public static getAllSavedUsers(): Array<User> {
        let allUsers = [];
        try {
            const savedUsers = JSON.parse(localStorage.getItem('user-management-info'));
            allUsers = savedUsers.users;
        } catch (e) {
            console.log(e.error);
        }

        return allUsers;
    }
}
