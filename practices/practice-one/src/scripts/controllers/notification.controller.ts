import Notification from '../models/notification.model';
import NotificationView from '../views/notification.view';


export default class NotificationController {
    private notificationView: NotificationView;
    constructor() {
        this.notificationView = new NotificationView()
    }

    /**
     * - Handling display of messages on the screen
     * @param notify 
     */
    show(notify: Notification) {
        const time = notify.duringTime || 2500;
        this.notificationView.show(notify.message, time);
    }
}