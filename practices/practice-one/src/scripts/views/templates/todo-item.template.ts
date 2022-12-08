import { Update } from '../../controllers/todo.controller';
import { createElement, querySelector } from '../../helpers/bind-dom';
import { TodoType } from '../../models/todo.model';

type HandleDeletedTodo = (element: HTMLLIElement) => void
type HandleCompletedTodo = (element: HTMLLIElement) => void
type HandleUpdateTodo = (element: HTMLParagraphElement, value: string, data: number) => Update

export interface Param extends TodoType {
    handleCompletedTodo: HandleCompletedTodo,
    handleUpdateTodo: HandleUpdateTodo,
    handleDeletedTodo: HandleDeletedTodo,
}

export default (param: Param): HTMLLIElement => {
    const completed = param.isCompleted ? 'completed' : 'temp';
    const liElement = createElement('li') as HTMLLIElement;
    liElement.classList.add('form-control', `${completed}`);
    liElement.setAttribute('data-item', `${param.id}`);
    const html = ` 
        <div class="form-control-icon">
            <!--
                - add checked class when selected
                - also have to add the completed class when adding the checked class
            -->
            <button 
                class="btn btn-checkbox ${param.isCompleted && 'checked'}"
                data-completed='${param.id}'>
            </button>
        </div>
            <!--add edit class when you want to edit-->
        <div class="form-control-input">
            <div class="pesudo">
                <p class="pesudo-value">${param.title}</p>
                <div class="pesudo-time">
                    <p class="pesudo-time-create">CreatedAt: ${param.createdAt}</p>
                    <p class="pesudo-time-update">UpdatedAt: ${param.updatedAt}</p>
                </div>
            </div>
            <form action="#" method="POST"> 
                <input
                    class="form-control-input-value"
                    type="text"
                    value="${param.title}"
                    data-update='${param.id}'
                />
            </form>
        </div>
        <div 
            class="form-control-icon">
            <button class="btn btn-delete" data-deleted='${param.id}'>
            </button>
        </div>`;
    liElement.innerHTML = html;
    // <!-- add completed class when select button -->
    return liElement;
};
