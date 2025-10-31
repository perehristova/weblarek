export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get < T extends object > (uri: string): Promise < T > ;
    post < T extends object > (uri: string, data: object, method ? : ApiPostMethods): Promise < T > ;
}

// Существующие типы данных
export type TPayment = 'online' | 'cash' | '';

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

export interface IValidationErrors {
    payment ? : string;
    email ? : string;
    phone ? : string;
    address ? : string;
}

// Новые типы для API
export interface IOrderResult {
    id: string;
    total: number;
}

export interface IOrderRequest extends IBuyer {
  items: string[]; // массив ID товаров
  total: number;   // общая стоимость заказа
}

export interface IProductList {
    total: number;
    items: IProduct[];
}