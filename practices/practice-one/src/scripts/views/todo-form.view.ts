import { querySelector } from '../helpers/bind-dom.helper'

export default class TodoFormView {
    private formElement: HTMLFormElement;
    private checkAllElement: HTMLButtonElement;

    constructor() {
        this.formElement = querySelector('.form-submit form') as HTMLFormElement;
        this.checkAllElement = querySelector('.btn-tick') as HTMLButtonElement;
    }

    init() {
        this.addEventForm()
    }

    private addEventForm() {
        this.formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log(123);

        })
        this.checkAllElement.addEventListener('click', (e) => { })
    }

}