import TodoFormView from "./scripts/views/todo.view";
const todoFormView = new TodoFormView()

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', todoFormView.init)
} else {
    todoFormView.init()
}

