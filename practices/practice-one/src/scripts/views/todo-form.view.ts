import { querySelector } from '../helpers/bind-dom.helper';
import store from '../helpers/store';
import { TodoType } from '../models/todo.model';
import todoItemTemplate, { Param } from './templates/todo-item.template';

export default class TodoFormView {
    private formElement: HTMLFormElement;
    private formGroupElemnt: HTMLElement;
    private checkAllElement: HTMLButtonElement;
    private todosElement: HTMLUListElement;
    private textElment: HTMLInputElement;
    private todos: Array<TodoType>;
    private todoSize: HTMLParagraphElement;

    constructor() {
        const todoLocals = JSON.parse(store('todos').get());
        this.todos = todoLocals || [];
        this.formElement = querySelector(
            '.form-submit form'
        ) as HTMLFormElement;
        this.checkAllElement = querySelector('.btn-tick') as HTMLButtonElement;
        this.todosElement = querySelector('.todos') as HTMLUListElement;
        this.textElment = querySelector(
            '.form-submit  form > input'
        ) as HTMLInputElement;
        this.formGroupElemnt = querySelector('.form');
        this.todoSize = querySelector('.todo-size') as HTMLParagraphElement;
    }

    init() {
        this.render();
        this.addEventForm();
    }

    private render() {
        this.handleUpdateSizeTodo(this.todos.length);
        this.todos.forEach((todo) => {
            const param: Param = {
                data: todo,
                handleCompletedTodo: this.handleCompletedTodo.bind(this),
                handleDeletedTodo: this.handleDeletedTodo.bind(this),
                handleUpdateTodo: this.handleUpdateTodo.bind(this),
            };
            const todoItem = todoItemTemplate(param);
            this.todosElement.appendChild(todoItem);
            this.formGroupElemnt.classList.add('not-empty');
        });
    }

    private addEventForm() {
        this.formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            let count = this.todos.length;
            const text = this.textElment.value;
            if (text) {
                const data: TodoType = {
                    id: count,
                    description: text,
                    isCompleted: false,
                };
                this.handleAddTodo(data);
                this.textElment.value = '';
                this.formGroupElemnt.classList.add('not-empty');
            }
        });
        this.checkAllElement.addEventListener('click', (e) => {});
    }

    private handleAddTodo(data: TodoType) {
        this.todos.push(data);
        localStorage.setItem('todos', JSON.stringify(this.todos));
        const param: Param = {
            data,
            handleCompletedTodo: this.handleCompletedTodo.bind(this),
            handleDeletedTodo: this.handleDeletedTodo.bind(this),
            handleUpdateTodo: this.handleUpdateTodo.bind(this),
        };
        const todoItem = todoItemTemplate(param);
        this.todosElement.appendChild(todoItem);
        this.handleUpdateSizeTodo(this.todos.length);
    }

    private handleUpdateTodo(
        element: HTMLParagraphElement,
        value: string,
        id: number
    ): Boolean {
        if (value) {
            element.textContent = value;
            const data = this.todos.filter((todo) => todo.id === id)[0];
            data.description = value;
            store('todos').save(this.todos);
            return true;
        }
        return false;
    }

    private handleCompletedTodo(element) {
        const data = element.getAttribute('data-item');
        const result = this.todos.filter((todo) => todo.id === +data)[0];
        result.isCompleted = !result.isCompleted;
        store('todos').save(this.todos);
    }

    private handleDeletedTodo(element) {
        const data = element.getAttribute('data-item');
        this.todos = this.todos.filter((todo) => todo.id !== +data);
        store('todos').save(this.todos);
        element.remove();
        this.handleUpdateSizeTodo(this.todos.length);
        if (!this.todos.length) {
            this.formGroupElemnt.classList.remove('not-empty');
        }
    }

    private handleUpdateSizeTodo(size: number) {
        this.todoSize.textContent = `${size} items left`;
    }
}
