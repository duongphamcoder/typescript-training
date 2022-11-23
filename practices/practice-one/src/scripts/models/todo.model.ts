export interface TodoType {
    id: number,
    description: string,
    isCompleted: boolean
}

class Todo {
    private id: number;
    private description: string;
    private isCompleted: boolean;
    constructor(data: TodoType) {
        this.id = data.id;
        this.description = data.description;
        this.isCompleted = data.isCompleted;
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