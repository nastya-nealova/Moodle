export const required = (value: any) => {
    return value ? undefined : 'Value is required';
}

export const minLength = (min: number) => (value: string) => {
    return value && value.length < min ? `Must contain at least ${min} characters`: undefined;
}

export const correctEmail = (email: string) => {
    if(email){
        return !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email) ? "Invalid email" : undefined;
    } else return
}

export const checkPasswords = (value: string, allValues: any) => {
    return value !== allValues.newPassword ? 'Passwords do not match' : undefined
}