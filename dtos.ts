// @ts-nocheck
/* Options:
Date: 2025-06-01 06:13:08
Version: 8.53
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://uitestapi.occupass.com

//GlobalNamespace: 
//MakePropertiesOptional: False
//AddServiceStackTypes: True
//AddResponseStatus: False
//AddImplicitVersion: 
//AddDescriptionAsComments: True
//IncludeTypes: 
//ExcludeTypes: 
//DefaultImports: 
*/


export interface IReturn<T>
{
    createResponse(): T;
}

export interface IReturnVoid
{
    createResponse(): void;
}

export interface IGet
{
}

// @DataContract
export class QueryBase
{
    // @DataMember(Order=1)
    public skip?: number;

    // @DataMember(Order=2)
    public take?: number;

    // @DataMember(Order=3)
    public orderBy: string;

    // @DataMember(Order=4)
    public orderByDesc: string;

    // @DataMember(Order=5)
    public include: string;

    // @DataMember(Order=6)
    public fields: string;

    // @DataMember(Order=7)
    public meta: { [index:string]: string; };

    public constructor(init?: Partial<QueryBase>) { (Object as any).assign(this, init); }
}

export class QueryDb<T> extends QueryBase
{

    public constructor(init?: Partial<QueryDb<T>>) { super(init); (Object as any).assign(this, init); }
}

// @DataContract
export class Customer
{
    // @DataMember
    public id: string;

    // @DataMember
    public companyName: string;

    // @DataMember
    public contactName: string;

    // @DataMember
    public contactTitle: string;

    // @DataMember
    public address: string;

    // @DataMember
    public city: string;

    // @DataMember
    public region: string;

    // @DataMember
    public postalCode: string;

    // @DataMember
    public country: string;

    // @DataMember
    public phone: string;

    // @DataMember
    public fax: string;

    public constructor(init?: Partial<Customer>) { (Object as any).assign(this, init); }
}

// @DataContract
export class Order
{
    // @DataMember
    public id: number;

    // @DataMember
    public customerId: string;

    // @DataMember
    public employeeId: number;

    // @DataMember
    public orderDate?: string;

    // @DataMember
    public requiredDate?: string;

    // @DataMember
    public shippedDate?: string;

    // @DataMember
    public shipVia?: number;

    // @DataMember
    public freight: number;

    // @DataMember
    public shipName: string;

    // @DataMember
    public shipAddress: string;

    // @DataMember
    public shipCity: string;

    // @DataMember
    public shipRegion: string;

    // @DataMember
    public shipPostalCode: string;

    // @DataMember
    public shipCountry: string;

    public constructor(init?: Partial<Order>) { (Object as any).assign(this, init); }
}

// @DataContract
export class ResponseError
{
    // @DataMember(Order=1)
    public errorCode: string;

    // @DataMember(Order=2)
    public fieldName: string;

    // @DataMember(Order=3)
    public message: string;

    // @DataMember(Order=4)
    public meta: { [index:string]: string; };

    public constructor(init?: Partial<ResponseError>) { (Object as any).assign(this, init); }
}

// @DataContract
export class ResponseStatus
{
    // @DataMember(Order=1)
    public errorCode: string;

    // @DataMember(Order=2)
    public message: string;

    // @DataMember(Order=3)
    public stackTrace: string;

    // @DataMember(Order=4)
    public errors: ResponseError[];

    // @DataMember(Order=5)
    public meta: { [index:string]: string; };

    public constructor(init?: Partial<ResponseStatus>) { (Object as any).assign(this, init); }
}

// @DataContract
export class OrderDetail
{
    // @DataMember
    public orderId: number;

    // @DataMember
    public productId: number;

    // @DataMember
    public unitPrice: number;

    // @DataMember
    public quantity: number;

    // @DataMember
    public discount: number;

    public constructor(init?: Partial<OrderDetail>) { (Object as any).assign(this, init); }
}

// @DataContract
export class CustomerOrder
{
    // @DataMember
    public order: Order;

    // @DataMember
    public orderDetails: OrderDetail[] = [];

