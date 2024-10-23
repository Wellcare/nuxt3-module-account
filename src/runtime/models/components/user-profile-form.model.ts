import type { User } from '../user.model'

export interface ProfileForm extends Partial<User> {
    relationship?: string
    weight?: number
    height?: number
    file?: File
}
