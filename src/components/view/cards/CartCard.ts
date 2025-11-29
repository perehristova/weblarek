import {
    Component
} from '../base/Component';
import {
    IProduct
} from '../../../types';
import {
    EventEmitter
} from '../../base/Events';

export class CartCard extends Component < {
    product: IProduct;index: number
} > {
    private events: EventEmitter;
    private deleteButton: HTMLButtonElement;
    private indexElement: HTMLElement;
    private titleElement: HTMLElement;
    private priceElement: HTMLElement;

    constructor(events: EventEmitter, container: HTMLElement) {
        super(container);

        this.events = events;
        this.deleteButton = this.container.querySelector('.basket__item-delete') !;
        this.indexElement = this.container.querySelector('.basket__item-index') !;
        this.titleElement = this.container.querySelector('.card__title') !;
        this.priceElement = this.container.querySelector('.card__price') !;

        this.deleteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            this.handleDelete();
        });
    }

    render(data: {
        product: IProduct;index: number
    }): HTMLElement {
        this.container.dataset.id = data.product.id;

        this.setText(this.titleElement, data.product.title);
        this.setText(this.priceElement, data.product.price ? `${data.product.price} синапсов` : 'Бесценно');
        this.setText(this.indexElement, (data.index + 1).toString());

        return this.container;
    }

    private handleDelete(): void {
        const id = this.container.dataset.id;
        if (id) {
            this.events.emit('card:remove', {
                id
            });
        }
    }
}