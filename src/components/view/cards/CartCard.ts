import {
    Component
} from '../base/Component';
import {
    IProduct
} from '../../../types';
import {
    cloneTemplate
} from '../../../utils/utils';
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
    private currentProduct: IProduct | null = null;

    constructor(events: EventEmitter) {
        const template = document.getElementById('card-basket') as HTMLTemplateElement;
        super(cloneTemplate(template));

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
        this.currentProduct = data.product;

        // Заполняем данные товара
        this.setText(this.titleElement, data.product.title);
        this.setText(this.priceElement, data.product.price ? `${data.product.price} синапсов` : 'Бесценно');

        // Устанавливаем номер позиции в корзине
        this.setText(this.indexElement, (data.index + 1).toString());

        return this.container;
    }

    private handleDelete(): void {
        if (this.currentProduct) {
            this.events.emit('card:remove', {
                product: this.currentProduct,
                fromModal: false
            });
        }
    }
}