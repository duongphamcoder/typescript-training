import { TodoType } from '../models/todo.model'
import { Param } from '../views/templates/todo-item.template'
import store from '../helpers/store';
import TYPE from '../constants/type-message.constant';
import TodoFormView from '../views/todo-form.view';
import TodoAction from '../constants/hash.constant';

type Delete = {
    type: string;
    dataLength: number;
}

export default class TodoController {
    private todos: Array<TodoType>;
    private todoView: TodoFormView;
    constructor(TodoFormView) {
        const todoLocals = JSON.parse(store('todos').get());
        this.todos = todoLocals || [];
        this.todoView = TodoFormView
    }

    getTodos(hash: string): Array<TodoType> {
        switch (hash) {
            case TodoAction.COMPLETED: {
                return this.todos.filter((todo) => todo.isCompleted);
            }
            case TodoAction.ACTIVE: {
                return this.todos.filter((todo) => !todo.isCompleted);
            }
            default: {
            }
        }
        return this.todos;
    }

    handleAddTodo(text: string) {
        if (Boolean(text)) {
            const date = new Date();
            const currentDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
            const data: TodoType = {
                id: this.todos.length,
                description: text,
                isCompleted: false,
                createdAt: currentDate,
                updatedAt: currentDate
            }
            const param: Param = {
                data,
                handleCompletedTodo: this.todoView.handleCompletedTodo.bind(this.todoView),
                handleDeletedTodo: this.todoView.handleDeletedTodo.bind(this.todoView),
                handleUpdateTodo: this.todoView.handleUpdateTodo.bind(this.todoView),
            };
            this.todos.push(data);
            store('todos').save(this.todos);
            this.todoView.handleAddTodo(param);
        }
    }

    handleUpdateTodo(id: number, value: string): boolean {
        if (Boolean(value)) {
            const date = new Date();
            const currentDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
            const data = this.todos.filter((todo) => todo.id === id)[0];
            data.description = value;
            data.updatedAt = currentDate;
            store('todos').save(this.todos);
            return true;
        }
        return false;
    }

    handleCompletedTodo(id: number) {
        const data = this.todos.filter(todo => todo.id === id)[0];
        data.isCompleted = !data.isCompleted;
        store('todos').save(this.todos);
    }

    handleDeletedTodo(id: number): Delete {
        this.todos = this.todos.filter(todo => todo.id !== id)
        store('todos').save(this.todos);;
        return {
            type: TYPE.SUCCESS,
            dataLength: this.todos.length,
        }
    }
}