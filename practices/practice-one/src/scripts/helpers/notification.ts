import { createElement, querySelector } from './bind-dom';

export const showNotifications = (message: string, duringTime: number) => {
    const bodyElement: HTMLBodyElement = querySelector('body') as HTMLBodyElement
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
    bodyElement.appendChild(sectionElement)
    setTimeout(() => {
        sectionElement.remove()
    }, duringTime)
}
