import { Update } from '../../controllers/todo.controller';
import { createElement, querySelector } from '../../helpers/bind-dom.helper';
import { TodoType } from '../../models/todo.model';

type HandleDeletedTodo = (element: HTMLLIElement) => void
type HandleCompletedTodo = (element: HTMLLIElement) => void
type HandleUpdateTodo = (element: HTMLParagraphElement, value: string, data: number) => Update

export interface Param {
    data: TodoType;
    handleCompletedTodo: HandleCompletedTodo,
    handleUpdateTodo: HandleUpdateTodo,
    handleDeletedTodo: HandleDeletedTodo,
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
            <button class="btn btn-checkbox ${param.data.isCompleted && 'checked'
        }" data-completed='${param.data.id}'></button>
        </div>
        <!--add edit class when you want to edit-->
        <div class="form-control-input">
        <div class="pesudo">
        <p class="pesudo-value">${param.data.title}</p>
        <div class="pesudo-time">
            <p class="pesudo-time-create">CreatedAt: ${param.data.createdAt}</p>
            <p class="pesudo-time-update">UpdatedAt: ${param.data.updatedAt}</p>
        </div>
        </div>
        <form action="#" method="POST"> 
            <input
            class="form-control-input-value"
            type="text"
            value="${param.data.title}"
            data-update='${param.data.id}'
        />
        </form>
        </div>
        <div class="form-control-icon">
            <button class="btn btn-delete" data-deleted='${param.data.id
        }'></button>
        </div>`;
    liElement.innerHTML = html;
    const edit = liElement.querySelector('.form-control-input');
    const btnComplete: HTMLButtonElement = liElement.querySelector('.btn-checkbox');
    const inputUpdate: HTMLFormElement = liElement.querySelector('form');
    const textElemnt: HTMLInputElement = inputUpdate.querySelector('input');
    const btnDelete: HTMLButtonElement = liElement.querySelector('.btn-delete');
    const pesudo: HTMLParagraphElement = liElement.querySelector('.pesudo .pesudo-value') as HTMLParagraphElement;
    const timeUpdate: HTMLParagraphElement = liElement.querySelector('.pesudo-time-update') as HTMLParagraphElement;

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
        const result: Update = param.handleUpdateTodo(
            pesudo,
            textElemnt.value,
            +liElement.getAttribute('data-item')
        );
        if (result.isUpdate) {
            edit.classList.remove('edit');
            timeUpdate.textContent = `UpdatedAt: ${result.time}`
        }
    });

    // <!-- add completed class when select button -->
    return liElement;
};
