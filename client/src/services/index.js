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

export async function bulkUploadMedia(formData, onProgressCallback) {
    const { data } = await axiosInstance.post('/media/bulk-upload', formData, {
        onUploadProgress: (progressEvent) => {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgressCallback(percentage)
        }
    })
    return data
}

export async function deleteImageMedia(id) {
    const { data } = await axiosInstance.delete(`/media/delete-image/${id}`)
    return data
}

export async function deleteVideoMedia(id) {
    if (Array.isArray(id)) {
        const { data } = await axiosInstance.delete('/media/delete-video', { data: { public_ids: id } })
        return data
    } else {
        const { data } = await axiosInstance.delete(`/media/delete-video/${id}`)
        return data
    }
}


export async function addNewCourse(formData) {
    const { data } = await axiosInstance.post('/instructor/courses/new-course', formData)
    return data
}

export async function updateCourse(id, formData) {
    const { data } = await axiosInstance.put(`/instructor/courses/update-course/${id}`, formData)
    return data
}

export async function deleteCourse(id) {
    const { data } = await axiosInstance.delete(`/instructor/courses/delete/${id}`)
    return data
}

export async function getInstructorCourses() {
    const { data } = await axiosInstance.get('/instructor/courses/all-courses')
    return data
}

export async function getInstructorCourseDetails(id) {
    const { data } = await axiosInstance.get(`/instructor/courses/course-details/${id}`)
    return data
}

export async function getStudentCourses(query) {
    const { data } = query !== undefined
        ? await axiosInstance.get(`/student/courses/all-courses?${query}`)
        : await axiosInstance.get('/student/courses/all-courses')
    return data
}

export async function getStudentCourseDetails(id) {
    const { data } = await axiosInstance.get(`/student/courses/course-details/${id}`)
    return data
}

export async function createPayment(formData) {
    const { data } = await axiosInstance.post('/student/order/create-order', formData)
    return data
}

export async function capturePaymentAndFinalizeOrder(paymentId, payerId, orderId) {
    const { data } = await axiosInstance.post('/student/order/capture-payment', {
        paymentId, payerId, orderId
    })
    return data
}

export async function getAcquiredCourses(studentId) {
    const { data } = await axiosInstance.get(`/student/acquired-courses/${studentId}`)
    return data
}

export async function getCoursePurchaseInfo(id, studentId) {
    const { data } = await axiosInstance.get(`/student/courses/purchase-info/${id}/${studentId}`)
    return data
}

export async function getCourseProgress(userId, courseId) {
    const { data } = await axiosInstance.get(`/student/course-progress/${userId}/${courseId}`)
    return data
}

export async function resetCourseProgress(userId, courseId) {
    const { data } = await axiosInstance.post('/student/course-progress/reset-progress', {
        userId, courseId
    })
    return data
}

export async function viewLecture(userId, courseId, lectureId) {
    const { data } = await axiosInstance.post('/student/course-progress/view-lecture', {
        userId, courseId, lectureId
    })
    return data
}
