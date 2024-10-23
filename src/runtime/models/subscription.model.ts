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

export interface Benefit {
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

export interface Organization {
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

export interface Plan {
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
