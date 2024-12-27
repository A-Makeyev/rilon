import { useContext } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { InstructorContext } from "@/context/instructor"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { mediaUpload } from "@/services"
import MediaProgressBar from "@/components/media-progress-bar"
import VideoPlayer from "@/components/video-player"


function CourseCurriculum() {
    const { 
        courseCurriculumFormData, 
        setCourseCurriculumFormData,
        mediaUploadProgressPercentage, 
        setMediaUploadProgressPercentage,
        mediaUploadProgress, 
        setMediaUploadProgress
    } = useContext(InstructorContext)

    function handleNewLacture() {
        setCourseCurriculumFormData(prevState => [
            ...prevState,
            { title: '', preview: false, video_url: '', public_id: '' }
        ])
    }

    function handleTitleChange(event, index) {
        setCourseCurriculumFormData(prevState => {
            const newData = [...prevState]
            newData[index] = { ...newData[index], title: event.target.value }
            return newData
        })
    }
    
    function handlePreviewChange(value, index) {
        setCourseCurriculumFormData(prevState => {
            const newData = [...prevState]
            newData[index] = { ...newData[index], preview: value }
            return newData
        })
    }

    async function handleSingleVideoUpload(event, index) {
        const video = event.target.files[0]
    
        if (video) {
            const videoFormData = new FormData()
            videoFormData.append('file', video)
    
            try {
                setMediaUploadProgress(true)
                const response = await mediaUpload(videoFormData, setMediaUploadProgressPercentage)
                if (response.success) {
                    setCourseCurriculumFormData(prevState => {
                        const newData = [...prevState]
                        newData[index] = {
                            ...newData[index],
                            video_url: response?.data?.url,
                            public_id: response?.data?.public_id
                        }
                        return newData
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
                <CardTitle>Course Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
                <Button onClick={handleNewLacture}>Add Lecture</Button>
                <div className="mt-4 space-y-4">
                    { courseCurriculumFormData.map((item, index) => (
                        <div key={`lecture-${index}`} className="border p-5 rounded-md">
                            <div className="flex gap-5 items-center ml-1">
                                <h3 className="font-semibold">Lecture { index + 1 }</h3>
                                <Input 
                                    name={`lecture-${index + 1}`}
                                    value={courseCurriculumFormData[index]?.title}
                                    onChange={(event) => handleTitleChange(event, index)}
                                    placeholder="What is this lectrue about?"
                                    className="max-w-96"
                                />
                                <div className="flex items-center space-x-2">
                                    <Switch 
                                        id={`preview-lecture-${index + 1}`} 
                                        checked={courseCurriculumFormData[index]?.preview} 
                                        onCheckedChange={(value) => handlePreviewChange(value, index)}
                                    />
                                    <Label htmlFor={`preview-lecture-${index + 1}`}>Preview</Label>
                                </div>
                            </div>
                            <div className="mt-5">
                                { courseCurriculumFormData[index]?.video_url ? (
                                    <div className="flex gap-3">
                                        <VideoPlayer url={courseCurriculumFormData[index]?.video_url} width="475px" height="225px" />
                                        <Button>Replace Video</Button>
                                        <Button className="bg-red-700 hover:bg-red-800">Delete Lecture</Button>
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
                                                accept="video/*"
                                                onChange={(event) => handleSingleVideoUpload(event, index)}
                                                className="mb-1 cursor-pointer"
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>  
            </CardContent>
        </Card>
    )   
}

export default CourseCurriculum
