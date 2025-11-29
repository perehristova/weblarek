import {
    Component
} from '../base/Component';
import {
    IProduct
} from '../../../types';
import {
    CartCard
} from '../cards/CartCard';
import {
    EventEmitter
} from '../../base/Events';
import {
    cloneTemplate
} from '../../../utils/utils';

interface ICartViewData {
    items: IProduct[];
    total: number;
}

export class CartView extends Component < ICartViewData > {
    private events: EventEmitter;
    private listElement: HTMLElement;
    private totalElement: HTMLElement;
    private buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;

        this.listElement = this.container.querySelector('.basket__list') !;
        this.totalElement = this.container.querySelector('.basket__price') !;
        this.buttonElement = this.container.querySelector('.basket__button') !;

        this.buttonElement.addEventListener('click', () => {
            this.handleCheckout();
        });
    }

    render(data: ICartViewData): HTMLElement {
        this.listElement.innerHTML = '';

        if (data.items.length === 0) {
            this.showEmptyMessage();
            this.setDisabled(this.buttonElement, true);
        } else {
            this.renderItems(data.items);
            this.setDisabled(this.buttonElement, false);
        }

        this.setText(this.totalElement, `${data.total} синапсов`);
        return this.container;
    }

    private renderItems(items: IProduct[]): void {
        const templateSelector = '#card-basket';

        items.forEach((item, index) => {
            const cardElement = cloneTemplate < HTMLElement > (templateSelector);

            const card = new CartCard(this.events, cardElement);

            const cardRendered = card.render({
                product: item,
                index
            });
            this.listElement.appendChild(cardRendered);
        });
    }

    private showEmptyMessage(): void {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'basket__empty';
        emptyMessage.textContent = 'Корзина пуста';
        this.listElement.appendChild(emptyMessage);
    }

    private handleCheckout(): void {
        this.events.emit('cart:checkout');
    }

    setButtonState(disabled: boolean): void {
        this.setDisabled(this.buttonElement, disabled);
    }
}