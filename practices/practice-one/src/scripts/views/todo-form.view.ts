import { querySelector, querySelectorAll } from '../helpers/bind-dom.helper';
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
    private hash: string;

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
        this.hash = window.location.hash;
    }

    init() {
        this.render();
        this.activeFilter(this.hash);
        this.addEventForm();
        this.addEventFilterButton();
    }

    private render() {
        let datas = this.todos;
        switch (this.hash) {
            case '#/completed': {
                datas = this.todos.filter((todo) => todo.isCompleted);
                if (this.todos.length) {
                    this.formGroupElemnt.classList.add('not-empty');
                }
                break;
            }
            case '#/active': {
                datas = this.todos.filter((todo) => !todo.isCompleted);
            }
            default: {
                this.formGroupElemnt.classList.add('not-empty');
            }
        }
        this.handleUpdateSizeTodo(this.hash);
        this.todosElement.innerHTML = '';
        datas.forEach((todo) => {
            const param: Param = {
                data: todo,
                handleCompletedTodo: this.handleCompletedTodo.bind(this),
                handleDeletedTodo: this.handleDeletedTodo.bind(this),
                handleUpdateTodo: this.handleUpdateTodo.bind(this),
            };
            const todoItem = todoItemTemplate(param);
            this.todosElement.appendChild(todoItem);
        });
    }

    private addEventForm() {
        this.formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            let count = this.todos.length;
            const text = this.textElment.value.trim();
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

    /**
     * Add events for filter buttons
     */
    private addEventFilterButton() {
        const option = {
            all: '/',
            active: '#/active',
            completed: '#/completed',
        };
        const filters = querySelectorAll('.filter-item a');
        filters.forEach((filter) => {
            filter.addEventListener('click', (e) => {
                const type = filter.getAttribute('data-type');
                const active = document.querySelector('.filter-item.active');
                active.classList.remove('active');
                filter.parentElement.classList.add('active');
                this.hash = option[type];
                this.handleUpdateSizeTodo(option[type]);
                this.render();
            });
        });
    }

    /**
     * Check which path is working
     * @param hash
     */
    private activeFilter(hash: string) {
        switch (hash) {
            case '#/active': {
                const active = querySelector('[data-type="active"]');
                active.parentElement.classList.add('active');
                break;
            }

            case '#/completed': {
                const active = querySelector('[data-type="completed"]');
                active.parentElement.classList.add('active');
                break;
            }

            default: {
                const active = querySelector('[data-type="all"]');
                active.parentElement.classList.add('active');
                break;
            }
        }
    }

    /**
     * - Add a new job to do
     * @param data
     */
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
        this.handleUpdateSizeTodo(this.hash);
        if (this.hash !== '#/completed') {
            this.todosElement.appendChild(todoItem);
        }
    }

    /**
     * - Update content of to-dos
     * @param element
     * @param value
     * @param id
     * @returns { Boolean }
     */
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

    /**
     * - Select a completed to-do
     * @param element
     */
    private handleCompletedTodo(element: HTMLLIElement) {
        const data = element.getAttribute('data-item');
        const result = this.todos.filter((todo) => todo.id === +data)[0];
        result.isCompleted = !result.isCompleted;
        this.handleUpdateSizeTodo(this.hash);
        store('todos').save(this.todos);
        if (this.hash === '#/completed' || this.hash === '#/active') {
            this.render();
        }
    }

    /**
     * - Delete a to-do
     * @param  element
     */
    private handleDeletedTodo(element: HTMLLIElement) {
        const data = element.getAttribute('data-item');
        this.todos = this.todos.filter((todo) => todo.id !== +data);
        store('todos').save(this.todos);
        element.remove();
        this.handleUpdateSizeTodo(this.hash);
        if (!this.todos.length) {
            this.formGroupElemnt.classList.remove('not-empty');
        }
    }

    /**
     * - Show the number of elements by each selection
     * @param  hash
     */
    private handleUpdateSizeTodo(hash: string) {
        switch (hash) {
            case '#/completed': {
                const size = this.todos.filter(
                    (todo) => todo.isCompleted
                ).length;
                this.todoSize.textContent = `${size} items left`;
                break;
            }

            default: {
                const size = this.todos.filter(
                    (todo) => !todo.isCompleted
                ).length;
                this.todoSize.textContent = `${size} items left`;
            }
        }
    }
}
