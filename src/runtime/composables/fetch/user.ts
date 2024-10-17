import type { Ref } from '#imports'
import { ref, useNuxtApp } from '#imports'

import { USER_URL } from '../../constants'
import type { Relationship, Response, Subscription, User } from '../../models'

interface UserData {
    _id: string
    [key: string]: any
}

interface UseUserProfileReturn {
    loading: Ref<boolean>
    error: Ref<string | null>
    createRelationship: (data: any) => Promise<Response<Relationship | null>>
    deleteRelationship: (_id: string) => Promise<Response<any | null>>
    updateUser: (data: UserData) => Promise<Response<User | null>>
    getRelationship: (_id: string) => Promise<Response<Relationship | null>>
    getUser: () => Promise<Response<User | null>>
    getUserId: (data: { key: number }) => Promise<Response<string | null>>
    getSubscriptions: () => Promise<Response<Subscription[] | null>>
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

    const createRelationship = (
        data: any,
    ): Promise<Response<Relationship | null>> =>
        executeRequest(() =>
            $fetchWellcare(USER_URL.createRelationship(), {
                method: 'POST',
                body: data,
                timeout: TIMEOUT,
            }),
        )

    const deleteRelationship = (_id: string): Promise<any | null> =>
        executeRequest(() =>
            $fetchWellcare(USER_URL.deleteRelationship(_id), {
                method: 'DELETE',
                timeout: TIMEOUT,
            }),
        )

    const updateUser = (data: UserData): Promise<Response<User | null>> =>
        executeRequest(() =>
            $fetchWellcare(USER_URL.updateUser(data._id), {
                method: 'PUT',
                body: data,
                timeout: TIMEOUT,
            }),
        )

    const getRelationship = (
        _id: string,
    ): Promise<Response<Relationship | null>> =>
        executeRequest(() =>
            $fetchWellcare(USER_URL.getRelationship(_id), {
                timeout: TIMEOUT,
            }),
        )

    const getUser = (): Promise<Response<User | null>> =>
        executeRequest(() =>
            $fetchWellcare(USER_URL.getUser(), {
                timeout: TIMEOUT,
                headers: {
                    'X-Request-At': new Date().getTime().toString(),
                },
            }),
        )

    const getSubscriptions = (): Promise<Response<Subscription[] | null>> =>
        executeRequest(() =>
            $fetchWellcare(USER_URL.subscriptions(), {
                timeout: TIMEOUT,
            }),
        )

    const getUserId = (data: {
        key: number
    }): Promise<Response<string | null>> =>
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
