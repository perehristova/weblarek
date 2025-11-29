import {
    Card
} from '../base/Card';
import {
    IProduct
} from '../../../types';
import {
    EventEmitter
} from '../../base/Events';

export class PreviewCard extends Card {
    private events: EventEmitter;
    private button: HTMLButtonElement;
    private descriptionElement: HTMLElement;

    constructor(events: EventEmitter, container: HTMLElement) {
        super(container);

        this.events = events;
        this.button = this.container.querySelector('.card__button') !;
        this.descriptionElement = this.container.querySelector('.card__text') !;

        this.button.addEventListener('click', () => {
            this.handleButtonClick();
        });
    }

    render(product: IProduct, inCart: boolean = false): HTMLElement {
        this.container.dataset.id = product.id;

        this.setText(this.titleElement, product.title);
        this.setText(this.priceElement, product.price ? `${product.price} синапсов` : 'Бесценно');
        this.setCategory(product.category);
        this.setImageWithCDN(product.image, product.title);
        this.setText(this.descriptionElement, product.description);

        if (!product.price) {
            this.setText(this.button, 'Недоступно');
            this.setDisabled(this.button, true);
        } else if (inCart) {
            this.setText(this.button, 'Удалить из корзины');
            this.setDisabled(this.button, false);
        } else {
            this.setText(this.button, 'Купить');
            this.setDisabled(this.button, false);
        }

        return this.container;
    }

    private handleButtonClick(): void {
        const id = this.container.dataset.id;
        if (!id) return;

        const buttonText = this.button.textContent;
        if (buttonText === 'Удалить из корзины') {
            this.events.emit('card:remove', {
                id,
                fromModal: true
            });
        } else {
            this.events.emit('card:add', {
                id,
                fromModal: true
            });
        }
    }
}