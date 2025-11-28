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

export class CatalogCard extends Card {
    private events: EventEmitter;
    private button: HTMLButtonElement;
    private currentProduct: IProduct | null = null;

    constructor(events: EventEmitter) {
        const template = document.getElementById('card-catalog') as HTMLTemplateElement;
        super(cloneTemplate(template));

        this.events = events;
        this.button = this.container as HTMLButtonElement;

        this.button.addEventListener('click', () => {
            this.handleClick();
        });
    }

    render(product: IProduct): HTMLElement {
        this.currentProduct = product;
        this.setText(this.titleElement, product.title);
        this.setText(this.priceElement, product.price ? `${product.price} синапсов` : 'Бесценно');
        this.setCategory(product.category);

        this.setImageWithCDN(product.image, product.title);


        return this.container;
    }

    private handleClick(): void {
        if (this.currentProduct) {
            this.events.emit('card:select', {
                product: this.currentProduct
            });
        }
    }
}