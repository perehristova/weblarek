export class CatalogView {
    protected container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    // Сеттер принимает ГОТОВЫЙ массив DOM-элементов
    set items(items: HTMLElement[]) {
        // Очищаем и вставляем новые элементы
        this.container.replaceChildren(...items);
    }

    // Рендер, который просто вызывает сеттер
    render(items: HTMLElement[]): HTMLElement {
        this.items = items;
        return this.container;
    }
}