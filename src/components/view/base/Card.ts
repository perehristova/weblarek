export abstract class Card {
    protected container: HTMLElement;
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
        this.titleElement = this.container.querySelector('.card__title') !;
        this.priceElement = this.container.querySelector('.card__price') !;
    }

    // Базовые методы
    protected setTitle(title: string): void {
        this.titleElement.textContent = title;
    }

    protected setPrice(price: number | null): void {
        this.priceElement.textContent = price ? `${price} синапсов` : 'Бесценно';
    }

    protected setDisabled(element: HTMLElement, disabled: boolean): void {
        (element as HTMLButtonElement).disabled = disabled;
    }
}