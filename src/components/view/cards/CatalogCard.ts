import {
    Card
} from '../base/Card';
import {
    IProduct
} from '../../../types';
import {
    IEvents
} from '../../base/Events';
import {
    CDN_URL
} from '../../../utils/constants';

export class CatalogCard extends Card {
    protected events: IEvents;
    protected button: HTMLButtonElement;
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(container);

        this.events = events;
        this.button = this.container.querySelector('.card__button') as HTMLButtonElement;
        this.categoryElement = this.container.querySelector('.card__category') !;
        this.imageElement = this.container.querySelector('.card__image') !;
    }

    set product(value: IProduct) {
        this.setTitle(value.title);
        this.setPrice(value.price);
        this.setCategory(value.category);
        this.setImage(value.image, value.title);
    }

    private setCategory(category: string): void {
        this.categoryElement.textContent = category;
    }

    private setImage(src: string, alt: string): void {
        this.imageElement.src = `${CDN_URL}${src}`;
        this.imageElement.alt = alt;
    }

    render(product: IProduct): HTMLElement {
        this.product = product;

        if (this.button) {
            this.button.onclick = (e) => {
                e.stopPropagation();
                this.events.emit('card:add', {
                    id: product.id,
                    fromModal: false
                });
            };
        }

        this.container.onclick = () => {
            this.events.emit('card:select', {
                id: product.id
            });
        };

        return this.container;
    }
}