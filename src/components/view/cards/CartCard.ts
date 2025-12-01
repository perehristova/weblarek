import { Card } from '../base/Card';
import { IProduct } from '../../../types';
import { IEvents } from '../../base/Events';

export class CartCard extends Card {
    protected deleteButton: HTMLButtonElement;
    protected indexElement: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        this.deleteButton = this.container.querySelector('.basket__item-delete')!;
        this.indexElement = this.container.querySelector('.basket__item-index')!;
    }

    set index(value: number) {
        this.indexElement.textContent = String(value + 1);
    }

    set product(value: IProduct) {
        this.setTitle(value.title);
        this.setPrice(value.price);
    }

    render(data: { product: IProduct; index: number }): HTMLElement {
        this.product = data.product;
        this.index = data.index;
        this.deleteButton.onclick = () => {
            this.events.emit('card:remove', { id: data.product.id });
        };
        
        return this.container;
    }
}