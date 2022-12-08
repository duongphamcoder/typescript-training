import { querySelector } from "../helpers/bind-dom";
import { showNotifications } from "./templates/notification.template";

export default class NotificationView {
    private bodyElement: HTMLBodyElement;
    constructor() {
        this.bodyElement = querySelector('body') as HTMLBodyElement;
    }

    /**
     * - Show a message when performing an action
     * @param message content to display
     * @param duringTime the time that notification is displayed (default 3s)
     */
    show(message: string, duringTime: number) {
        const notifyElement = showNotifications(message);
        this.bodyElement.appendChild(notifyElement)
        setTimeout(() => { notifyElement.remove() }, duringTime)
    }
}