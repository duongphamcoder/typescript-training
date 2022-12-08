import { TodoType } from '../models/todo.model'
import { Param } from '../views/templates/todo-item.template'
import store from '../helpers/store';
import STATUS from '../constants/type-message';
import { Messages } from '../constants/messages';
import TodoView from '../views/todo.view';
import TodoStates from '../constants/todo-state';
import { getCurrentDate } from '../helpers/date';
import NotificationController from '../controllers/notification.controller';

type Delete = {
    type: string;
    dataLength: number;
}

export type Update = {
    isUpdate: boolean;
    time: string;
}

export default class TodoController {
    private notificationController: NotificationController;
    private todos: TodoType[];
    private todoView: TodoView;
    constructor(TodoView) {
        this.notificationController = new NotificationController();
        const todoLocals = JSON.parse(store('todos').get());
        this.todos = todoLocals || [];
        this.todoView = TodoView
    }

    /**
     * - Get todo by state
     * @param state 
     * @returns task list by state
     */
    getTodos(state: string): TodoType[] {
        switch (state) {
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

    /**
     * - Handle add todo
     * @param value 
     */
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
            store('todos').save<TodoType[]>(this.todos);
            this.todoView.handleAddTodo(param);
            this.notificationController.show({ message: Messages.CREATE, duringTime: 2000 })
        }
    }

    /**
     * - Handle update todo 
     * @param id id of to-do
     * @param value Content needs updating
     * @returns 
     */
    handleUpdateTodo(id: number, value: string): Update {
        if (Boolean(value)) {
            const currentDate = getCurrentDate();
            const data = this.todos.filter((todo) => todo.id === id)[0];
            data.title = value;
            data.updatedAt = currentDate;
            store('todos').save<TodoType[]>(this.todos);
            this.notificationController.show({ message: Messages.UPDATE, duringTime: 2000 })
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

    /**
     * - Handle completed todo
     * @param id id of todo 
     */
    handleCompletedTodo(id: number) {
        const data = this.todos.filter(todo => todo.id === id)[0];
        data.isCompleted = !data.isCompleted;
        store('todos').save<TodoType[]>(this.todos);
    }

    /**
     * - Handle delete todo
     * @param id id of todo
     * @returns 
     */
    handleDeletedTodo(id: number): Delete {
        this.todos = this.todos.filter(todo => todo.id !== id)
        store('todos').save<TodoType[]>(this.todos);
        this.notificationController.show({ message: Messages.DELETE })
        return {
            type: STATUS.SUCCESS,
            dataLength: this.todos.length,
        }
    }
}
