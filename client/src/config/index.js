export const registerFormControls = [
    {
        name: 'email',
        label: 'Email',
        placeholder: 'Enter your email',
        componentType: 'input',
        type: 'email'
    },
    {
        name: 'username',
        label: 'Username',
        placeholder: 'Enter your username',
        componentType: 'input',
        type: 'text'
    },
    {
        name: 'password',
        label: 'Password',
        placeholder: 'Enter your password',
        componentType: 'input',
        type: 'password'
    },
]

export const loginFormControls = [
    {
        name: 'email',
        label: 'Email',
        placeholder: 'Enter your email',
        componentType: 'input',
        type: 'email'
    },
    {
        name: 'password',
        label: 'Password',
        placeholder: 'Enter your password',
        componentType: 'input',
        type: 'password'
    },
]

export const initialLoginFormData = {
    email: '',
    password: '',
}

export const initialRegisterFormData = {
    email: '',
    username: '',
    password: '',
}
