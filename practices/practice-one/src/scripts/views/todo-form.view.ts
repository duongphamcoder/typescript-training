import { querySelector, querySelectorAll } from '../helpers/bind-dom.helper';
import { TodoType } from '../models/todo.model';
import TodoAction from '../constants/hash.constant';
import todoItemTemplate, { Param } from './templates/todo-item.template';
import TodoController from '../controllers/todo.controller';
import { showNotifications } from '../helpers/notify'
import { NotifyMessage } from '../constants/notify-message.constant'

export default class TodoFormView {
    private todoController: TodoController;
    private formElement: HTMLFormElement;
    private formGroupElemnt: HTMLElement;
    private checkAllElement: HTMLButtonElement;
    private todosElement: HTMLUListElement;
    private textElment: HTMLInputElement;
    private todos: Array<TodoType>;
    private todoSize: HTMLParagraphElement;
    private hash: string;

    constructor() {
        this.todoController = new TodoController(this);
        const todoLocals = [];
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
        let datas = this.todoController.getTodos(this.hash);
        if (this.hash === TodoAction.COMPLETED && datas.length > 0) {
            this.formGroupElemnt.classList.add('not-empty')
        }
        else if (datas.length > 0) {
            this.formGroupElemnt.classList.add('not-empty')
        }
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
        this.handleUpdateSizeTodo(this.hash);
    }

    private addEventForm() {
        this.formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = this.textElment.value.trim();
            this.todoController.handleAddTodo(text)
        });
        this.checkAllElement.addEventListener('click', (e) => { });
    }

    /**
   * - Add a new job to do
   * @param data
   */
    handleAddTodo(data: Param) {
        const todoItem = todoItemTemplate(data);
        if (this.hash !== '#/completed') {
            this.todosElement.appendChild(todoItem);
            this.handleUpdateSizeTodo(this.hash);
        }
        this.textElment.value = '';
        this.formGroupElemnt.classList.add('not-empty');
        showNotifications(NotifyMessage.CREATE)
    }


    /**
     * Add events for filter buttons
     */
    private addEventFilterButton() {
        const option = {
            all: '/',
            active: TodoAction.ACTIVE,
            completed: TodoAction.COMPLETED,
        };
        const filters = querySelectorAll('.filter-item a');
        filters.forEach((filter) => {
            filter.addEventListener('click', (e) => {
                const type = filter.getAttribute('data-type');
                const active = document.querySelector('.filter-item.active');
                active.classList.remove('active');
                filter.parentElement.classList.add('active');
                this.hash = option[type];
                this.render();
                this.handleUpdateSizeTodo(option[type]);
            });
        });
    }

    /**
     * Check which path is working
     * @param hash
     */
    private activeFilter(hash: string) {
        switch (hash) {
            case TodoAction.ACTIVE: {
                const active = querySelector('[data-type="active"]');
                active.parentElement.classList.add('active');
                break;
            }

            case TodoAction.COMPLETED: {
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
     * - Update content of to-dos
     * @param element
     * @param value
     * @param id
     * @returns { Boolean }
     */
    handleUpdateTodo(
        element: HTMLParagraphElement,
        value: string,
        id: number
    ): boolean {
        const result = this.todoController.handleUpdateTodo(id, value);
        if (result) {
            element.textContent = value;
            showNotifications(NotifyMessage.UPDATE)
        }
        return result;
    }

    /**
     * - Select a completed to-do
     * @param element
     */
    handleCompletedTodo(element: HTMLLIElement) {
        const data = element.getAttribute('data-item');
        this.todoController.handleCompletedTodo(parseInt(data))
        if (this.hash === '#/completed' || this.hash === '#/active') {
            element.remove()
        }
        this.handleUpdateSizeTodo(this.hash)
    }

    /**
     * - Delete a to-do
     * @param  element
     */
    handleDeletedTodo(element: HTMLLIElement) {
        const data = element.getAttribute('data-item');
        const confirmValue = confirm("Are you sure?")
        if (confirmValue) {
            const { dataLength } = this.todoController.handleDeletedTodo(+data)
            element.remove();
            showNotifications(NotifyMessage.DELETE)
            this.handleUpdateSizeTodo(this.hash);
            if (!dataLength) {
                this.formGroupElemnt.classList.remove('not-empty');
            }
        }
    }

    /**
     * - Show the number of elements by each selection
     * @param  hash
     */
    private handleUpdateSizeTodo(hash: string) {
        const completed = querySelectorAll('.completed').length
        const active = querySelectorAll('.todos .form-control').length
        let size = 0;
        switch (hash) {
            case TodoAction.COMPLETED: {
                size = completed;
                break;
            }
            case TodoAction.ACTIVE: {
                size = active;
            }
            default: {
                size = active - completed;
            }
        }
        this.todoSize.textContent = `${size} ${size > 1 ? "items" : 'item'} left`;
    }
}
