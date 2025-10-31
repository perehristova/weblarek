import {
    IApi,
    IProduct,
    IOrderRequest,
    IOrderResult,
    IProductList
} from '../types';

export class WebLarekAPI {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    async getProductList(): Promise < IProduct[] > {
        const response = await this.api.get < IProductList > ('/product');
        return response.items;
    }

    async createOrder(order: IOrderRequest): Promise < IOrderResult > {
        return await this.api.post < IOrderResult > ('/order', order);
    }
}