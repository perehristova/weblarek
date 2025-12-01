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
    IProduct,
    IBuyer,
    TPayment
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
    SuccessModal
} from './components/view/modals/SuccessModal';
import {
    PaymentForm
} from './components/view/forms/PaymentForm';
import {
    ContactForm
} from './components/view/forms/ContactForm';
import {
    CatalogCard
} from './components/view/cards/CatalogCard';
import {
    CartCard
} from './components/view/cards/CartCard';
import {
    PreviewCard
} from './components/view/cards/PreviewCard';

// Инициализация
const events = new EventEmitter();
const baseApi = new Api(API_URL);
const api = new WebLarekAPI(baseApi);
const catalogModel = new Catalog(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

// Создание элементов из шаблонов
const templateBasket = cloneTemplate < HTMLElement > ('#basket');
const templateSuccess = cloneTemplate < HTMLElement > ('#success');
const templateOrder = cloneTemplate < HTMLFormElement > ('#order');
const templateContacts = cloneTemplate < HTMLFormElement > ('#contacts');
const previewElement = cloneTemplate < HTMLElement > ('#card-preview');

// Создание представлений
const catalogView = new CatalogView(document.querySelector('.gallery') !);
const cartView = new CartView(events, templateBasket);
const header = new Header(document.querySelector('.header') !);
const modal = new Modal(document.getElementById('modal-container') !, events);
const successModal = new SuccessModal(templateSuccess, events);
const paymentForm = new PaymentForm(events, templateOrder);
const contactForm = new ContactForm(events, templateContacts);
const previewCard = new PreviewCard(events, previewElement);

// ========================================================== 
// ОБРАБОТЧИКИ СОБЫТИЙ 
// ========================================================== 

// Загрузка каталога
events.on('catalog:changed', (products: IProduct[]) => {
    const cardElements = products.map(product => {
        const cardElement = cloneTemplate < HTMLElement > ('#card-catalog');
        const card = new CatalogCard(events, cardElement);
        return card.render(product);
    });
    catalogView.items = cardElements;
});

// Открытие превью товара
events.on('card:select', (data: {
    id: string
}) => {
    const product = catalogModel.getProductById(data.id);
    if (product) {
        const inCart = cartModel.contains(product.id);
        let buttonText = 'Купить';
        let buttonDisabled = false;
        if (!product.price) {
            buttonText = 'Недоступно';
            buttonDisabled = true;
        } else if (inCart) {
            buttonText = 'Удалить из корзины';
        }
        previewCard.render(product, buttonText, buttonDisabled);
        modal.open(previewElement);
    }
});

// Обновление корзины
events.on('cart:changed', () => {
    const items = cartModel.getItems();
    const total = cartModel.getTotalPrice();
    const count = cartModel.getTotalCount();

    header.counter = count;

    const cardElements = items.map((item, index) => {
        const cardElement = cloneTemplate < HTMLElement > ('#card-basket');
        const card = new CartCard(events, cardElement);
        return card.render({
            product: item,
            index: index
        });
    });

    cartView.items = cardElements;
    cartView.total = total;

    // Обновляем превью если оно открыто
    // Получаем текущий открытый товар из модели каталога
    const currentProduct = catalogModel.getSelectedProduct();
    if (currentProduct && modal.isOpen()) {
        // Перерисовываем превью с актуальным состоянием
        const inCart = cartModel.contains(currentProduct.id);
        let buttonText = 'Купить';
        let buttonDisabled = false;
        if (!currentProduct.price) {
            buttonText = 'Недоступно';
            buttonDisabled = true;
        } else if (inCart) {
            buttonText = 'Удалить из корзины';
        }
        previewCard.render(currentProduct, buttonText, buttonDisabled);
    }
});

// Открытие превью товара
events.on('card:select', (data: {
    id: string
}) => {
    const product = catalogModel.getProductById(data.id);
    if (product) {
        // Сохраняем какой товар сейчас просматриваем
        catalogModel.setSelectedProduct(product);

        const inCart = cartModel.contains(product.id);
        let buttonText = 'Купить';
        let buttonDisabled = false;
        if (!product.price) {
            buttonText = 'Недоступно';
            buttonDisabled = true;
        } else if (inCart) {
            buttonText = 'Удалить из корзины';
        }
        previewCard.render(product, buttonText, buttonDisabled);
        modal.open(previewElement);
    }
});

// Добавление товара в корзину
events.on('card:add', (data: {
    id: string
}) => {
    const product = catalogModel.getProductById(data.id);
    if (product && product.price) {
        cartModel.addItem(product);
    }
});

// Удаление товара из корзины
events.on('card:remove', (data: {
    id: string
}) => {
    const product = cartModel.getItems().find(item => item.id === data.id);
    if (product) {
        cartModel.removeItem(product);
    }
});

// Обработка кнопки в превью
events.on('preview:button-click', (data: {
    id: string
}) => {
    const product = catalogModel.getProductById(data.id);
    if (product) {
        if (cartModel.contains(product.id)) {
            events.emit('card:remove', {
                id: product.id
            });
        } else {
            events.emit('card:add', {
                id: product.id
            });
        }
    }
});

// Открытие корзины
events.on('basket:open', () => {
    modal.open(templateBasket);
});

// Оформление заказа
events.on('cart:checkout', () => {
    if (cartModel.getTotalCount() === 0) return;
    modal.close();
    paymentForm.render(buyerModel.getData());
    modal.open(templateOrder);
});

// --- ОБРАБОТКА ФОРМ ---
events.on('payment:method:click', (data: {
    method: TPayment
}) => {
    buyerModel.setData({
        payment: data.method
    });
});

events.on('payment:address:input', (data: {
    address: string
}) => {
    buyerModel.setData({
        address: data.address
    });
});

events.on('contact:email:input', (data: {
    email: string
}) => {
    buyerModel.setData({
        email: data.email
    });
});

events.on('contact:phone:input', (data: {
    phone: string
}) => {
    buyerModel.setData({
        phone: data.phone
    });
});

// Обновление данных покупателя
events.on('buyer:changed', (data: IBuyer) => {
    paymentForm.render(data);
    contactForm.render(data);
    const errors = buyerModel.validate();
    paymentForm.setErrors({
        payment: errors.payment,
        address: errors.address
    });
    contactForm.setErrors({
        email: errors.email,
        phone: errors.phone
    });
});

// Отправка формы оплаты
events.on('payment:form:submit', () => {
    const errors = buyerModel.validate();
    if (!errors.payment && !errors.address) {
        modal.close();
        modal.open(templateContacts);
    }
});

// Отправка формы контактов
events.on('contact:form:submit', async () => {
    try {
        if (!buyerModel.isValid()) return;

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
        successModal.data = {
            total: result.total
        };
        modal.open(templateSuccess);
        cartModel.clear();
        buyerModel.clear();
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
    }
});

// Закрытие успешного заказа
events.on('success:close', () => {
    modal.close();
});

// Обработчик кнопки корзины в шапке
document.querySelector('.header__basket')?.addEventListener('click', () => {
    events.emit('basket:open');
});

// Загрузка товаров
(async () => {
    try {
        const products = await api.getProductList();
        catalogModel.setProducts(products);
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
    }
})();