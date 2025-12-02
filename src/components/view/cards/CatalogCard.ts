import { Card } from '../base/Card';
import { IProduct } from '../../../types';
import { IEvents } from '../../base/Events';
import { CDN_URL, categoryMap } from '../../../utils/constants';

export class CatalogCard extends Card {
    protected events: IEvents;
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected _id!: string;

    constructor(events: IEvents, container: HTMLElement) {
        super(container);

        this.events = events;
        this.categoryElement = this.container.querySelector('.card__category')!;
        this.imageElement = this.container.querySelector('.card__image')!;
        
        this.container.addEventListener('click', () => {
            this.events.emit('card:select', { id: this._id });
        });
    }

    set product(value: IProduct) {
        this._id = value.id;
        this.setTitle(value.title);
        this.setPrice(value.price);
        this.setCategory(value.category);
        this.setImage(value.image, value.title);
    }

    private setCategory(category: string): void {
        this.categoryElement.textContent = category;
        
        const modifierClass = categoryMap[category as keyof typeof categoryMap];

        this.categoryElement.className = 'card__category'; 

        if (modifierClass) {
            this.categoryElement.classList.add(modifierClass);
        }
    }

    private setImage(src: string, alt: string): void {
        this.imageElement.src = `${CDN_URL}${src}`;
        this.imageElement.alt = alt;
    }

    render(product: IProduct): HTMLElement {
        this.product = product;
        return this.container;
    }
}