import {
    Card
} from '../base/Card';
import {
    IProduct
} from '../../../types';
import {
    IEvents
} from '../../base/Events';

// Интерфейс для данных, которые Card ожидает в методе render
interface ICartCardData {
    product: IProduct;
    index: number;
}

export class CartCard extends Card {
    protected events: IEvents;
    protected deleteButton: HTMLButtonElement;
    protected indexElement: HTMLElement;

    constructor(events: IEvents, container: HTMLElement, id: string) {
        super(container);
        this.events = events;

        this.deleteButton = this.container.querySelector('.basket__item-delete') !;
        this.indexElement = this.container.querySelector('.basket__item-index') !;

        this.deleteButton.addEventListener('click', () => {
            this.events.emit('card:remove', {
                id: id
            });
        });
    }

    set index(value: number) {
        this.indexElement.textContent = String(value + 1);
    }

    render(data ? : ICartCardData): HTMLElement {
        if (data) {
            this.setTitle(data.product.title);
            this.setPrice(data.product.price);

            this.index = data.index;
        }

        return this.container;
    }
}