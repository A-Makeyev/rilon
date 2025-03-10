import { useContext } from "react"
import { uploadMedia, deleteMedia } from "@/services"
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
        const response = await deleteMedia(currentImagePublicId, 'image')

        if (response?.success) {
            setCourseLandingFormData({
                ...courseLandingFormData,
                image_url: '',
                public_id: ''
            })
        }
    }

    return (
        <Card className="pb-0 sm:pb-4 -mx-4 lg:-mx-0">
            <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-xl font-medium mt-2 ml-2">
                    Course Image
                </CardTitle>
                { courseLandingFormData?.image_url && (
                    <Button onClick={handleDeleteImage}>
                        Replace Image
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                { courseLandingFormData?.image_url ? (
                    <div className="flex flex-col gap-2">
                        <img src={courseLandingFormData.image_url} className="rounded-lg m-3" />
                    </div>
                ) : (
                    <div>
                        { mediaUploadProgress ? (
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