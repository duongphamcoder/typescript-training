import { querySelector, querySelectorAll } from '../helpers/bind-dom';
import TodoStates from '../constants/todo-state';
import todoItemTemplate, { Param } from './templates/todo-item.template';
import TodoController, { Update } from '../controllers/todo.controller';

export default class TodoView {
    private todoController: TodoController;
    private formElement: HTMLFormElement;
    private formGroupElemnt: HTMLElement;
    private checkAllElement: HTMLButtonElement;
    private todosElement: HTMLUListElement;
    private textElment: HTMLInputElement;
    private todoSize: HTMLParagraphElement;
    private hash: string;

    constructor() {
        this.todoController = new TodoController(this);
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
        if (this.hash === TodoStates.COMPLETED && datas.length > 0) {
            this.formGroupElemnt.classList.add('not-empty');
        } else if (datas.length > 0) {
            this.formGroupElemnt.classList.add('not-empty');
        }
        this.todosElement.innerHTML = '';
        datas.forEach((todo) => {
            const param: Param = {
                ...todo,
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
            this.todoController.handleAddTodo(text);
        });
        this.checkAllElement.addEventListener('click', (e) => { this.handleCheckAll() });
    }

    /**
     * - Add a new job to do
     * @param data
     */
    handleAddTodo(data: Param) {
        const todoItem = todoItemTemplate(data);
        if (this.hash !== TodoStates.COMPLETED) {
            this.todosElement.appendChild(todoItem);
            this.handleUpdateSizeTodo(this.hash);
        }
        this.textElment.value = '';
        this.formGroupElemnt.classList.add('not-empty');
    }

    /**
     * - Handle button finish all work
     */
    private handleCheckAll() {
        const checkBtn = querySelectorAll('.btn-checkbox')
        checkBtn.forEach(btn => {
            btn.classList.add('checked');
            const liElement = btn.parentElement.parentElement as HTMLLIElement
            liElement.classList.add('completed');
            this.handleCompletedTodo(liElement);
        })
    }

    /**
     * Add events for filter buttons
     */
    private addEventFilterButton() {
        const option = {
            all: TodoStates.DEFAULT,
            active: TodoStates.ACTIVE,
            completed: TodoStates.COMPLETED,
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
            case TodoStates.ACTIVE: {
                const active = querySelector('[data-type="active"]');
                active.parentElement.classList.add('active');
                break;
            }

            case TodoStates.COMPLETED: {
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
    ): Update {
        const result = this.todoController.handleUpdateTodo(id, value);
        if (result.isUpdate) {
            element.textContent = value;
        }
        return result;
    }

    /**
     * - Select a completed to-do
     * @param element
     */
    handleCompletedTodo(element: HTMLLIElement) {
        const data = element.getAttribute('data-item');
        this.todoController.handleCompletedTodo(parseInt(data));
        if (this.hash === TodoStates.COMPLETED || this.hash === TodoStates.ACTIVE) {
            element.remove();
        }
        this.handleUpdateSizeTodo(this.hash);
    }

    /**
     * - Delete a to-do
     * @param  element
     */
    handleDeletedTodo(element: HTMLLIElement) {
        const data = element.getAttribute('data-item');
        const confirmValue = confirm("Are you sure?");
        if (confirmValue) {
            const { dataLength } = this.todoController.handleDeletedTodo(+data);
            element.remove();
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
        const completed = querySelectorAll('.completed').length;
        const active = querySelectorAll('.todos .form-control').length;
        let size = 0;
        switch (hash) {
            case TodoStates.COMPLETED: {
                size = completed;
                break;
            }
            case TodoStates.ACTIVE: {
                size = active;
            }
            default: {
                size = active - completed;
            }
        }
        this.todoSize.textContent = `${size} ${size > 1 ? "items" : 'item'} left`;
    }
}
