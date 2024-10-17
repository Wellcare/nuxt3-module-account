export const USER_URL = {
    createRelationship: (): string => `/user-management/user/relationship`,
    deleteRelationship: (userId: string): string =>
        `/user-management/relationship/user/${userId}`,
    updateUser: (userId: string): string => `/api/user/${userId}`,
    getRelationship: (userId: string): string =>
        `/user-management/relationship/${userId}`,
    getUser: (): string => '/user-management/user-info',
    subscriptions: (): string => '/membership/member/subscriptions',
    getUserId: (): string => `/identity/public/id`,
}
