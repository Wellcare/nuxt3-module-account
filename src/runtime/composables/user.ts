import type { Ref } from '#imports'
import { ref, useNuxtApp } from '#imports'
import { USER_URL } from '../constants'

interface UserData {
    userId: string
    [key: string]: any
}

interface Relationship {
    [key: string]: any
}

interface Subscription {
    [key: string]: any
}

interface UseUserProfileReturn {
    loading: Ref<boolean>
    error: Ref<string | null>
    createRelationship: (data: any) => Promise<Relationship | null>
    deleteRelationship: (userId: string) => Promise<any | null>
    updateUser: (data: UserData) => Promise<UserData | null>
    getRelationship: (userId: string) => Promise<Relationship | null>
    getUser: () => Promise<UserData | null>
    getUserId: (data: any) => Promise<string | null>
    getSubscriptions: () => Promise<Subscription[] | null>
}

export const useUserProfile = (): UseUserProfileReturn => {
    const { $fetchWellcare } = useNuxtApp()
    const TIMEOUT = 20000

    const loading: Ref<boolean> = ref(false)
    const error: Ref<string | null> = ref(null)

    const executeRequest = async <T>(
        requestFn: () => Promise<T>,
    ): Promise<T | null> => {
        loading.value = true
        error.value = null
        try {
            return await requestFn()
        } catch (err) {
            error.value = err instanceof Error ? err.message : String(err)
            return null
        } finally {
            loading.value = false
        }
    }

    const createRelationship = (data: any): Promise<Relationship | null> =>
        executeRequest(() =>
            $fetchWellcare(USER_URL.createRelationship(), {
                method: 'POST',
                body: data,
                timeout: TIMEOUT,
            }),
        )

    const deleteRelationship = (userId: string): Promise<any | null> =>
        executeRequest(() =>
            $fetchWellcare(USER_URL.deleteRelationship(userId), {
                method: 'DELETE',
                timeout: TIMEOUT,
            }),
        )

    const updateUser = (data: UserData): Promise<UserData | null> =>
        executeRequest(() =>
            $fetchWellcare(USER_URL.updateUser(data.userId), {
                method: 'PUT',
                body: data,
                timeout: TIMEOUT,
            }),
        )

    const getRelationship = (userId: string): Promise<Relationship | null> =>
        executeRequest(() =>
            $fetchWellcare(USER_URL.getRelationship(userId), {
                timeout: TIMEOUT,
            }),
        )

    const getUser = (): Promise<UserData | null> =>
        executeRequest(() =>
            $fetchWellcare(USER_URL.getUser(), {
                timeout: TIMEOUT,
                headers: {
                    'X-Request-At': new Date().getTime().toString(),
                },
            }),
        )

    const getSubscriptions = (): Promise<Subscription[] | null> =>
        executeRequest(() =>
            $fetchWellcare(USER_URL.subscriptions(), {
                timeout: TIMEOUT,
            }),
        )

    const getUserId = (data: any): Promise<string | null> =>
        executeRequest(() =>
            $fetchWellcare(USER_URL.getUserId(), {
                method: 'POST',
                body: data,
                timeout: TIMEOUT,
            }),
        )

    return {
        loading,
        error,
        createRelationship,
        deleteRelationship,
        updateUser,
        getRelationship,
        getUser,
        getUserId,
        getSubscriptions,
    }
}
