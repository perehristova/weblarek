import {
    Form
} from '../base/Form';
import {
    IBuyer
} from '../../../types';
import {
    IEvents
} from '../../base/Events';

export class ContactForm extends Form < Partial < Pick < IBuyer, 'email' | 'phone' >>> {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);
        this.emailInput = this.container.querySelector('input[name="email"]') !;
        this.phoneInput = this.container.querySelector('input[name="phone"]') !;
        this.setupFieldListeners();
    }

    private setupFieldListeners(): void {
        this.emailInput.addEventListener('input', () => {
            this.events.emit('contact:email:input', {
                email: this.emailInput.value.trim()
            });
        });

        this.phoneInput.addEventListener('input', () => {
            this.events.emit('contact:phone:input', {
                phone: this.phoneInput.value.trim()
            });
        });
    }

    protected handleSubmit(): void {
        this.events.emit('contact:form:submit');
    }

    render(data: Partial < Pick < IBuyer, 'email' | 'phone' >> ): HTMLElement {
        this.emailInput.value = data.email || '';
        this.phoneInput.value = data.phone || '';
        return this.container;
    }
}