import {
    Component
} from './Component';
import {
    EventEmitter
} from '../../base/Events';

export abstract class Form < T > extends Component < T > {
    protected events: EventEmitter;
    protected formElement: HTMLFormElement;
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(events: EventEmitter, container: HTMLElement) {
        super(container);

        this.events = events;
        this.formElement = this.container as HTMLFormElement;
        this.submitButton = this.container.querySelector('button[type="submit"]') !;
        this.errorsElement = this.container.querySelector('.form__errors') !;

        this.setupEventListeners();
    }

    protected setupEventListeners(): void {
        this.formElement.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleSubmit();
        });
    }

    protected abstract handleSubmit(): void;
    protected abstract validate(): Record < string,
    string > ;

    protected updateSubmitButton(): void {
        const errors = this.validate();
        this.setDisabled(this.submitButton, Object.keys(errors).length > 0);
    }

    protected showErrors(errors: Record < string, string > ): void {
        const errorMessages = Object.values(errors).join(', ');
        this.setText(this.errorsElement, errorMessages);
    }

    protected clearErrors(): void {
        this.setText(this.errorsElement, '');
    }

    protected resetForm(): void {
        this.formElement.reset();
        this.clearErrors();
        this.updateSubmitButton();
    }
}