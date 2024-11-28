import axiosInstance from "@/api/axiosInstance"


export async function register(formData) {
    const { data } = await axiosInstance.post('/auth/register', {
        ...formData,
        role: 'user',
    })

    return data
}