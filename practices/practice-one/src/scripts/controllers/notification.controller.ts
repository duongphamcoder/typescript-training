import Notification from '../models/notification.model';
import { showNotifications } from '../helpers/notification';


export default class NotificationController {

    constructor() {
    }

    show(notify: Notification) {
        const time = notify.duringTime || 2500;
        showNotifications(notify.message, time);
    }
}