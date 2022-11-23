export const createElement = (el: string): HTMLElement => {
    const element = document.createElement(el);
    return element;
}


export const querySelector = (selector: string): HTMLElement => {
    return document.querySelector(selector);
}


export const querySelectorAll = (selector: string): NodeListOf<HTMLElement> => {
    return document.querySelectorAll(selector);
}