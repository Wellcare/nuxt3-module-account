export interface Avatar {
    url: string
}
export interface Timezone {
    local: boolean
}
export interface Address {
    country?: null
    postcode?: null
    state?: null
    street1: string
    suburb?: null
}
export interface Referral {
    refCode: string
}
export interface Validated {
    email?: boolean
    phone?: boolean
}
export interface Bank {
    account: string
    city: string
    main: string
    branch: string
}
export interface IdCard {
    date?: null
    number: string
    place: string
}
export interface Insurance {
    contract: string
}
export interface Utm {
    campaign: string
    content: string
    medium: string
    source: string
}
export interface Relationships {
    avatar?: Avatar
    createdAt?: string
    dob?: string
    gender?: string
    isAdmin?: boolean
    isTest?: boolean
    locale?: string
    name?: string
    relationship?: string
    validated?: Validated
    _id?: string
}
export interface User {
    id?: string
    _id?: string
    avatar?: Avatar
    fullname?: string
    gender?: string
    locale?: string
    timezone?: Timezone
    role?: null[] | null
    countryCode?: string
    name?: string
    search?: string
    updatedAt?: string
    wallet?: number
    retired?: boolean
    address?: Address
    bankAccount?: string
    createAccount?: boolean
    dob?: string
    email?: string
    isProvider?: boolean
    oneSignalId?: string
    phone?: string
    provider?: string
    referral?: Referral
    username?: string
    validated?: Validated
    veryPatient?: null[] | null
    bank?: Bank
    idCard?: IdCard
    updatedBy?: string
    fingerPrint?: string
    isAdmin?: boolean
    isTest?: boolean
    insurance?: Insurance
    utm?: Utm
    token?: string
    accessToken?: string
    refreshToken?: string
    relationships?: Relationships[]
    isMember?: boolean
    membership?: any
    meta?: any
}
