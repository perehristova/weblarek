/**
 * Базовый компонент
 */
export abstract class Component < T > {
    protected constructor(protected readonly container: HTMLElement) {}

    // Устанавливает текстовое содержимое элемента
    protected setText(element: HTMLElement, value: string): void {
        element.textContent = value;
    }

    // Переключает класс на элементе
    protected toggleClass(element: HTMLElement, className: string, state: boolean = true): void {
        element.classList.toggle(className, state);
    }

    // Устанавливает состояние disabled
    protected setDisabled(element: HTMLButtonElement | HTMLInputElement, state: boolean): void {
        element.disabled = state;
    }

    // Базовый метод рендеринга
    render(data ? : Partial < T > ): HTMLElement {
        return this.container;
    }
}