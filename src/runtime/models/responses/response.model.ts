interface Paging {
    pageSize: number
    pageNumber: number
    pageTotal: number
    skip: number
    limit: number
    [key: string]: any
}

interface Query {
    limit: number
    skip: number
    [key: string]: any
}

export interface Response<T> {
    code: number
    message: string
    paging: Paging
    results: T
    query: Query
}