    public constructor(init?: Partial<CustomerOrder>) { (Object as any).assign(this, init); }
}

// @DataContract
export class QueryResponse<T>
{
    // @DataMember(Order=1)
    public offset: number;

    // @DataMember(Order=2)
    public total: number;

    // @DataMember(Order=3)
    public results: T[];

    // @DataMember(Order=4)
    public meta: { [index:string]: string; };

    // @DataMember(Order=5)
    public responseStatus: ResponseStatus;

    public constructor(init?: Partial<QueryResponse<T>>) { (Object as any).assign(this, init); }
}

// @DataContract
export class CustomersResponse
{
    // @DataMember
    public results: Customer[] = [];

    // @DataMember
    public responseStatus: ResponseStatus;

    public constructor(init?: Partial<CustomersResponse>) { (Object as any).assign(this, init); }
}

// @DataContract
export class CustomerDetailsResponse
{
    // @DataMember
    public customer: Customer;

    // @DataMember
    public orders: CustomerOrder[] = [];

    // @DataMember
    public responseStatus: ResponseStatus;

    public constructor(init?: Partial<CustomerDetailsResponse>) { (Object as any).assign(this, init); }
}

// @DataContract
export class OrdersResponse
{
    // @DataMember
    public results: CustomerOrder[] = [];

    // @DataMember
    public responseStatus: ResponseStatus;

    public constructor(init?: Partial<OrdersResponse>) { (Object as any).assign(this, init); }
}

// @Route("/cached/customers")
export class CachedGetAllCustomers implements IReturn<CustomersResponse>, IGet
{

    public constructor(init?: Partial<CachedGetAllCustomers>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CachedGetAllCustomers'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new CustomersResponse(); }
}

// @Route("/cached/customers/{Id}")
export class CachedGetCustomerDetails implements IReturn<CustomerDetailsResponse>, IGet
{
    public id: string;

    public constructor(init?: Partial<CachedGetCustomerDetails>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CachedGetCustomerDetails'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new CustomerDetailsResponse(); }
}

// @Route("/cached/orders")
// @Route("/cached/orders/page/{Page}")
// @Route("/cached/customers/{CustomerId}/orders")
export class CachedGetOrders implements IReturn<OrdersResponse>, IGet
{
    public page?: number;
    public customerId: string;

    public constructor(init?: Partial<CachedGetOrders>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CachedGetOrders'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new OrdersResponse(); }
}

// @Route("/customers/{Id}")
export class GetCustomerDetails implements IReturn<CustomerDetailsResponse>, IGet
{
    public id: string;

    public constructor(init?: Partial<GetCustomerDetails>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'GetCustomerDetails'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new CustomerDetailsResponse(); }
}

// @Route("/customers")
export class GetAllCustomers implements IReturn<CustomersResponse>, IGet
{

    public constructor(init?: Partial<GetAllCustomers>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'GetAllCustomers'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new CustomersResponse(); }
}

// @Route("/orders")
// @Route("/orders/page/{Page}")
// @Route("/customers/{CustomerId}/orders")
export class GetOrders implements IReturn<OrdersResponse>, IGet
{
    public page?: number;
    public customerId: string;

    public constructor(init?: Partial<GetOrders>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'GetOrders'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new OrdersResponse(); }
}

// @Route("/query/customers")
export class QueryCustomers extends QueryDb<Customer> implements IReturn<QueryResponse<Customer>>
{
    public ids: string[];
    public countryStartsWith: string;

    public constructor(init?: Partial<QueryCustomers>) { super(init); (Object as any).assign(this, init); }
    public getTypeName() { return 'QueryCustomers'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryResponse<Customer>(); }
}

// @Route("/query/orders")
export class QueryOrders extends QueryDb<Order> implements IReturn<QueryResponse<Order>>
{
    public freight?: number;

    public constructor(init?: Partial<QueryOrders>) { super(init); (Object as any).assign(this, init); }
    public getTypeName() { return 'QueryOrders'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryResponse<Order>(); }
}

