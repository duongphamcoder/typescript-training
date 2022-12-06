import { TodoType } from '../models/todo.model'
import { Param } from '../views/templates/todo-item.template'
import store from '../helpers/store';
import TYPE from '../constants/type-message.constant';
import TodoFormView from '../views/todo-form.view';
import TodoStates from '../constants/hash.constant';
import { getCurrentDate } from '../helpers/date';

type Delete = {
    type: string;
    dataLength: number;
}

export type Update = {
    isUpdate: boolean;
    time: string;
}

export default class TodoController {
    private todos: TodoType[];
    private todoView: TodoFormView;
    constructor(TodoFormView) {
        const todoLocals = JSON.parse(store('todos').get());
        this.todos = todoLocals || [];
        this.todoView = TodoFormView
    }

    getTodos(hash: string): TodoType[] {
        switch (hash) {
            case TodoStates.COMPLETED: {
                return this.todos.filter((todo) => todo.isCompleted);
            }
            case TodoStates.ACTIVE: {
                return this.todos.filter((todo) => !todo.isCompleted);
            }
            default: {
                return this.todos;
            }
        }
    }

    handleAddTodo(value: string) {
        if (Boolean(value)) {
            const currentDate = getCurrentDate();
            const data: TodoType = {
                id: this.todos.length,
                title: value,
                isCompleted: false,
                createdAt: currentDate,
                updatedAt: currentDate
            }
            const param: Param = {
                ...data,
                handleCompletedTodo: this.todoView.handleCompletedTodo.bind(this.todoView),
                handleDeletedTodo: this.todoView.handleDeletedTodo.bind(this.todoView),
                handleUpdateTodo: this.todoView.handleUpdateTodo.bind(this.todoView),
            };
            this.todos.push(data);
            store('todos').save(this.todos);
            this.todoView.handleAddTodo(param);
        }
    }

    handleUpdateTodo(id: number, value: string): Update {
        if (Boolean(value)) {
            const currentDate = getCurrentDate();
            const data = this.todos.filter((todo) => todo.id === id)[0];
            data.title = value;
            data.updatedAt = currentDate;
            store('todos').save(this.todos);
            return {
                isUpdate: true,
                time: currentDate
            };
        }
        return {
            isUpdate: false,
            time: ""
        };
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
