import { useContext } from "react"
import { InstructorContext } from "@/context/instructor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { uploadMedia } from "@/services"
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
                        image_url: response.data.url
                    })
                    setMediaUploadProgress(false)
                }
            } catch (err) {
                console.error(err)
            }
        }
    }

    return (
        <Card>
            <CardHeader>
            <CardTitle>Course Settings</CardTitle>
            </CardHeader>
            { mediaUploadProgress &&
                <MediaProgressBar 
                    isMediaUploading={mediaUploadProgress} 
                    progress={mediaUploadProgressPercentage}
                />
            }
            <CardContent>
                { courseLandingFormData?.image_url ? (
                    <img src={courseLandingFormData.image_url} />
                ) : (
                    <div className="flex flex-col gap-3">
                        <Label>Upload Course Image</Label>
                        <Input 
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="ml-[-4px] cursor-pointer"
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    )   
}

export default CourseSettings
