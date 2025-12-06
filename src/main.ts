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
const header = new Header(document.querySelector('.header') !, events);
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
        const card = new CatalogCard(events, cardElement, product.id);
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

        previewCard.render({
            ...product,
            buttonText,
            buttonDisabled
        });
        modal.open(previewElement);
    }
});

events.on('cart:changed', () => {
    // Получаем актуальные данные из Модели Корзины
    const items = cartModel.getItems();
    const total = cartModel.getTotalPrice();
    const count = cartModel.getTotalCount();

    // 1. Обновляем счетчик в шапке
    header.counter = count;

    // 2. Генерируем элементы для списка корзины
    const cardElements = items.map((item, index) => {
        const cardElement = cloneTemplate < HTMLElement > ('#card-basket');
        const card = new CartCard(events, cardElement, item.id);

        return card.render({
            product: item,
            index: index
        });
    });

    // 3. Обновляем представление Корзины (список и общую цену)
    cartView.items = cardElements;
    cartView.total = total;

    // 4. Обновляем превью, если оно открыто
    const selectedProduct = catalogModel.getSelectedProduct();
    if (selectedProduct) {
        const inCart = cartModel.contains(selectedProduct.id);
        let buttonText = 'Купить';
        let buttonDisabled = false;

        if (!selectedProduct.price) {
            buttonText = 'Недоступно';
            buttonDisabled = true;
        } else if (inCart) {
            buttonText = 'Удалить из корзины';
        }

        previewCard.render({
            ...selectedProduct,
            buttonText,
            buttonDisabled
        });
    }
});

// Добавление товара в модель
events.on('card:add', (data: {
    id: string
}) => {
    const product = catalogModel.getProductById(data.id);
    if (product && product.price) {
        cartModel.addItem(product);
    }
});

// Удаление товара из модели
events.on('card:remove', (data: {
    id: string
}) => {
    const product = catalogModel.getProductById(data.id);
    if (product) {
        cartModel.removeItem(product);
    }
});

events.on('preview:button-click', () => {
    const currentProduct = catalogModel.getSelectedProduct();

    if (currentProduct) {
        if (cartModel.contains(currentProduct.id)) {
            cartModel.removeItem(currentProduct);
        } else {
            cartModel.addItem(currentProduct);
        }
    }
});

// Открытие корзины 
events.on('basket:open', () => {
    modal.open(cartView.render());
});

events.on('cart:checkout', () => {
    modal.close();

    try {
        modal.open(paymentForm.render(buyerModel.getData()));
    } catch (error) {
        console.error('Ошибка при открытии формы оплаты:', error);
    }
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
    modal.close();

    const contactData = buyerModel.getData();
    const contactElement = contactForm.render(contactData as any);

    contactForm.clearErrors();

    modal.open(contactElement);
});


// Отправка формы контактов 
events.on('contact:form:submit', async () => {
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

        successModal.data = {
            total: result.total
        };

        modal.open(successModal.render());

        cartModel.clear();
        buyerModel.clear();
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
    }
});

// Закрытие модального окна по событию
events.on('modal:close', () => {
    modal.close();
    catalogModel.setSelectedProduct(null);
});

// Открытие модального окна
events.on('modal:open', () => {});

// Закрытие успешного заказа 
events.on('success:close', () => {
    modal.close();
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

events.emit('cart:changed');