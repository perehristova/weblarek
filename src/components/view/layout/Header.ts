import { IEvents } from '../../base/Events';

export class Header { 
    protected container: HTMLElement; 
    protected counterElement: HTMLElement; 
    protected buttonElement: HTMLButtonElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) { 
        this.container = container; 
        this.events = events;

        this.counterElement = this.container.querySelector('.header__basket-counter')!; 
        
        this.buttonElement = this.container.querySelector('.header__basket')!;

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    } 

    set counter(value: number) { 
        this.counterElement.textContent = String(value); 
    } 
}