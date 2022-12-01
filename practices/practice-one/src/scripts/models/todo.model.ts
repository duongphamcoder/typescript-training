export interface TodoType {
    id: number,
    description: string,
    isCompleted: boolean,
    createdAt: string,
    updatedAt: string,
}

class Todo {
    private id: number;
    private description: string;
    private isCompleted: boolean;
    private createdAt: string;
    private updatedAt: string;
    constructor(data: TodoType) {
        this.id = data.id;
        this.description = data.description;
        this.isCompleted = data.isCompleted;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    getID(): number {
        return this.id;
    }

    getDescription(): string {
        return this.description;
    }

    getIsCompleted(): boolean {
        return this.isCompleted;
    }
}


export default Todo