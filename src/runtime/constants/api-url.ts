export const USER_URL = {
    createRelationship: (): string => `/user-management/user/relationship`,
    deleteRelationship: (_id: string): string =>
        `/user-management/relationship/user/${_id}`,
    updateUser: (_id: string): string => `/api/user/${_id}`,
    getRelationship: (_id: string): string =>
        `/user-management/relationship/${_id}`,
    getUser: (): string => '/user-management/user-info',
    subscriptions: (): string => '/membership/member/subscriptions',
    getUserId: (): string => `/identity/public/id`,
}
