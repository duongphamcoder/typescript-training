export interface TodoType {
    id: number,
    title: string,
    isCompleted: boolean,
    createdAt: string,
    updatedAt: string,
}

class Todo {
    private id: number;
    private title: string;
    private isCompleted: boolean;
    private createdAt: string;
    private updatedAt: string;
    constructor(todo: TodoType) {
        this.id = todo.id;
        this.title = todo.title;
        this.isCompleted = todo.isCompleted;
        this.createdAt = todo.createdAt;
        this.updatedAt = todo.updatedAt;
    }

    getID(): number {
        return this.id;
    }

    getDescription(): string {
        return this.title;
    }

    getIsCompleted(): boolean {
        return this.isCompleted;
    }
}

export default Todo
