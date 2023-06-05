
declare type Nullable<T> = T | null | undefined;
declare type Array<T> = T[];
declare namespace kotlin.collections {
    type List<T> = T[];
}
declare namespace kotlin {
    type Long = number;
}


export namespace f2.dsl.cqrs {
    interface Command extends f2.dsl.cqrs.Message {

    }
}
export namespace f2.dsl.cqrs {
    interface Event extends f2.dsl.cqrs.Message {

    }
}
export namespace f2.dsl.cqrs {
    interface Message {

    }
}
export namespace f2.dsl.cqrs {
    interface Query extends f2.dsl.cqrs.Message {

    }
}
export namespace f2.dsl.cqrs.error {
    interface F2ErrorDTO {
        readonly id?: string;
        readonly timestamp: string;
        readonly code: number;
        readonly requestId?: string;
        readonly message: string;

    }
    class F2Error implements f2.dsl.cqrs.error.F2ErrorDTO {
        constructor(message: string, id?: string, timestamp?: string, code?: number, requestId?: string);
        get message(): string;
        get id(): Nullable<string>;
        get timestamp(): string;
        get code(): number;
        get requestId(): Nullable<string>;
        toString(): string;

    }
}
export namespace f2.dsl.cqrs.exception {
    class F2Exception /* extends kotlin.RuntimeException */ {
        constructor(error: f2.dsl.cqrs.error.F2ErrorDTO, cause?: Error);
        get error(): f2.dsl.cqrs.error.F2ErrorDTO;

    }
}
export namespace f2.dsl.cqrs.filter {
    interface Match<T> {
        readonly negative: boolean;
        map<R>(transform: (p0: T) => R): f2.dsl.cqrs.filter.Match<R>;
        not(): f2.dsl.cqrs.filter.Match<T>;
        and(match: f2.dsl.cqrs.filter.Match<T>): f2.dsl.cqrs.filter.Match<T>;
        or(match: f2.dsl.cqrs.filter.Match<T>): f2.dsl.cqrs.filter.Match<T>;

    }
}
export namespace f2.dsl.cqrs.filter {
    interface SortDTO {
        readonly property: string;
        readonly ascending: boolean;
        readonly nullsFirst?: boolean;

    }
}
export namespace f2.dsl.cqrs.page {
    interface PageDTO<OBJECT> {
        readonly total: number;
        readonly items: OBJECT[];

    }
    class Page<OBJECT> implements f2.dsl.cqrs.page.PageDTO<OBJECT> {
        constructor(total: number, items: OBJECT[]);
        get total(): number;
        get items(): OBJECT[];
        static Page_init_$Create$<OBJECT>(seen1: number, total: number, items?: any/* Nullable<OBJECT>[] */, serializationConstructorMarker?: any/* Nullable<kotlinx.serialization.internal.SerializationConstructorMarker> */): f2.dsl.cqrs.page.Page<OBJECT>;

    }
    namespace Page {
    }
}
export namespace f2.dsl.cqrs.page {
    interface PageQueryDTO extends f2.dsl.cqrs.Query {
        readonly pagination?: f2.dsl.cqrs.page.OffsetPaginationDTO;

    }
    interface PageQueryResultDTO<OBJECT> extends f2.dsl.cqrs.Event, f2.dsl.cqrs.page.PageDTO<OBJECT> {
        readonly total: number;
        readonly items: OBJECT[];
        readonly pagination?: f2.dsl.cqrs.page.OffsetPaginationDTO;

    }
    class PageQuery implements f2.dsl.cqrs.page.PageQueryDTO {
        constructor(pagination?: f2.dsl.cqrs.page.OffsetPaginationDTO);
        get pagination(): Nullable<f2.dsl.cqrs.page.OffsetPaginationDTO>;

    }
    class PageQueryResult<OBJECT> implements f2.dsl.cqrs.page.PageQueryResultDTO<OBJECT> {
        get pagination(): Nullable<f2.dsl.cqrs.page.OffsetPagination>;
        get total(): number;
        get items(): OBJECT[];
    }
    namespace PageQueryResult {
    }
}
export namespace f2.dsl.cqrs.page {
    interface Pagination {


    }
    interface OffsetPaginationDTO extends f2.dsl.cqrs.page.Pagination {
        readonly offset: number;
        readonly limit: number;

    }
    interface PagePaginationDTO extends f2.dsl.cqrs.page.Pagination {
        readonly page?: number;
        readonly size?: number;

    }
    class OffsetPagination implements f2.dsl.cqrs.page.OffsetPaginationDTO {
        constructor(offset: number, limit: number);
        get offset(): number;
        get limit(): number;
        static OffsetPagination_init_$Create$(seen1: number, offset: number, limit: number, serializationConstructorMarker?: any/* Nullable<kotlinx.serialization.internal.SerializationConstructorMarker> */): f2.dsl.cqrs.page.OffsetPagination;

    }
    class PagePagination implements f2.dsl.cqrs.page.PagePaginationDTO {
        constructor(page?: number, size?: number);
        get page(): Nullable<number>;
        get size(): Nullable<number>;
        static PagePagination_init_$Create$(seen1: number, page?: number, size?: number, serializationConstructorMarker?: any/* Nullable<kotlinx.serialization.internal.SerializationConstructorMarker> */): f2.dsl.cqrs.page.PagePagination;

    }
}
export namespace city.smartb.im.commons.auth {
    interface AuthedUserDTO {
        readonly id: string;
        readonly memberOf?: string;
        readonly roles: Array<string>;

    }
}
export namespace city.smartb.im.commons.model {
    interface AddressDTO {
        readonly street: string;
        readonly postalCode: string;
        readonly city: string;

    }
}
export namespace city.smartb.im.commons.http {
    class ClientJs {
        constructor();
        protected doCall<T>(fnc: any /*Suspend functions are not supported*/): Promise<T>;
    }
}
export namespace f2.dsl.fnc {
    interface F2Function<T, R> {
        invoke(cmd: Array<T>): Promise<Array<R>>;

    }
    interface F2Supplier<R> {
        invoke(): Promise<Array<R>>;

    }
    interface F2Consumer<T> {
        invoke(cmd: Array<T>): Promise<void>;

    }
}