import {
    Form
} from '../base/Form';
import {
    IBuyer
} from '../../../types';
import {
    EventEmitter
} from '../../base/Events';

// Тип T уменьшен до необходимого минимума
export class ContactForm extends Form < Partial < Pick < IBuyer, 'email' | 'phone' >>> {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;

    constructor(events: EventEmitter, container: HTMLElement) {
        super(events, container);

        this.emailInput = this.container.querySelector('input[name="email"]') !;
        this.phoneInput = this.container.querySelector('input[name="phone"]') !;

        this.setupFieldListeners();
    }

    private setupFieldListeners(): void {
        this.emailInput.addEventListener('input', () => {
            this.emitChange();
        });

        this.phoneInput.addEventListener('input', () => {
            this.emitChange();
        });
    }

    private emitChange(): void {
        const formData = this.getFormData();
        this.events.emit('contact:change', formData);
    }

    protected handleSubmit(): void {
        const formData = this.getFormData();
        this.events.emit('contact:submit', formData);
    }

    private getFormData(): Partial < IBuyer > {
        return {
            email: this.emailInput.value.trim(),
            phone: this.phoneInput.value.trim()
        };
    }

    render(data: Partial < Pick < IBuyer, 'email' | 'phone' >> ): HTMLElement {
        super.render(data);

        if (data.email) {
            this.emailInput.value = data.email;
        }
        if (data.phone) {
            this.phoneInput.value = data.phone;
        }

        return this.container;
    }
}