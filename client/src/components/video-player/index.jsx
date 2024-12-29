import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, Maximize, Minimize, Pause, PictureInPicture, PictureInPicture2, Play, RotateCcw, RotateCw, Volume2, VolumeX } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import ReactPlayer from "react-player"


function VideoPlayer({ url, width = '100%', height = '100%' }) {
    const [played, setPlayed] = useState(0)
    const [volume, setVolume] = useState(1)
    const [prevVolume, setPrevVolume] = useState(volume)
    const [muted, setMuted] = useState(false)
    const [playing, setPlaying] = useState(false)
    const [seeking, setSeeking] = useState(false)
    const [fullScreen, setFullScreen] = useState(false)
    const [showControls, setShowControls] = useState(true)
    const [hasAudio, setHasAudio] = useState(true)
    const [isPip, setIsPip] = useState(false)
    const playerContainerRef = useRef(null)
    const controlsTimeoutRef = useRef(null)
    const playerRef = useRef(null)
    const isReadyRef = useRef(false)

    const handleFullScreen = useCallback(async () => {
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture()
            setIsPip(false)
        }
        if (!fullScreen) {
            if (playerContainerRef?.current?.requestFullscreen) {
                playerContainerRef?.current?.requestFullscreen()
            }
        } else if (document.exitFullscreen) {
            document.exitFullscreen()
        }
    }, [fullScreen])

    const handlePlayAndPause = useCallback(() => {
        setPlaying(!playing)
    }, [playing])

    const handleBackward = useCallback(() => {
        playerRef?.current?.seekTo(playerRef?.current?.getCurrentTime() - 5)
    }, [])

    const handleForward = useCallback(() => {
        playerRef?.current?.seekTo(playerRef?.current?.getCurrentTime() + 5)
    }, [])

    function handleReady() {
        const player = playerRef.current.getInternalPlayer()

        if (player && !isReadyRef.current) {
            const video = player instanceof HTMLVideoElement ? player : null
            if (video) {
                const hasAudioTracks =
                    video.mozHasAudio ||
                    Boolean(video.webkitAudioDecodedByteCount) ||
                    Boolean(video.audioTracks && video.audioTracks.length)

                setHasAudio(hasAudioTracks)

                if (!hasAudioTracks) {
                    setMuted(true)
                    setVolume(0)
                } else {
                    setMuted(false)
                    setVolume(1)
                }

                isReadyRef.current = true
            }
        }
    }

    function handleMouseMove() {
        setShowControls(true)
        const videoPlayers = document.querySelectorAll('.video-player')
        videoPlayers.forEach((x) => { x.style.cursor = 'auto' })
        clearTimeout(controlsTimeoutRef.current)
        controlsTimeoutRef.current = setTimeout(() => {
            videoPlayers.forEach((x) => { x.style.cursor = 'none' })
            setShowControls(false)
        }, 3000)
    }

    function handleMouseLeave() {
        const videoPlayers = document.querySelectorAll('.video-player')
        videoPlayers.forEach((x) => { x.style.cursor = 'auto' })
        clearTimeout(controlsTimeoutRef.current)
        setShowControls(false)
    }

    function handleMute() {
        if (muted) {
            setMuted(false)
            setVolume(prevVolume)
        } else {
            setPrevVolume(volume)
            setMuted(true)
            setVolume(0)
        }
    }

    function handleVolumeChange(value) {
        const newVolume = value[0]
        setVolume(newVolume)

        if (newVolume === 0) {
            setMuted(true)
        } else {
            setMuted(false)
        }
    }

    function handleProgress(state) {
        if (!seeking) {
            setPlayed(state.played)
        }
    }

    function handleSeekChange(value) {
        setPlayed(value[0])
        setSeeking(true)
    }

    function handleSeekHover() {
        playerRef.current?.seekTo(played)
        setSeeking(false)
    }

    function handleEnded() {
        setPlaying(false)
        setPlayed(1)
    }

    function timeFormat(seconds) {
        const padStart = (str) => {
            return ('0' + str).slice(-2)
        }

        const date = new Date(seconds * 1000)
        const hh = date.getUTCHours()
        const mm = date.getUTCMinutes()
        const ss = padStart(date.getUTCSeconds())

        if (hh) {
            return `${hh}:${padStart(mm)}:${ss}`
        }
        return `${hh}:${ss}`
    }

    async function handlePictureInPicture() {
        if (playerRef.current && !isPip) {
            await playerRef.current.getInternalPlayer().requestPictureInPicture()
            setIsPip(true)
        } else if (document.pictureInPictureElement) {
            await document.exitPictureInPicture()
            setIsPip(false)
        }
    }

    useEffect(() => {
        const checkPipStatus = () => {
            if (document.pictureInPictureElement) {
                setIsPip(true)
            } else {
                setIsPip(false)
            }
            requestAnimationFrame(checkPipStatus)
        }

        requestAnimationFrame(checkPipStatus)

        return () => {
            cancelAnimationFrame(checkPipStatus)
        }
    }, [])

    useEffect(() => {
        const handleFullScreenChange = () => {
            setFullScreen(document.fullscreenElement)
        }

        document.addEventListener('fullscreenchange', handleFullScreenChange)

        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange)
        }
    }, [])

    useEffect(() => {
        const player = playerRef.current?.getInternalPlayer()
        if (!player) return

        const handlePlay = () => setPlaying(true)
        const handlePause = () => setPlaying(false)

        player.addEventListener("play", handlePlay)
        player.addEventListener("pause", handlePause)

        return () => {
            player.removeEventListener("play", handlePlay)
            player.removeEventListener("pause", handlePause)
        }
    }, [])

    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case ' ':
                    handlePlayAndPause()
                    event.preventDefault()
                    break
                case 'ArrowRight':
                    handleForward()
                    break
                case 'ArrowLeft':
                    handleBackward()
                    break
                case 'ArrowUp':
                    setVolume((prevVolume) => {
                        let increasedVolume = prevVolume * 100 + 5
                        if (increasedVolume > 100) increasedVolume = 100
                        handleVolumeChange([increasedVolume])
                        return increasedVolume / 100
                    })
                    break
                case 'ArrowDown':
                    setVolume((prevVolume) => {
                        let decreasedVolume = prevVolume * 100 - 5
                        if (decreasedVolume < 0) decreasedVolume = 0
                        handleVolumeChange([decreasedVolume])
                        return decreasedVolume / 100
                    })
                    break
                case 'f':
                    handleFullScreen()
                    break
                default:
                    break
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handlePlayAndPause, handleForward, handleBackward, handleFullScreen])

    return (
        <TooltipProvider>
            <div
                ref={playerContainerRef}
                style={{ width, height }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={`${fullScreen ? "w-screen h-screen" : ""} relative overflow-hidden rounded-lg shadow-xl bg-slate-900 video-player`}
            >
                <ReactPlayer
                    url={url}
                    muted={muted}
                    volume={volume}
                    ref={playerRef}
                    controls={false}
                    playing={playing}
                    onReady={handleReady}
                    onEnded={handleEnded}
                    onProgress={handleProgress}
                    config={{ file: { attributes: { controlsList: 'nodownload' } } }}
                    className="absolute top-0 left-0"
                    width="100%"
                    height="100%"
                />
                <div onClick={handlePlayAndPause} className="bg-transparent w-full absolute h-3/4"></div>
                { showControls && (
                    <div className="absolute block bottom-0 left-0 right-0 pb-1 px-3">
                        <Slider
                            step={1}
                            max={100}
                            value={[played * 100]}
                            onValueCommit={handleSeekHover}
                            onValueChange={(value) => handleSeekChange([value[0] / 100])}
                            className="mb-2"
                        />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="none"
                                            className="text-white bg-transparent transition ease-in-out hover:scale-125"
                                            onClick={handlePlayAndPause}
                                        >
                                            {playing ? <Pause /> : <Play />}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{playing ? 'Pause' : 'Play'}</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="none"
                                            className="text-white bg-transparent transition ease-in-out hover:scale-125"
                                            onClick={handleBackward}
                                        >
                                            <RotateCcw />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="flex flex-row">
                                            <ArrowLeft size={16} strokeWidth={2.5} className="mr-0.5 mt-[0.5px]" />
                                            <span>Backward</span>
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="none"
                                            className="text-white bg-transparent transition ease-in-out hover:scale-125"
                                            onClick={handleForward}
                                        >
                                            <RotateCw />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="flex flex-row">
                                            <span>Forward</span>
                                            <ArrowRight size={16} strokeWidth={2.5} className="ml-0.5 mt-[0.5px]" />
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="none"
                                            className="text-white bg-transparent transition ease-in-out hover:scale-125"
                                            onClick={handleMute}
                                            disabled={!hasAudio}
                                        >
                                            {muted || !hasAudio ? <VolumeX /> : <Volume2 />}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{muted || !hasAudio ? 'Unmute' : 'Mute'}</p>
                                    </TooltipContent>
                                </Tooltip>
                                {hasAudio && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Slider
                                                step={1}
                                                max={100}
                                                value={[volume * 100]}
                                                onValueChange={(value) => handleVolumeChange([value[0] / 100])}
                                                className="w-24"
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Volume</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                            </div>
                            <div className="flex items-center">
                                <div className="text-white mr-2">
                                    {timeFormat(played * (playerRef?.current?.getDuration() || 0))}
                                    {' '} / {' '}
                                    {timeFormat(playerRef?.current?.getDuration() || 0)}
                                </div>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="none"
                                            className="text-white bg-transparent transition ease-in-out hover:scale-125"
                                            onClick={handlePictureInPicture}
                                        >
                                            {isPip ? <PictureInPicture /> : <PictureInPicture2 />}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{isPip ? 'Exit Picture-In-Picture' : 'Picture-In-Picture'}</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="none"
                                            className="text-white bg-transparent transition ease-in-out hover:scale-125"
                                            onClick={handleFullScreen}
                                        >
                                            {fullScreen ? <Minimize /> : <Maximize />}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{fullScreen ? 'Exist Full Screen' : 'Full Screen'}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </TooltipProvider>
    )
}

export default VideoPlayer
