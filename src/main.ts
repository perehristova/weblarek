import './scss/styles.scss';

import {
    Catalog
} from './components/Models/Catalog/Catalog';
import {
    Cart
} from './components/Models/Cart/Cart';
import {
    Buyer
} from './components/Models/Buyer/Buyer';
import {
    IProduct
} from './types';

import {
    WebLarekAPI
} from './services/WebLarekAPI';
import {
    Api
} from './components/base/Api';
import {
    API_URL
} from './utils/constants';

import {
    EventEmitter
} from './components/base/Events';
import {
    cloneTemplate
} from './utils/utils';

import {
    CatalogView
} from './components/view/layout/CatalogView';
import {
    CartView
} from './components/view/layout/CartView';
import {
    Header
} from './components/view/layout/Header';
import {
    Modal
} from './components/view/modals/Modal';
import {
    ProductModal
} from './components/view/modals/ProductModal';
import {
    SuccessModal
} from './components/view/modals/SuccessModal';
import {
    PaymentForm
} from './components/view/forms/PaymentForm';
import {
    ContactForm
} from './components/view/forms/ContactForm';


// ==========================================================
// ИНИЦИАЛИЗАЦИЯ
// ==========================================================

const events = new EventEmitter();

const baseApi = new Api(API_URL);
const api = new WebLarekAPI(baseApi);

const catalogModel = new Catalog(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

const templateBasket = cloneTemplate < HTMLElement > ('#basket');
const templateSuccess = cloneTemplate < HTMLElement > ('#success');
const templateOrder = cloneTemplate < HTMLFormElement > ('#order');
const templateContacts = cloneTemplate < HTMLFormElement > ('#contacts');
const templatePreview = cloneTemplate < HTMLElement > ('#card-preview');


const catalogView = new CatalogView(document.querySelector('.gallery') !, events);
const cartView = new CartView(templateBasket, events);
const header = new Header(document.querySelector('.header') !, events);
const modal = new Modal(document.getElementById('modal-container') !, events);

const productModal = new ProductModal(modal, events, templatePreview);
const successModal = new SuccessModal(templateSuccess, events);

const paymentForm = new PaymentForm(events, templateOrder);
const contactForm = new ContactForm(events, templateContacts);


let tempProduct: IProduct | null = null;


// ==========================================================
// ОБРАБОТЧИКИ СОБЫТИЙ
// ==========================================================

// --- Общие события ---
events.on('modal:open', () => {
    header.setLocked(true);
});

events.on('modal:close', () => {
    header.setLocked(false);
    tempProduct = null;
});


// --- Каталог ---
events.on('catalog:changed', (products: IProduct[]) => {
    catalogView.render(products);
});

events.on('card:select', (data: {
    id: string
}) => {
    const product = catalogModel.getProductById(data.id);

    if (product) {
        tempProduct = product;
        const inCart = cartModel.contains(product.id);

        productModal.open(product, inCart);
    }
});


// --- Корзина и покупка ---

events.on('cart:changed', () => {
    const items = cartModel.getItems();
    const total = cartModel.getTotalPrice();
    const count = cartModel.getTotalCount();

    header.render(count);
    cartView.render({
        items,
        total
    });
});

events.on('card:add', (data: {
    id: string,
    fromModal: boolean
}) => {
    const product = data.fromModal && tempProduct && tempProduct.id === data.id ?
        tempProduct :
        catalogModel.getProductById(data.id);

    if (product) {
        cartModel.addItem(product);

        if (data.fromModal) {
            const inCart = cartModel.contains(product.id);
            productModal.updateCartState(product, inCart);
        }
    }
});

events.on('card:remove', (data: {
    id: string,
    fromModal: boolean
}) => {
    const product = cartModel.getItems().find(item => item.id === data.id);

    if (product) {
        cartModel.removeItem(product);

        if (data.fromModal && tempProduct && tempProduct.id === data.id) {
            const inCart = cartModel.contains(product.id);
            productModal.updateCartState(tempProduct, inCart);
        }
    }
});

events.on('basket:open', () => {
    const items = cartModel.getItems();
    const total = cartModel.getTotalPrice();
    const cartContent = cartView.render({
        items,
        total
    });
    modal.open(cartContent);
});

events.on('cart:checkout', () => {
    modal.close();
    const formContent = paymentForm.render(buyerModel.getData());
    modal.open(formContent);
});


// --- Формы и валидация ---

events.on('payment:change', (data: any) => {
    buyerModel.setData(data);
    const errors = buyerModel.validatePayment();
    paymentForm.setErrors(errors);
});

events.on('contact:change', (data: any) => {
    buyerModel.setData(data);
    const errors = buyerModel.validateContacts();
    contactForm.setErrors(errors);
});

events.on('payment:submit', (data: any) => {
    buyerModel.setData(data);
    const errors = buyerModel.validatePayment();

    if (Object.keys(errors).length === 0) {
        modal.close();
        const formContent = contactForm.render(buyerModel.getData());
        modal.open(formContent);
    } else {
        paymentForm.setErrors(errors);
    }
});

events.on('contact:submit', async (data: any) => {
    buyerModel.setData(data);
    const errors = buyerModel.validateContacts();

    if (Object.keys(errors).length > 0) {
        contactForm.setErrors(errors);
        return;
    }

    try {
        const orderData = {
            payment: buyerModel.getData().payment,
            email: buyerModel.getData().email,
            phone: buyerModel.getData().phone,
            address: buyerModel.getData().address,
            items: cartModel.getItems().map(item => item.id),
            total: cartModel.getTotalPrice()
        };

        const result = await api.createOrder(orderData);

        modal.close();

        const successContent = successModal.render({
            total: result.total
        });
        modal.open(successContent);

        cartModel.clear();
        buyerModel.clear();

    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
    }
});

events.on('success:close', () => {
    modal.close();
});


// ==========================================================
// ЗАГРУЗКА ДАННЫХ ПРИ СТАРТЕ
// ==========================================================
(async () => {
    try {
        const products = await api.getProductList();
        catalogModel.setProducts(products);
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
    }
})();