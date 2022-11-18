import { querySelector } from "../helpers/bind-dom.helper";
import createTodo from './templates/todo-item.template'


export default class ToDoView {
    private todosElement: HTMLUListElement;
    private inputSubmitElement: HTMLInputElement;
    private readonly KEY: string;
    constructor() {
        this.todosElement = querySelector('.todos') as HTMLUListElement;
        this.inputSubmitElement = querySelector('.form-submit input') as HTMLInputElement;
        this.KEY = 'Enter'
    }

    init = () => {
        this.eventListener();
    }

    /**
     * Listen to events here
     */
    private eventListener = () => {
        this.inputSubmitElement.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === this.KEY) {
                this.handleAddTodo()
            }
        })
    }

    /**
     * Handle add one more to do
     */
    private handleAddTodo = () => {
        const formElement = querySelector('.form')
        formElement.classList.add('not-empty')
        const param = {
            data: {
                id: 1,
                description: 'Pham Tan Duong',
                isCompleted: true
            },
            viewHandleCompletedTodo: () => { },
            viewHandleUpdateTodo: () => { },
            viewHandleDeletedTodo: () => { },
        }
        this.todosElement.appendChild(createTodo(param))
    }

}