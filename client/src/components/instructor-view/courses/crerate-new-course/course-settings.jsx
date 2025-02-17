import { useContext } from "react"
import { uploadMedia, deleteImageMedia } from "@/services"
import { InstructorContext } from "@/context/instructor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import MediaProgressBar from "@/components/media-progress-bar"


function CourseSettings() {
    const {
        courseLandingFormData,
        setCourseLandingFormData,
        mediaUploadProgressPercentage,
        setMediaUploadProgressPercentage,
        mediaUploadProgress,
        setMediaUploadProgress
    } = useContext(InstructorContext)

    async function handleImageUpload(event) {
        const image = event.target.files[0]

        if (image) {
            const imageFormData = new FormData()
            imageFormData.append('file', image)

            try {
                setMediaUploadProgress(true)
                const response = await uploadMedia(imageFormData, setMediaUploadProgressPercentage)
                if (response.success) {
                    setCourseLandingFormData({
                        ...courseLandingFormData,
                        image_url: response.data.url,
                        public_id: response.data.public_id
                    })
                    setMediaUploadProgress(false)
                }
            } catch (err) {
                console.error(err)
            }
        }
    }

    async function handleDeleteImage() {
        const currentImagePublicId = courseLandingFormData.public_id
        const response = await deleteImageMedia(currentImagePublicId)

        if (response?.success) {
            setCourseLandingFormData({
                ...courseLandingFormData,
                image_url: '',
                public_id: ''
            })
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-lg font-medium">
                    Course Image
                </CardTitle>
                { courseLandingFormData?.image_url && (
                    <Button onClick={handleDeleteImage}>
                        Delete Image
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                { courseLandingFormData?.image_url ? (
                    <div className="flex flex-col gap-3">
                        <img src={courseLandingFormData.image_url} />
                    </div>
                ) : (
                    <div>
                        {mediaUploadProgress ? (
                            <MediaProgressBar
                                isMediaUploading={mediaUploadProgress}
                                progress={mediaUploadProgressPercentage}
                            />
                        ) : (
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="ml-[-4px] cursor-pointer"
                            />
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default CourseSettings