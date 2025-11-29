import {
    Component
} from '../base/Component';
import {
    EventEmitter
} from '../../base/Events';

export class Header extends Component < number > {
    private events: EventEmitter;
    protected basketButton: HTMLButtonElement;
    protected counterElement: HTMLElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;

        this.basketButton = this.container.querySelector('.header__basket') !;
        this.counterElement = this.container.querySelector('.header__basket-counter') !;

        this.basketButton.addEventListener('click', () => {
            this.handleBasketClick();
        });
    }

    public setLocked(isLocked: boolean): void {
        const body = document.body;
        body.classList.toggle('locked', isLocked);
    }

    render(cartItemsCount: number): HTMLElement {
        this.setText(this.counterElement, cartItemsCount.toString());
        return this.container;
    }

    private handleBasketClick(): void {
        this.events.emit('basket:open');
    }
}