import { querySelector } from '../helpers/bind-dom.helper'
import { TodoType } from '../models/todo.model';
import todoItemTemplate, { Param } from './templates/todo-item.template';

export default class TodoFormView {
    private formElement: HTMLFormElement;
    private checkAllElement: HTMLButtonElement;
    private todosElement: HTMLUListElement;
    private textElment: HTMLInputElement
    private count: number

    constructor() {
        this.formElement = querySelector('.form-submit form') as HTMLFormElement;
        this.checkAllElement = querySelector('.btn-tick') as HTMLButtonElement;
        this.todosElement = querySelector('.todos') as HTMLUListElement;
        this.textElment = querySelector('.form-submit  form > input') as HTMLInputElement;
        this.count = 0;
    }

    init() {
        this.addEventForm()
    }

    private addEventForm() {
        this.formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = this.textElment.value
            if (text) {
                const data: TodoType = {
                    id: this.count++,
                    description: text,
                    isCompleted: false
                }
                this.handleAddTodo(data)
                this.textElment.value = ''
            }

        })
        this.checkAllElement.addEventListener('click', (e) => { })
    }


    private handleAddTodo(data: TodoType) {
        const param: Param = {
            data,
            handleCompletedTodo: this.handleCompletedTodo,
            handleDeletedTodo: this.handleDeletedTodo,
            handleUpdateTodo: this.handleUpdateTodo,
        }
        const todoItem = todoItemTemplate(param)
        this.todosElement.appendChild(todoItem)
    }

    private handleUpdateTodo(element) { }

    private handleCompletedTodo(element) { }

    private handleDeletedTodo(element) { }

}
