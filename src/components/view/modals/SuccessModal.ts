import {
    Component
} from '../base/Component';
import {
    EventEmitter
} from '../../base/Events';

interface ISuccessModalData {
    total: number;
}

export class SuccessModal extends Component < ISuccessModalData > {
    private events: EventEmitter;
    private closeButton: HTMLButtonElement;
    private descriptionElement: HTMLElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;

        this.closeButton = this.container.querySelector('.order-success__close') !;
        this.descriptionElement = this.container.querySelector('.order-success__description') !;

        this.closeButton.addEventListener('click', () => {
            this.handleClose();
        });
    }

    render(data: ISuccessModalData): HTMLElement {
        this.setText(this.descriptionElement, `Списано ${data.total} синапсов`);
        return this.container;
    }

    private handleClose(): void {
        this.events.emit('success:close');
    }
}