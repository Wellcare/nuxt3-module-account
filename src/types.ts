interface Avatar {
    url: string
}
interface Timezone {
    local: boolean
}
interface Address {
    country?: null
    postcode?: null
    state?: null
    street1: string
    suburb?: null
}
interface Referral {
    refCode: string
}
interface Validated {
    email?: boolean
    phone?: boolean
}
interface Bank {
    account: string
    city: string
    main: string
    branch: string
}
interface IdCard {
    date?: null
    number: string
    place: string
}
interface Insurance {
    contract: string
}
interface Utm {
    campaign: string
    content: string
    medium: string
    source: string
}
export interface Relationship {
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
    relationships?: Relationship[]
    isMember?: boolean
    membership?: any
    meta?: any
}


export interface Subscription {
    _id: string
    state: string
    type: string
    benefits: Benefit[]
    beneficiary: string
    organization: Organization
    plan: Plan
    startAt: string
    endAt: string
}

interface Benefit {
    _id: string
    state: string
    quota: number
    key: string
    beneficiary: string
    subscription: string
    title: string
    createdAt: string
    updatedAt: string
}

interface Organization {
    _id: string
    name: {
        vi: string
        en: string
        short: string
    }
    slug: string
    type: string
    taxCode: string
    createdBy: string
    updatedBy: string
    createdAt: string
    updatedAt: string
    __v: number
    isFeatured: boolean
    location: any[]
    specialty: any[]
}

interface Plan {
    _id: string
    search: string
    price: number
    quota: number
    timingCode: string
    state: string
    type: string
    benefits: any[]
    key: string
    name: string
    endAt: string
    organization: string
    startAt: string
    createdAt: string
    updatedAt: string
    policies: string[]
}
