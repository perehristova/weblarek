# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
src/
├── components/
│   ├── base/           # Базовые классы
│   │   ├── Api.ts
│   │   ├── Component.ts
│   │   ├── Events.ts
│   │   └── Form.ts
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
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Card
Базовый класс для карточек товаров. Наследуется от Component.

**Методы:**  
`setCategory(category: string): void` - установка категории товара с применением соответствующих стилей из categoryMap

#### Класс Form  
Базовый класс для форм. Наследуется от Component.

Методы:
`protected abstract handleSubmit(): void` - обработчик отправки формы
`protected abstract validate(): Record<string, string>` - валидация данных
`protected updateSubmitButton(): void` - обновление кнопки отправки

#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

# Данные

## Интерфейсы данных

### Интерфейс товара (IProduct)

interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

### Интерфейс покупателя (IBuyer)

type TPayment = 'card' | 'cash' | '';

interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

### Интерфейс ошибок валидации (IValidationErrors)

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

export interface IOrderRequest {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  items: string[];
}

export interface IProductList {
  total: number;
  items: IProduct[];
}

## Модели данных

### Класс (Catalog)

constructor()

private products: IProduct[] - хранит массив всех товаров каталога

private selectedProduct: IProduct | null - хранит товар, выбранный для детального просмотра

// Сохраняет массив товаров в каталог
setProducts(products: IProduct[]): void

// Возвращает массив всех товаров каталога
getProducts(): IProduct[]

// Возвращает товар по идентификатору или undefined если не найден
getProductById(id: string): IProduct | undefined

// Сохраняет товар для детального просмотра
setSelectedProduct(product: IProduct): void

// Возвращает товар, выбранный для детального просмотра
getSelectedProduct(): IProduct | null

### Класс (Cart)

constructor()

private items: IProduct[] - хранит массив товаров, добавленных в корзину

// Возвращает массив всех товаров в корзине
getItems(): IProduct[]

// Добавляет товар в корзину
addItem(product: IProduct): void

// Удаляет товар из корзины  
removeItem(product: IProduct): void

// Очищает корзину (удаляет все товары)
clear(): void

// Возвращает общую стоимость всех товаров в корзине
getTotalPrice(): number

// Возвращает общее количество товаров в корзине
getTotalCount(): number

// Проверяет наличие товара в корзине по идентификатору
contains(productId: string): boolean

### Класс (Buyer)

constructor()

private data: IBuyer - хранит все данные покупателя

// Сохраняет данные покупателя (частичное обновление)
setData(data: Partial<IBuyer>): void

// Возвращает все данные покупателя
getData(): IBuyer

// Очищает все данные покупателя
clear(): void

// Валидирует данные покупателя и возвращает объект с ошибками
validate(): IValidationErrors

// Проверяет валидность всех данных покупателя
isValid(): boolean

## Слой коммуникации

### Класс (WebLarekAPI)

constructor(api: IApi)

// Получает список товаров с сервера
getProductList(): Promise<IProduct[]>

// Отправляет заказ на сервер
createOrder(order: IOrderRequest): Promise<IOrderResult>

## Компоненты представления

#### Класс (Header)
Компонент шапки страницы. Отвечает за отображение счетчика корзины и управление блокировкой скролла страницы.

Конструктор:  
`constructor(container: HTMLElement, events: EventEmitter)` - принимает корневой элемент и брокер событий.

Поля класса:
* `basketButton: HTMLButtonElement` — кнопка/иконка корзины.
* `counterElement: HTMLElement` — элемент для отображения счетчика товаров.

Методы класса:
* `render(count: number): HTMLElement` — обновляет значение счетчика корзины.
* `setLocked(isLocked: boolean): void` — блокирует/разблокирует скролл страницы.
* (Генерирует событие `cart:open` при клике на корзину).

#### Класс (CatalogCard)
Карточка товара для каталога. Наследуется от Card. Использует шаблон `#card-catalog`.

Конструктор:  
`constructor(events: EventEmitter, container: HTMLElement)` - принимает шаблон `#card-catalog` и брокер событий.

Поля класса:
* (Наследует поля разметки от Card: `titleElement`, `priceElement`, и т.д.).

Методы класса:
* `render(product: IProduct): HTMLElement` — отображает данные товара.
* (Генерирует событие `card:select` при клике по карточке).

#### Класс (PreviewCard)
Карточка товара для детального просмотра. Наследуется от Card. Использует шаблон `#card-preview`.

Конструктор:  
`constructor(events: EventEmitter, container: HTMLElement)` - принимает шаблон `#card-preview` и брокер событий.

Поля класса:
* `button: HTMLButtonElement` — кнопка "Купить" / "Удалить".
* `descriptionElement: HTMLElement` — элемент для детального описания.
* (Наследует поля разметки от Card).

Методы класса:
* `render(product: IProduct, inCart: boolean): HTMLElement` — отображает данные, устанавливает состояние кнопки.
* (Генерирует события `card:add` и `card:remove` при взаимодействии с кнопкой).

