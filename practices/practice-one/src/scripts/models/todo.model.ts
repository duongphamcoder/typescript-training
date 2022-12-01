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
    constructor(data: TodoType) {
        this.id = data.id;
        this.title = data.title;
        this.isCompleted = data.isCompleted;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
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