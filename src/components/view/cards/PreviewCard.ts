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

export class PreviewCard extends Card {
    protected events: IEvents;
    protected button: HTMLButtonElement;
    protected descriptionElement: HTMLElement;
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected _productId: string = '';

    constructor(events: IEvents, container: HTMLElement) {
        super(container);

        this.events = events;
        this.button = this.container.querySelector('.card__button') !;
        this.descriptionElement = this.container.querySelector('.card__text') !;
        this.categoryElement = this.container.querySelector('.card__category') !;
        this.imageElement = this.container.querySelector('.card__image') !;

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.button.addEventListener('click', () => {
            this.events.emit('preview:button-click', {
                id: this._productId
            });
        });
    }

    set product(value: IProduct) {
        this._productId = value.id;
        this.setTitle(value.title);
        this.setPrice(value.price);
        this.setDescription(value.description);
        this.setCategory(value.category);
        this.setImage(value.image, value.title);
    }

    set buttonText(value: string) {
        this.button.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this.button.disabled = value;
    }

    private setDescription(description: string): void {
        this.descriptionElement.textContent = description;
    }

    private setCategory(category: string): void {
        this.categoryElement.textContent = category;
    }

    private setImage(src: string, alt: string): void {
        this.imageElement.src = `${CDN_URL}${src}`;
        this.imageElement.alt = alt;
    }

    render(product: IProduct, buttonText: string, buttonDisabled: boolean): HTMLElement {
        this.product = product;
        this.buttonText = buttonText;
        this.buttonDisabled = buttonDisabled;
        return this.container;
    }
}