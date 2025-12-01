import {
    Form
} from '../base/Form';
import {
    IBuyer,
    TPayment
} from '../../../types';
import {
    IEvents
} from '../../base/Events';

export class PaymentForm extends Form<Partial<Pick<IBuyer, 'payment' | 'address'>>> {
    private paymentButtons: NodeListOf<HTMLButtonElement>;
    private addressInput: HTMLInputElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);
        this.paymentButtons = this.container.querySelectorAll('button[name]');
        this.addressInput = this.container.querySelector('input[name="address"]')!;
        this.setupPaymentListeners();
    }

    private setupPaymentListeners(): void {
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.events.emit('payment:method:click', { 
                    method: button.name as TPayment 
                });
            });
        });

        this.addressInput.addEventListener('input', () => {
            this.events.emit('payment:address:input', { 
                address: this.addressInput.value.trim() 
            });
        });
    }

    protected handleSubmit(): void {
        this.events.emit('payment:form:submit');
    }

    render(data: Partial<Pick<IBuyer, 'payment' | 'address'>>): HTMLElement {
        this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
        
        if (data.payment) {
            const activeButton = Array.from(this.paymentButtons)
                .find(btn => btn.name === data.payment);
            if (activeButton) activeButton.classList.add('button_alt-active');
        }
        
        this.addressInput.value = data.address || '';
        this.submitButton.disabled = !data.payment;
        
        return this.container;
    }
}