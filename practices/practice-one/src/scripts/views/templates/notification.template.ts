import { createElement, querySelector } from "../../helpers/bind-dom"

export const showNotifications = (message: string) => {
    const sectionElement = createElement('section')
    sectionElement.classList.add('notification')
    const html = `
    <!--Add class 'hide' on successful execution of an action-->
    <div class="form-control pesudo">
    <p class="notification-message">
        ${message}
    </p>
        <button class="btn btn-delete"></button>
    </div>
    `
    sectionElement.innerHTML = html;
    return sectionElement;
}
