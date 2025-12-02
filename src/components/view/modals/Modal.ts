import {
    IEvents
} from '../../base/Events';

export class Modal {
    protected container: HTMLElement;
    protected events: IEvents;
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;
    protected overlayElement: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        this.container = container;
        this.events = events;

        this.closeButton = this.container.querySelector('.modal__close') !;
        this.contentElement = this.container.querySelector('.modal__content') !;
        this.overlayElement = this.container;
        this.closeButton.addEventListener('click', () => this.events.emit('modal:close'));

        this.overlayElement.addEventListener('click', (event) => this.handleOverlayClick(event));

        this.contentElement.addEventListener('click', (event) => event.stopPropagation());
    }

    open(content ? : HTMLElement): void {
        if (content) {
            this.setContent(content);
        }
        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.contentElement.innerHTML = '';
    }

    setContent(content: HTMLElement): void {
        this.contentElement.innerHTML = '';
        this.contentElement.appendChild(content);
    }

    private handleOverlayClick(event: MouseEvent): void {
        if (event.target === this.overlayElement) {
            this.events.emit('modal:close');
        }
    }

    render(content ? : HTMLElement): HTMLElement {
        if (content) {
            this.setContent(content);
        }
        return this.container;
    }
}