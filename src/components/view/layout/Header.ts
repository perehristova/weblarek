export class Header {
    protected container: HTMLElement;
    protected counterElement: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;

        this.counterElement = this.container.querySelector('.header__basket-counter')!;
    }

    // СЕТТЕР для счётчика корзины
    set counter(value: number) {
        this.counterElement.textContent = value.toString();
    }
}