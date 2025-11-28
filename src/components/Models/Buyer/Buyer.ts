import {
    IBuyer,
    IValidationErrors
} from '../../../types/index';

export class Buyer {
    private data: IBuyer = {
        payment: '',
        email: '',
        phone: '',
        address: ''
    };

    setData(data: Partial < IBuyer > ): void {
        this.data = {
            ...this.data,
            ...data
        };
    }

    getData(): IBuyer {
        return {
            ...this.data
        };
    }

    clear(): void {
        this.data = {
            payment: '',
            email: '',
            phone: '',
            address: ''
        };
    }

    validate(): IValidationErrors {
        const errors: IValidationErrors = {};

        if (!this.data.payment) {
            errors.payment = 'Не выбран вид оплаты';
        }

        if (!this.data.email.trim()) {
            errors.email = 'Укажите email';
        }

        if (!this.data.phone.trim()) {
            errors.phone = 'Укажите телефон';
        }

        if (!this.data.address.trim()) {
            errors.address = 'Укажите адрес';
        }

        return errors;
    }

    isValid(): boolean {
        const errors = this.validate();
        return Object.keys(errors).length === 0;
    }
}