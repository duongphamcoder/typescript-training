import { createElement } from '../../helpers/bind-dom.helper'

interface Param {
    data: {
        id: number,
        description: string,
        isCompleted: boolean
    },
    viewHandleCompletedTodo: Function,
    viewHandleUpdateTodo: Function,
    viewHandleDeletedTodo: Function,
}


export default (param: Param): HTMLLIElement => {
    const liElement = createElement('li') as HTMLLIElement;
    liElement.classList.add('form-control')
    const html = ` 
        <div class="form-control-icon">
            <!--
         - add checked class when selected
         - also have to add the completed class when adding the checked class
        -->
            <button class="btn btn-checkbox" data-completed='${param.data.id}'></button>
        </div>
        <!--add edit class when you want to edit-->
        <div class="form-control-input">
            <p class="pesudo">${param.data.description}</p>
            <input
                class="form-control-input-value"
                type="text"
                value="${param.data.description}"
                data-update='${param.data.id}'
            />
        </div>
        <div class="form-control-icon">
            <button class="btn btn-delete" data-deleted='${param.data.id}'></button>
        </div>`
    const btnComplete = liElement.querySelector('.btn-checkbox');
    const inputUpdate = liElement.querySelector('.form-control-input-value')
    const btnDelete = liElement.querySelector('.btn-delete');
    liElement.innerHTML = html;

    // <!-- add completed class when select button -->
    return liElement
}