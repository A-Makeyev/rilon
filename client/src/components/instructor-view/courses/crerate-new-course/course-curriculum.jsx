import { useContext, useRef, useState } from "react"
import { InstructorContext } from "@/context/instructor"
import { uploadMedia, deleteMedia, bulkUploadMedia, addNewCourse } from "@/services"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"
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
    const [focusedVideoIndex, setFocusedVideoIndex] = useState(null)
    const bulkUploadRef = useRef(null)

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

    function unfocusOtherVideos(currentIndex) {
        setFocusedVideoIndex(currentIndex)
        setTimeout(() => {
            courseCurriculumFormData.forEach((_, index) => {
                if (index !== currentIndex) {
                    document.querySelector(`[data-video-index="${index}"]`)?.blur()
                }
            })
        }, 0)
    }

    function isDataValid() {
        return courseCurriculumFormData.every(item => {
            return (
                item
                && typeof item === 'object'
                && item.title.trim() !== ''
                && item.video_url.trim() !== ''
            )
        })
    }

    function checkCourseCurriculumFormDataEmptyObjects(arr) {
        return arr.every(obj => {
            return Object.entries(obj).every(([key, value]) => {
                if (typeof value === 'boolean') {
                    return true
                }
                return value === ''
            })
        })
    }

    async function handleBulkVideosUpload(event) {
        const videos = Array.from(event.target.files)
        const videosFormData = new FormData()

        videos.forEach(file => videosFormData.append('files', file))

        try {
            setMediaUploadProgress(true)

            const response = await bulkUploadMedia(videosFormData, setMediaUploadProgressPercentage)
            if (response?.success) {
                let copyCourseCurriculumFormData = checkCourseCurriculumFormDataEmptyObjects(courseCurriculumFormData)
                    ? [] : [...courseCurriculumFormData]

                copyCourseCurriculumFormData = [
                    ...copyCourseCurriculumFormData,
                    ...response?.data?.map((item, index) => ({
                        title: `Lecture ${copyCourseCurriculumFormData.length + (index + 1)}`,
                        public_id: item.public_id,
                        video_url: item.url,
                        preview: false
                    }))
                ]

                setCourseCurriculumFormData(copyCourseCurriculumFormData)
                setMediaUploadProgress(false)
            }
        } catch (err) {
            console.error(err)
        }
    }

    async function handleSingleVideoUpload(event, index) {
        const video = event.target.files[0]

        if (video) {
            const videoFormData = new FormData()
            videoFormData.append('file', video)

            try {
                setMediaUploadProgress(true)

                const response = await uploadMedia(videoFormData, setMediaUploadProgressPercentage)
                if (response?.success) {
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

    async function handleDeleteVideo(index) {
        const copyCourseCurriculumFormData = [...courseCurriculumFormData]
        const currentVideoPublicId = copyCourseCurriculumFormData[index].public_id
        const response = await deleteMedia(currentVideoPublicId)

        if (response?.success) {
            setCourseCurriculumFormData(prevState => {
                const newData = [...prevState]
                newData[index] = {
                    ...newData[index],
                    public_id: '',
                    video_url: ''
                }
                return newData
            })
        }
    }

    async function handleDeleteLecture(index) {
        const copyCourseCurriculumFormData = [...courseCurriculumFormData]
        const currentVideoPublicId = copyCourseCurriculumFormData[index].public_id
        const response = await deleteMedia(currentVideoPublicId)

        if (response?.success) {
            const newCourseCurriculumFormData = copyCourseCurriculumFormData.filter((_, currentIndex) => currentIndex !== index)
            setCourseCurriculumFormData(newCourseCurriculumFormData)
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <CardTitle className="mt-3">Course Lectures</CardTitle>
                <div>
                    <Input
                        multiple
                        type="file"
                        accept="video/*"
                        className="hidden"
                        id="bulk-media-upload"
                        onChange={handleBulkVideosUpload}
                        ref={bulkUploadRef}
                    />
                    <Button
                        as="label"
                        variant="outline"
                        htmlFor="bulk-media-upload"
                        className="cursor-pointer"
                        disabled={mediaUploadProgress}
                        onClick={() => bulkUploadRef.current?.click()}
                    >
                        {mediaUploadProgress ? (
                            <>
                                <LoadingSpinner />
                                <span>Uploading..</span>
                            </>
                        ) : (
                            <>
                                <Upload />
                                <span>Bulk Upload</span>
                            </>
                        )}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Button
                    onClick={handleNewLacture}
                    disabled={!isDataValid() || mediaUploadProgress}
                >
                    Add Lecture
                </Button>
                <div className="mt-4 space-y-4">
                    {courseCurriculumFormData.map((_, index) => (
                        <div key={index} className="border p-5 rounded-md">
                            <div className="flex gap-5 items-center ml-1">
                                <h3 className="font-semibold">Lecture {index + 1}</h3>
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
                                {courseCurriculumFormData[index]?.video_url ? (
                                    <div className="flex gap-3">
                                        <VideoPlayer
                                            data-video-index={index}
                                            url={courseCurriculumFormData[index]?.video_url}
                                            onFocus={() => unfocusOtherVideos(index)}
                                            isFocused={focusedVideoIndex === index}
                                            width="475px"
                                            height="225px"
                                        />
                                        <div className="flex gap-3 flex-col">
                                            <Button onClick={() => handleDeleteVideo(index)}>
                                                Delete Video
                                            </Button>
                                            <Button onClick={() => handleDeleteLecture(index)} className="bg-red-700 hover:bg-red-800">
                                                Delete Lecture
                                            </Button>
                                        </div>
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