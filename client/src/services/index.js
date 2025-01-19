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

export async function uploadMedia(formData, onProgressCallback) {
    const { data } = await axiosInstance.post('/media/upload', formData, {
        onUploadProgress: (progressEvent) => {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgressCallback(percentage)
        }
    })
    return data
}

export async function deleteMedia(id) {
    const { data } = await axiosInstance.delete(`/media/delete/${id}`)
    return data
}

export async function addNewCourse(formData) {
    const { data } = await axiosInstance.post('/instructor/course/new', formData)
    return data
}

export async function updateCourse(id, formData) {
    const { data } = await axiosInstance.put(`/instructor/course/${id}`, formData)
    return data
}

export async function getInstructorCourseDetails(id) {
    const { data } = await axiosInstance.get(`/instructor/course/details/${id}`)
    return data
}

export async function getInstructorCourses() {
    const { data } = await axiosInstance.get('/instructor/course/all')
    return data
}
