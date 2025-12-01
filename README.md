# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
src/
├── components/
│   ├── base/           # Базовые классы
│   │   ├── Api.ts
│   │   ├── Component.ts
│   │   ├── Events.ts
│   ├── Models/         # Модели данных
│   │   ├── Catalog/
│   │   ├── Cart/
│   │   └── Buyer/
│   └── view/           # Компоненты представления
│       ├── base/       # Базовые компоненты
│       ├── cards/      # Карточки товаров
│       ├── layout/     # Компоненты макета
│       ├── modals/     # Модальные окна
│       └── forms/      # Формы
├── services/           # Сервисы API
├── types/             # Типы TypeScript
├── utils/             # Утилиты и константы
└── vendor/            # Стили и ресурсы

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Базовый класс для компонентов интерфейса. Находится в `src/components/base/Component.ts`.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент.  
`setText(element: HTMLElement, value: string): void` - устанавливает текстовое содержимое элемента  
`toggleClass(element: HTMLElement, className: string, state?: boolean): void` - переключает класс элемента  
`setDisabled(element: HTMLButtonElement | HTMLInputElement, state: boolean): void` - устанавливает состояние disabled

#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get<T extends object>(uri: string): Promise<T>` - выполняет GET запрос и возвращает типизированный промис  
`post<T extends object>(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<T>` - выполняет POST, PUT или DELETE запрос  
`handleResponse<T>(response: Response): Promise<T>` - защищенный метод обработки ответа сервера

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>` - хранит коллекцию подписок на события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие  
`emit<T extends object>(event: string, data?: T): void` - инициализация события  
`off(event: EventName, callback: Subscriber): void` - отписка от события  
`onAll(callback: (event: EmitterEvent) => void): void` - подписка на все события  
`offAll(): void` - отписка от всех событий  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - создает функцию-триггер для события

## Данные

### Интерфейсы данных

#### Интерфейс товара (IProduct)
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

#### Интерфейс покупателя (IBuyer)

type TPayment = 'card' | 'cash' | '';

interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

#### Интерфейс ошибок валидации (IValidationErrors)

interface IValidationErrors {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
}

### Типы для API

export interface IOrderResult {
  id: string;
  total: number;
}

export interface IOrderRequest extends IBuyer {
  items: string[];
  total: number;
}

export interface IProductList {
  total: number;
  items: IProduct[];
}

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

## Модели данных

### Класс (Catalog)

Управляет каталогом товаров.

Конструктор: constructor(events: IEvents)

Поля класса:
private products: IProduct[] - массив товаров каталога
private selectedProduct: IProduct | null - выбранный для просмотра товар

Методы:
setProducts(products: IProduct[]): void - сохраняет массив товаров (генерирует событие catalog:changed)
getProducts(): IProduct[] - возвращает массив всех товаров
getProductById(id: string): IProduct | undefined - возвращает товар по ID
setSelectedProduct(product: IProduct): void - сохраняет товар для детального просмотра
getSelectedProduct(): IProduct | null - возвращает выбранный товар

### Класс (Cart)

Управляет корзиной покупок.

Конструктор: constructor(events: IEvents)

Поля класса:
private items: IProduct[] - массив товаров в корзине

Методы:
addItem(product: IProduct): void - добавляет товар в корзину (генерирует событие cart:changed)
removeItem(product: IProduct): void - удаляет товар из корзины (генерирует событие cart:changed)
clear(): void - очищает корзину (генерирует событие cart:changed)
getItems(): IProduct[] - возвращает все товары корзины
getTotalPrice(): number - возвращает общую стоимость
getTotalCount(): number - возвращает количество товаров
contains(productId: string): boolean - проверяет наличие товара

### Класс (Buyer)

Управляет данными покупателя.

Конструктор: constructor(events: IEvents)

Поля класса:
private data: IBuyer - данные покупателя

Методы:
setData(data: Partial<IBuyer>): void - сохраняет данные (генерирует событие buyer:changed)
getData(): IBuyer - возвращает все данные
clear(): void - очищает данные (генерирует событие buyer:changed)
validate(): IValidationErrors - валидирует данные, возвращает ошибки
isValid(): boolean - проверяет валидность всех данных

## Слой коммуникации

### Класс (WebLarekAPI)

Обеспечивает взаимодействие с сервером.

Конструктор: constructor(api: IApi)

Методы:
getProductList(): Promise<IProduct[]> - получает список товаров с сервера
createOrder(order: IOrderRequest): Promise<IOrderResult> - отправляет заказ на сервер

## Компоненты представления

### Базовые классы представления

#### Класс (Card)

Базовый класс для карточек товаров. Находится в src/components/view/base/Card.ts.

Конструктор: constructor(container: HTMLElement)

Поля класса:
protected container: HTMLElement - корневой элемент
protected titleElement: HTMLElement - элемент названия
protected priceElement: HTMLElement - элемент цены

Методы:
protected setTitle(title: string): void - устанавливает название
protected setPrice(price: number | null): void - устанавливает цену
protected setDisabled(element: HTMLElement, disabled: boolean): void - устанавливает disabled

#### Класс (Form)

Базовый класс для форм. Находится в src/components/view/base/Form.ts.

Конструктор: constructor(events: IEvents, container: HTMLElement)

Поля класса:
protected container: HTMLElement - корневой элемент формы
protected events: IEvents - брокер событий
protected formElement: HTMLFormElement - элемент формы
protected submitButton: HTMLButtonElement - кнопка отправки
protected errorsElement: HTMLElement - элемент для ошибок

Методы:
protected abstract handleSubmit(): void - абстрактный метод обработки отправки
protected setupEventListeners(): void - настройка слушателей событий
setErrors(errors: Partial<IValidationErrors>): void - установка ошибок валидации
render(data?: T): HTMLElement - отображение данных формы

### Карточки товаров

#### Класс (CatalogCard)

Карточка товара в каталоге. Наследуется от Card.

Конструктор: constructor(events: IEvents, container: HTMLElement)

Методы:
set product(value: IProduct) - сеттер для данных товара
render(product: IProduct): HTMLElement - отображение карточки
Генерирует события: card:select, card:add

#### Класс (PreviewCard)

Карточка товара в модальном окне. Наследуется от Card.

Конструктор: constructor(events: IEvents, container: HTMLElement)

Методы:
set product(value: IProduct) - сеттер для данных товара
set buttonText(value: string) - сеттер для текста кнопки
set buttonDisabled(value: boolean) - сеттер для состояния кнопки
render(product: IProduct, buttonText: string, buttonDisabled: boolean): HTMLElement - отображение
Генерирует событие: preview:button-click

#### Класс (CartCard)

Карточка товара в корзине. Наследуется от Card.

Конструктор: constructor(events: IEvents, container: HTMLElement)

Методы:
set product(value: IProduct) - сеттер для данных товара
set index(value: number) - сеттер для индекса
render(data: { product: IProduct; index: number }): HTMLElement - отображение
Генерирует событие: card:remove

### Формы

#### Класс (PaymentForm)

Форма оплаты и адреса доставки. Наследуется от Form.

Конструктор: constructor(events: IEvents, container: HTMLElement)

Методы:
render(data: Partial<Pick<IBuyer, 'payment' | 'address'>>): HTMLElement - отображение
Генерирует события: payment:method:click, payment:address:input, payment:form:submit

#### Класс (ContactForm)

Форма контактов покупателя. Наследуется от Form.

Конструктор: constructor(events: IEvents, container: HTMLElement)

Методы:
render(data: Partial<Pick<IBuyer, 'email' | 'phone'>>): HTMLElement - отображение
Генерирует события: contact:email:input, contact:phone:input, contact:form:submit

### Компоновщики

#### Класс (CatalogView)

Отображение каталога товаров.

Конструктор: constructor(container: HTMLElement)

Методы:
set items(items: HTMLElement[]) - сеттер для элементов карточек
render(items: HTMLElement[]): HTMLElement - отображение каталога

#### Класс (CartView)

Отображение корзины покупок.

Конструктор: constructor(events: IEvents, container: HTMLElement)

Методы:
set items(items: HTMLElement[]) - сеттер для элементов карточек
set total(total: number) - сеттер для общей суммы
Генерирует событие: cart:checkout

#### Класс (Header)

Шапка сайта с счетчиком корзины.

Конструктор: constructor(container: HTMLElement)

Методы:
set counter(value: number) - сеттер для счетчика корзины

### Модальные окна

#### Класс (Modal)

Базовое модальное окно.

Конструктор: constructor(container: HTMLElement, events: IEvents)

Методы:
open(content?: HTMLElement): void - открытие окна
close(): void - закрытие окна
setContent(content: HTMLElement): void - установка содержимого
isOpen(): boolean - проверка открыто ли окно

#### Класс (SuccessModal)

Модальное окно успешного оформления заказа.

Конструктор: constructor(container: HTMLElement, events: IEvents)

Методы:
set data(value: { total: number }) - сеттер для данных
render(data: { total: number }): HTMLElement - отображение
Генерирует событие: success:close

### Презентер

Презентер находится в файле src/main.ts и содержит всю бизнес-логику приложения:

1. Инициализацию всех компонентов

2. Обработку событий от моделей и представлений

3. Управление потоком данных

4. Координацию взаимодействия между слоями

Основные обрабатываемые события:

* catalog:changed - обновление каталога

* cart:changed - изменение корзины

* buyer:changed - изменение данных покупателя

* card:select, card:add, card:remove - действия с товарами

* basket:open, cart:checkout - работа с корзиной

* payment:*, contact:* - работа с формами

* success:close - завершение заказа

### Событийная модель

Все взаимодействия в приложении происходят через события. Каждое действие пользователя или изменение данных генерирует событие, которое обрабатывается презентером для обновления состояния приложения.