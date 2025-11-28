import './scss/styles.scss';
import { Catalog } from './components/Models/Catalog/Catalog';
import { Cart } from './components/Models/Cart/Cart';
import { Buyer } from './components/Models/Buyer/Buyer';
import { WebLarekAPI } from './services/WebLarekAPI';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';

// Компоненты View
import { CatalogView } from './components/view/layout/CatalogView';
import { CartView } from './components/view/layout/CartView';
import { Header } from './components/view/layout/Header';
import { Modal } from './components/view/modals/Modal';
import { ProductModal } from './components/view/modals/ProductModal';
import { SuccessModal } from './components/view/modals/SuccessModal';
import { PaymentForm } from './components/view/forms/PaymentForm';
import { ContactForm } from './components/view/forms/ContactForm';

// Менеджер событий
const events = new EventEmitter();

// Инициализация API
const baseApi = new Api(API_URL);
const api = new WebLarekAPI(baseApi);

// Инициализация моделей данных
const catalogModel = new Catalog();
const cartModel = new Cart();
const buyerModel = new Buyer();

// ===== ОБЕРТКИ ДЛЯ РАБОТЫ С СОБЫТИЯМИ В ПРЕЗЕНТЕРЕ =====

function setCatalogProducts(products: any[]) {
    catalogModel.setProducts(products);
    events.emit('catalog:changed', products);
}

function addToCart(product: any) {
    cartModel.addItem(product);
    events.emit('cart:changed');
}

function removeFromCart(product: any) {
    cartModel.removeItem(product);
    events.emit('cart:changed');
}

function clearCart() {
    cartModel.clear();
    events.emit('cart:changed');
}

function setBuyerData(data: any) {
    buyerModel.setData(data);
    events.emit('buyer:changed', buyerModel.getData());
}

function clearBuyer() {
    buyerModel.clear();
    events.emit('buyer:changed', buyerModel.getData());
}

// Создание компонентов
const catalogView = new CatalogView(events);
const cartView = new CartView(events);
const header = new Header(events);
const modal = new Modal(events);
const productModal = new ProductModal(events, modal);
const successModal = new SuccessModal(events);
const paymentForm = new PaymentForm(events);
const contactForm = new ContactForm(events);

// ===== ОБРАБОТКА СОБЫТИЙ КАТАЛОГА =====

events.on('catalog:changed', (products: any) => {
    catalogView.render(products);
});

events.on('card:select', (data: any) => {
    const inCart = cartModel.contains(data.product.id);
    productModal.open(data.product, inCart);
});

events.on('card:add', (data: any) => {
    addToCart(data.product);
    if (data.fromModal) {
        productModal.open(data.product, true);
    } else {
        productModal.close();
    }
});

events.on('card:remove', (data: any) => {
    removeFromCart(data.product);
    if (data.fromModal) {
        productModal.open(data.product, false);
    }
});

// ===== ОБРАБОТКА СОБЫТИЙ КОРЗИНЫ =====

events.on('cart:changed', () => {
    const items = cartModel.getItems();
    const total = cartModel.getTotalPrice();
    const count = cartModel.getTotalCount();
    
    header.render(count);
    cartView.render({ items, total });
});

events.on('cart:open', () => {
    const items = cartModel.getItems();
    const total = cartModel.getTotalPrice();
    const cartContent = cartView.render({ items, total });
    modal.open(cartContent);
});

events.on('cart:checkout', () => {
    modal.close();
    const formContent = paymentForm.render(buyerModel.getData());
    modal.open(formContent);
});

// ===== ОБРАБОТКА ФОРМ ЗАКАЗА =====

events.on('payment:submit', (data: any) => {
    setBuyerData(data);
    modal.close();
    const formContent = contactForm.render(buyerModel.getData());
    modal.open(formContent);
});

events.on('contact:submit', async (data: any) => { // ← ДОБАВЛЕН async
    setBuyerData(data);
    
    try {
        const orderData = {
            payment: buyerModel.getData().payment,
            email: buyerModel.getData().email,
            phone: buyerModel.getData().phone,
            address: buyerModel.getData().address,
            items: cartModel.getItems().map(item => item.id),
            total: cartModel.getTotalPrice()
        };

        await api.createOrder(orderData);
        
        modal.close();
        successModal.open(modal, { total: cartModel.getTotalPrice() });
        
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
    }
});

events.on('success:close', () => {
    clearCart();
    clearBuyer();
    modal.close();
});

// Загрузка товаров с сервера
(async () => {
    try {
        const products = await api.getProductList();
        setCatalogProducts(products);
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
    }
})();