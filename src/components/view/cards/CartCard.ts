import { Card } from '../base/Card';
import { IProduct } from '../../../types';
import { IEvents } from '../../base/Events';

export class CartCard extends Card {
    protected events: IEvents;
    protected deleteButton: HTMLButtonElement;
    protected indexElement: HTMLElement;
    
    protected _id!: string;

    constructor(events: IEvents, container: HTMLElement) {
        super(container);
        this.events = events;

        this.deleteButton = this.container.querySelector('.basket__item-delete')!;
        this.indexElement = this.container.querySelector('.basket__item-index')!;
        this.deleteButton.addEventListener('click', () => {
            this.events.emit('card:remove', { id: this._id });
        });
    }

    set index(value: number) {
        this.indexElement.textContent = String(value + 1);
    }

    render(data: { product: IProduct; index: number }): HTMLElement {
        this._id = data.product.id;
        this.setTitle(data.product.title);
        this.setPrice(data.product.price);
        this.index = data.index; 
        
        return this.container;
    }
}