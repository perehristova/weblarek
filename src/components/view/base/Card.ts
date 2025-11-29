import {
    Component
} from '../base/Component';
import {
    IProduct
} from '../../../types';
import {
    categoryMap,
    CDN_URL
} from '../../../utils/constants';

export abstract class Card extends Component < IProduct > {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement) {
        super(container);

        this.titleElement = this.container.querySelector('.card__title') !;
        this.priceElement = this.container.querySelector('.card__price') !;
        this.categoryElement = this.container.querySelector('.card__category') !;
        this.imageElement = this.container.querySelector('.card__image') !;
    }

    abstract render(data ? : IProduct, ...args: any[]): HTMLElement;

    protected setCategory(category: string): void {
        if (this.categoryElement) {
            this.categoryElement.className = 'card__category';
            const modifier = this.getCategoryModifier(category);
            this.categoryElement.classList.add(modifier);
            this.setText(this.categoryElement, category);
        }
    }

    protected setImageWithCDN(src: string, alt ? : string): void {
        if (this.imageElement && src) {
            const fullSrc = `${CDN_URL}${src}`;
            this.imageElement.src = fullSrc;
            if (alt) {
                this.imageElement.alt = alt;
            }
        }
    }

    private getCategoryModifier(category: string): string {
        return categoryMap[category as keyof typeof categoryMap] || 'card__category_other';
    }
}