import {
    Component
} from '../base/Component';
import {
    EventEmitter
} from '../../base/Events';

export class Modal extends Component < HTMLElement > {
    private events: EventEmitter;
    private closeButton: HTMLButtonElement;
    private contentElement: HTMLElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;

        this.closeButton = this.container.querySelector('.modal__close') !;
        this.contentElement = this.container.querySelector('.modal__content') !;

        this.closeButton.addEventListener('click', () => this.close());
        this.container.addEventListener('click', (event) => this.handleOverlayClick(event));

        this.contentElement.addEventListener('click', (event) => event.stopPropagation());
    }

    render(content ? : HTMLElement): HTMLElement {
        this.contentElement.innerHTML = '';

        if (content) {
            this.contentElement.appendChild(content);
        }

        return this.container;
    }

    open(content ? : HTMLElement): void {
        if (content) {
            this.render(content);
        }

        this.container.classList.add('modal_active');

        this.events.emit('modal:open');
    }

    close(): void {
        this.container.classList.remove('modal_active');

        this.contentElement.innerHTML = '';

        this.events.emit('modal:close');
    }

    private handleOverlayClick(event: MouseEvent): void {
        if (event.target === this.container) {
            this.close();
        }
    }

    setContent(content: HTMLElement): void {
        this.contentElement.innerHTML = '';
        this.contentElement.appendChild(content);
    }
}