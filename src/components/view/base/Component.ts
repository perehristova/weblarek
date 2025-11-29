export abstract class Component < T = any > {
    protected container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    abstract render(data ? : T): HTMLElement;

    protected setText(element: HTMLElement, text: string): void {
        if (element) {
            element.textContent = text;
        }
    }

    protected setDisabled(element: HTMLElement, disabled: boolean): void {
        if (element && 'disabled' in element) {
            (element as HTMLButtonElement).disabled = disabled;
        }
    }

    protected toggleClass(element: HTMLElement, className: string, state: boolean = true): void {
        if (element) {
            element.classList.toggle(className, state);
        }
    }

    protected setHidden(element: HTMLElement): void {
        if (element) {
            element.style.display = 'none';
        }
    }

    protected setVisible(element: HTMLElement): void {
        if (element) {
            element.style.display = 'block';
        }
    }

    protected setImage(element: HTMLImageElement, src: string, alt ? : string): void {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }
}