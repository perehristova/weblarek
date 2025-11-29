import {
    Card
} from '../base/Card';
import {
    IProduct
} from '../../../types';
import {
    EventEmitter
} from '../../base/Events';

export class CatalogCard extends Card {
    private events: EventEmitter;
    private button: HTMLButtonElement;

    constructor(events: EventEmitter, container: HTMLElement) {
        super(container);

        this.events = events;

        this.button = this.container.querySelector('.card__button') as HTMLButtonElement;

        if (this.button) {
            this.button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleCardAdd();
            });
        }

        this.container.addEventListener('click', () => {
            this.handleCardSelect();
        });
    }

    /**
     * Обработчик клика по всей карточке для открытия превью.
     */
    private handleCardSelect(): void {
        const id = this.container.dataset.id;
        if (id) {
            this.events.emit('card:select', {
                id
            });
        }
    }

    /**
     * Обработчик клика по кнопке "Купить" для добавления в корзину.
     */
    private handleCardAdd(): void {
        const id = this.container.dataset.id;
        if (id) {
            this.events.emit('card:add', {
                id,
                fromModal: false
            });
        }
    }

    render(product: IProduct): HTMLElement {
        this.container.dataset.id = product.id;

        this.setText(this.titleElement, product.title);
        this.setText(this.priceElement, product.price ? `${product.price} синапсов` : 'Бесценно');
        this.setCategory(product.category);
        this.setImageWithCDN(product.image, product.title);

        return this.container;
    }
}