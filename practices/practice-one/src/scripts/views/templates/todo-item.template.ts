import { createElement, querySelector } from '../../helpers/bind-dom.helper';
import { TodoType } from '../../models/todo.model';

export interface Param {
    data: TodoType;
    handleCompletedTodo: Function;
    handleUpdateTodo: Function;
    handleDeletedTodo: Function;
}

export default (param: Param): HTMLLIElement => {
    const completed = param.data.isCompleted ? 'completed' : 'temp';
    const liElement = createElement('li') as HTMLLIElement;
    liElement.classList.add('form-control', `${completed}`);
    liElement.setAttribute('data-item', param.data.id + '');
    const html = ` 
        <div class="form-control-icon">
            <!--
                - add checked class when selected
                - also have to add the completed class when adding the checked class
            -->
            <button class="btn btn-checkbox ${
                param.data.isCompleted && 'checked'
            }" data-completed='${param.data.id}'></button>
        </div>
        <!--add edit class when you want to edit-->
        <div class="form-control-input">
            <p class="pesudo">${param.data.description}</p>
        <form action="#" method="POST"> 
            <input
            class="form-control-input-value"
            type="text"
            value="${param.data.description}"
            data-update='${param.data.id}'
        />
        </form>
        </div>
        <div class="form-control-icon">
            <button class="btn btn-delete" data-deleted='${
                param.data.id
            }'></button>
        </div>`;
    liElement.innerHTML = html;
    const edit = liElement.querySelector('.form-control-input');
    const btnComplete = liElement.querySelector('.btn-checkbox');
    const inputUpdate = liElement.querySelector('form');
    const textElemnt = inputUpdate.querySelector('input');
    const btnDelete = liElement.querySelector('.btn-delete');
    const pesudo = liElement.querySelector('.pesudo');

    btnDelete.addEventListener('click', () => {
        param.handleDeletedTodo(liElement);
    });

    btnComplete.addEventListener('click', () => {
        btnComplete.classList.toggle('checked');
        liElement.classList.toggle('completed');
        param.handleCompletedTodo(liElement);
    });

    pesudo.addEventListener('dblclick', () => {
        edit.classList.add('edit');
        textElemnt.focus();
    });

    inputUpdate.addEventListener('submit', (e) => {
        e.preventDefault();
        const result = param.handleUpdateTodo(
            pesudo,
            textElemnt.value,
            +liElement.getAttribute('data-item')
        );
        result && edit.classList.remove('edit');
    });

    // <!-- add completed class when select button -->
    return liElement;
};
