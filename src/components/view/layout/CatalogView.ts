export class CatalogView {
    protected container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    set items(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }

    render(items?: HTMLElement[]): HTMLElement {
        if (items !== undefined) {
            this.items = items;
        }
        return this.container;
    }
}
