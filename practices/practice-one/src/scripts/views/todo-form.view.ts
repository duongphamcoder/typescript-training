import { querySelector } from '../helpers/bind-dom.helper'
import { TodoType } from '../models/todo.model';
import todoItemTemplate, { Param } from './templates/todo-item.template';

export default class TodoFormView {
    private formElement: HTMLFormElement;
    private checkAllElement: HTMLButtonElement;
    private todosElement: HTMLUListElement;
    private textElment: HTMLInputElement
    private todos: Array<TodoType>

    constructor() {
        const todoLocals = JSON.parse(localStorage.getItem('todos'))
        this.todos = todoLocals || []
        this.formElement = querySelector('.form-submit form') as HTMLFormElement;
        this.checkAllElement = querySelector('.btn-tick') as HTMLButtonElement;
        this.todosElement = querySelector('.todos') as HTMLUListElement;
        this.textElment = querySelector('.form-submit  form > input') as HTMLInputElement;
    }

    init() {
        this.render()
        this.addEventForm()
    }

    private render() {
        const todosElement = querySelector('.form')
        this.todos.forEach(todo => {
            const param: Param = {
                data: todo,
                handleCompletedTodo: this.handleCompletedTodo,
                handleDeletedTodo: this.handleDeletedTodo,
                handleUpdateTodo: this.handleUpdateTodo,
            }
            const todoItem = todoItemTemplate(param)
            this.todosElement.appendChild(todoItem)
            todosElement.classList.add('not-empty')
        })
    }

    private addEventForm() {
        const todosElement = querySelector('.form')
        this.formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            let count = this.todos.length
            const text = this.textElment.value
            if (text) {
                const data: TodoType = {
                    id: count,
                    description: text,
                    isCompleted: false
                }
                this.handleAddTodo(data)
                this.textElment.value = ''
                todosElement.classList.add('not-empty')
            }

        })
        this.checkAllElement.addEventListener('click', (e) => { })
    }


    private handleAddTodo(data: TodoType) {
        this.todos.push(data)
        localStorage.setItem('todos', JSON.stringify(this.todos))
        const param: Param = {
            data,
            handleCompletedTodo: this.handleCompletedTodo,
            handleDeletedTodo: this.handleDeletedTodo,
            handleUpdateTodo: this.handleUpdateTodo,
        }
        const todoItem = todoItemTemplate(param)
        this.todosElement.appendChild(todoItem)
    }

    private handleUpdateTodo(element, value): Boolean {
        if (value) {
            element.textContent = value
            return true
        }
        return false
    }

    private handleCompletedTodo(element) { }

    private handleDeletedTodo(element) {
        const data = element.getAttribute("data-item")
        element.remove()
    }

}
