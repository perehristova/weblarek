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
    CDN_URL,
    categoryMap
} from '../../../utils/constants';

// Интерфейс для данных, которые принимает render
interface IPreviewCardRenderData extends IProduct {
    buttonText: string;
    buttonDisabled: boolean;
}

export class PreviewCard extends Card {
    protected events: IEvents;
    protected button: HTMLButtonElement;
    protected descriptionElement: HTMLElement;
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(container);

        this.events = events;
        this.button = this.container.querySelector('.card__button') !;
        this.descriptionElement = this.container.querySelector('.card__text') !;
        this.categoryElement = this.container.querySelector('.card__category') !;
        this.imageElement = this.container.querySelector('.card__image') !;

        this.button.addEventListener('click', () => {
            this.events.emit('preview:button-click');
        });
    }

    set data(value: Partial<IPreviewCardRenderData>) {
        if (value.title) this.setTitle(value.title);
        if (value.price !== undefined) this.setPrice(value.price);
        if (value.description) this.setDescription(value.description);
        if (value.category) this.setCategory(value.category);
        if (value.image && value.title) this.setImage(value.image, value.title);
        if (value.buttonText) this.buttonText = value.buttonText;
        if (value.buttonDisabled !== undefined) this.buttonDisabled = value.buttonDisabled;
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

    render(data?: Partial<IPreviewCardRenderData>): HTMLElement {
        if (data) {
            this.data = data;
        }
        return this.container;
    }
}