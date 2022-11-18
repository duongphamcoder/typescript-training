import ToDoView from "./scripts/views/todo.view";
const toDoView = new ToDoView()

if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', toDoView.init)
}
else {
    toDoView.init()
}