export const createElement = (el:string):HTMLElement =>{
    const element =document.createElement(el)
    return element
}

export const querySelector = (selector:string):HTMLElement =>{
    const element = document.querySelector(selector) as HTMLElement
    return element;
}