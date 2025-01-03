import axiosInstance from "@/api/axiosInstance"


export async function register(formData) {
    const { data } = await axiosInstance.post('/auth/register', {
        ...formData,
        role: 'user',
    })
    
    return data
}

export async function login(formData) {
    const { data } = await axiosInstance.post('/auth/login', formData)
    return data
}

export async function verify() {
    const { data } = await axiosInstance.get('/auth/verify')
    return data
}

export async function mediaUpload(formData, onProgressCallback) {
    const { data } = await axiosInstance.post('/media/upload', formData, {
        onUploadProgress: (progressEvent) => {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgressCallback(percentage)
        }
    })
    return data
}