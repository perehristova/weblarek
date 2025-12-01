import {
    IEvents
} from '../../base/Events';

interface ISuccessModalData {
    total: number;
}

export class SuccessModal {
    protected container: HTMLElement;
    protected events: IEvents;
    protected closeButton: HTMLButtonElement;
    protected descriptionElement: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        this.container = container;
        this.events = events;

        this.closeButton = this.container.querySelector('.order-success__close') !;
        this.descriptionElement = this.container.querySelector('.order-success__description') !;

        this.closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    set data(value: ISuccessModalData) {
        this.descriptionElement.textContent = `Списано ${value.total} синапсов`;
    }

    render(data: ISuccessModalData): HTMLElement {
        this.data = data;
        return this.container;
    }
}