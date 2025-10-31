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
    WebLarekAPI
} from './services/WebLarekAPI';
import {
    Api
} from './components/base/Api';
import {
    apiProducts
} from './utils/data';


async function main() {
    console.log('=== ТЕСТИРОВАНИЕ МОДЕЛЕЙ ДАННЫХ ===');

    // Тестирование класса Catalog
    console.log('=== ТЕСТИРОВАНИЕ КАТАЛОГА ===');

    const catalog = new Catalog();
    console.log('1. Создан пустой каталог:', catalog.getProducts());

    // Сохраняем товары в каталог
    catalog.setProducts(apiProducts.items);
    console.log('2. Товары сохранены в каталог:', catalog.getProducts());

    // Покажем все ID для информации
    console.log('2.1. Все ID товаров:', apiProducts.items.map(item => item.id));

    // Получаем товар по реальному ID
    const realProductId = "854cef69-976d-4c2a-a18c-2aa45046c390";
    const product = catalog.getProductById(realProductId);
    console.log(`3. Товар с ID "${realProductId}":`, product);

    // Тестируем поиск несуществующего товара
    const nonExistentProduct = catalog.getProductById("non-existent-id");
    console.log('4. Поиск несуществующего товара:', nonExistentProduct);

    // Сохраняем товар для детального просмотра
    if (product) {
        catalog.setSelectedProduct(product);
        console.log('5. Товар сохранен для детального просмотра:', catalog.getSelectedProduct());
    }

    // Тестирование класса Cart
    console.log('=== ТЕСТИРОВАНИЕ КОРЗИНЫ ===');

    const cart = new Cart();
    console.log('1. Создана пустая корзина:', cart.getItems());

    // Добавляем товары в корзину (если товар найден)
    if (product) {
        cart.addItem(product);
        console.log('2. Товар добавлен в корзину:', cart.getItems());
        console.log('3. Общая стоимость корзины:', cart.getTotalPrice());
        console.log('4. Количество товаров в корзине:', cart.getTotalCount());

        // Добавляем еще один товар
        const secondProduct = catalog.getProductById("c101ab44-ed99-4a54-990d-47aa2bb4e7d9");
        if (secondProduct) {
            cart.addItem(secondProduct);
            console.log('5. Второй товар добавлен в корзину:', cart.getItems());
            console.log('6. Общая стоимость после двух товаров:', cart.getTotalPrice());
            console.log('7. Количество товаров после добавления:', cart.getTotalCount());

            // Проверяем наличие товаров в корзине
            console.log('8. Товар 1 в корзине?:', cart.contains(realProductId));
            console.log('9. Товар 2 в корзине?:', cart.contains("c101ab44-ed99-4a54-990d-47aa2bb4e7d9"));
            console.log('10. Несуществующий товар в корзине?:', cart.contains("non-existent"));

            // Удаляем один товар
            cart.removeItem(secondProduct);
            console.log('11. После удаления второго товара:', cart.getItems());
            console.log('12. Стоимость после удаления:', cart.getTotalPrice());
        }

        // Очищаем корзину
        cart.clear();
        console.log('13. Корзина после очистки:', cart.getItems());
    } else {
        console.log('2. Не удалось найти товар для добавления в корзину');
    }

    // Тестирование класса Buyer
    console.log('=== ТЕСТИРОВАНИЕ ПОКУПАТЕЛЯ ===');

    const buyer = new Buyer();
    console.log('1. Создан пустой покупатель:', buyer.getData());

    // Сохраняем данные частично
    buyer.setData({
        email: 'test@example.com',
        phone: '+79991234567'
    });
    console.log('2. Данные email и телефона сохранены:', buyer.getData());

    // Проверяем валидацию
    const validationErrors = buyer.validate();
    console.log('3. Ошибки валидации:', validationErrors);
    console.log('4. Все данные валидны?:', buyer.isValid());

    // Заполняем все данные
    buyer.setData({
        payment: 'card',
        address: 'Москва, ул. Примерная, 1'
    });
    console.log('5. Все данные заполнены:', buyer.getData());
    console.log('6. Все данные валидны теперь?:', buyer.isValid());

    console.log('=== ТЕСТИРОВАНИЕ МОДЕЛЕЙ ЗАВЕРШЕНО ===');


    console.log('=== ПРОВЕРКА СЕРВЕРА ===');

    try {
        // Простая проверка доступности сервера
        const response = await fetch('https://larek-api.nomoreparties.co');
        console.log('Статус сервера:', response.status);
        console.log('URL ответа:', response.url);

        if (response.redirected) {
            console.log('Сервер перенаправляет на:', response.url);
        }

        // Проверим заголовки
        console.log('Заголовки:', Object.fromEntries(response.headers.entries()));

    } catch (error) {
        console.error('Сервер не доступен:', error);
    }


    console.log('=== ТЕСТИРОВАНИЕ API ===');

    // Используем переменную окружения
    const API_BASE_URL = import.meta.env.VITE_API_ORIGIN;
    console.log('API Base URL:', API_BASE_URL);

    // Создаем экземпляр API
    const baseApi = new Api(API_BASE_URL);
    const api = new WebLarekAPI(baseApi);

    // Создаем новую модель каталога для API тестов
    const apiCatalog = new Catalog();

    try {
        console.log('1. Запрашиваем товары с сервера...');
        const products = await api.getProductList();
        console.log('2. Товары получены с сервера:', products);

        // Сохраняем товары в каталог
        apiCatalog.setProducts(products);
        console.log('3. Товары сохранены в каталог:', apiCatalog.getProducts());

        // Проверяем работу каталога
        if (products.length > 0) {
            const firstProduct = apiCatalog.getProductById(products[0].id);
            console.log('4. Первый товар из каталога:', firstProduct);
        }

        console.log('5. Общее количество товаров с сервера:', products.length);

    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
    }

    console.log('=== ВСЕ ТЕСТЫ ЗАВЕРШЕНЫ ===');
}

// Запускаем основную функцию
main().catch(error => {
    console.error('Ошибка в main:', error);
});

// Проверка, что файл загружается
console.log('main.ts загружен!');