#### Класс (CartCard)
Карточка товара для отображения в корзине. Наследуется от Card. Использует шаблон `#card-basket`.

Конструктор:  
`constructor(events: EventEmitter, container: HTMLElement)` - принимает шаблон `#card-basket` и брокер событий.

Поля класса:
* `deleteButton: HTMLButtonElement` — кнопка удаления из корзины.
* `indexElement: HTMLElement` — элемент для отображения порядкового номера.
* (Наследует поля разметки от Card).

Методы класса:
* `render(data: { product: IProduct, index: number }): HTMLElement` — отображает данные товара и его номер.
* (Генерирует событие `card:remove` при удалении товара).

#### Класс (CatalogView)
Компонент для отображения всего каталога товаров.

Конструктор:  
`constructor(container: HTMLElement, events: EventEmitter)` - принимает элемент `.gallery` и брокер событий.

Поля класса:
* (Использует только `this.container` для размещения карточек).

Методы класса:
* `render(products: IProduct[]): HTMLElement` — очищает контейнер и добавляет в него карточки.

#### Класс (CartView)
Компонент для отображения содержимого корзины. Использует шаблон `#basket`.

Конструктор:  
`constructor(container: HTMLElement, events: EventEmitter)` - принимает шаблон `#basket` и брокер событий.

Поля класса:
* `listElement: HTMLElement` — контейнер для карточек товаров.
* `totalElement: HTMLElement` — элемент для отображения общей стоимости.
* `buttonElement: HTMLButtonElement` — кнопка оформления заказа.

Методы класса:
* `render(data: ICartViewData): HTMLElement` — отображает список товаров, общую сумму и управляет кнопкой.
* (Генерирует событие `cart:checkout` при оформлении заказа).

#### Класс (Modal)
Базовое модальное окно.

Конструктор:  
`constructor(container: HTMLElement, events: EventEmitter)` - принимает элемент `#modal-container` и брокер событий.

Поля класса:
* `closeButton: HTMLButtonElement` — кнопка закрытия (крестик).
* `contentElement: HTMLElement` — контейнер для встраивания контента.

Методы класса:
* `open(content: HTMLElement): void` — открывает модальное окно.
* `close(): void` — закрывает модальное окно.
* (Генерирует события `modal:open` и `modal:close`).

#### Класс (ProductModal)
Модальное окно для просмотра товара.

Конструктор:  
`constructor(modal: Modal, events: EventEmitter, template: HTMLElement)` - принимает экземпляр базового модального окна, брокер событий и шаблон.

Поля класса:
* `previewCard: PreviewCard` — экземпляр карточки для детального просмотра.

Методы класса:
* `open(product: IProduct, inCart: boolean): void` — открывает модальное окно с деталями товара.
* `updateCartState(product: IProduct, inCart: boolean): void` — обновляет состояние кнопки Купить/Удалить в открытом модальном окне.
* (Генерирует событие `product:open` при открытии).

#### Класс (PaymentForm)
Форма первого шага оформления заказа. Наследуется от Form. Использует шаблон `#order`.

Конструктор:  
`constructor(events: EventEmitter, container: HTMLFormElement)` - принимает брокер событий и шаблон `#order`.

Поля класса:
* `cardButton: HTMLButtonElement` — кнопка оплаты картой.
* `cashButton: HTMLButtonElement` — кнопка оплаты наличными.
* `addressInput: HTMLInputElement` — поле ввода адреса.
* (Наследует поля разметки от Form).

Методы класса:
* `render(data: IBuyer): HTMLElement` — отображает текущие данные покупателя и ошибки.
* (Генерирует событие `payment:submit` при успешной отправке).

#### Класс (ContactForm)
Форма второго шага оформления заказа. Наследуется от Form. Использует шаблон `#contacts`.

Конструктор:  
`constructor(events: EventEmitter, container: HTMLFormElement)` - принимает брокер событий и шаблон `#contacts`.

Поля класса:
* `emailInput: HTMLInputElement` — поле ввода почты.
* `phoneInput: HTMLInputElement` — поле ввода телефона.
* (Наследует поля разметки от Form).

Методы класса:
* `render(data: IBuyer): HTMLElement` — отображает текущие данные покупателя и ошибки.
* (Генерирует событие `contact:submit` при успешной отправке).

#### Класс (SuccessModal)
Модальное окно успешного оформления заказа. Использует шаблон `#success`.

Конструктор:  
`constructor(container: HTMLElement, events: EventEmitter)` - принимает шаблон `#success` и брокер событий.

Поля класса:
* `closeButton: HTMLButtonElement` — кнопка закрытия.
* `totalElement: HTMLElement` — элемент для отображения итоговой суммы заказа.

Методы класса:
* `render(data: { total: number }): HTMLElement` — отображает итоговую сумму заказа.
* (Генерирует событие `success:close` при закрытии).