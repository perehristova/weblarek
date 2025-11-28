import {
    Card
} from '../base/Card';
import {
    IProduct
} from '../../../types';
import {
    cloneTemplate
} from '../../../utils/utils';
import {
    EventEmitter
} from '../../base/Events';

export class PreviewCard extends Card {
    private events: EventEmitter;
    private button: HTMLButtonElement;
    private currentProduct: IProduct | null = null;
    private descriptionElement: HTMLElement;

    constructor(events: EventEmitter) {
        const template = document.getElementById('card-preview') as HTMLTemplateElement;
        super(cloneTemplate(template));

        this.events = events;
        this.button = this.container.querySelector('.card__button') !;
        this.descriptionElement = this.container.querySelector('.card__text') !;

        this.button.addEventListener('click', () => {
            this.handleButtonClick();
        });
    }

    render(product: IProduct, inCart: boolean = false): HTMLElement {
        this.currentProduct = product;

        this.setText(this.titleElement, product.title);
        this.setText(this.priceElement, product.price ? `${product.price} синапсов` : 'Бесценно');
        this.setCategory(product.category);

        this.setImageWithCDN(product.image, product.title);

        this.setText(this.descriptionElement, product.description);
        this.updateButton(inCart);

        return this.container;
    }

    private updateButton(inCart: boolean): void {
        if (!this.currentProduct?.price) {
            this.setText(this.button, 'Недоступно');
            this.setDisabled(this.button, true);
        } else if (inCart) {
            this.setText(this.button, 'Удалить из корзины');
            this.setDisabled(this.button, false);
        } else {
            this.setText(this.button, 'Купить');
            this.setDisabled(this.button, false);
        }
    }

    private handleButtonClick(): void {
        if (this.currentProduct) {
            if (!this.currentProduct.price) return;

            const buttonText = this.button.textContent;
            if (buttonText === 'Удалить из корзины') {
                this.events.emit('card:remove', {
                    product: this.currentProduct,
                    fromModal: true
                });
            } else {
                this.events.emit('card:add', {
                    product: this.currentProduct,
                    fromModal: true
                });
            }
        }
    }
}