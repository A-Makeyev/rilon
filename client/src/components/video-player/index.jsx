import { useCallback, useEffect, useRef, useState } from "react"
import { Maximize, Minimize, Pause, Play, RotateCcw, RotateCw, Volume2, VolumeX } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import ReactPlayer from "react-player"


function VideoPlayer({ url,  width = '100%', height = '100%'}) {
    const [played, setPlayed] = useState(0)
    const [volume, setVolume] = useState(0.5)
    const [muted, setMuted] = useState(false)
    const [playing, setPlaying] = useState(false)
    const [seeking, setSeeking] = useState(false)
    const [fullScreen, setFullScreen] = useState(false)
    const [showControls, setShowControls] = useState(true)
    const [hasAudio, setHasAudio] = useState(true)

    const playerRef = useRef(null)
    const playerContainerRef = useRef(null)
    const controlsTimeoutRef = useRef(null)
  
    const handleReady = () => {
        const player = playerRef.current.getInternalPlayer()

        if (player) {
            const video = player instanceof HTMLVideoElement ? player : null
            if (video) {
                const hasAudioTracks = video.mozHasAudio ||
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
            }
        }
    }

    const handleFullScreen = useCallback(() => {
        if (!fullScreen) {
            if (playerContainerRef?.current?.requestFullscreen) {
                playerContainerRef?.current?.requestFullscreen()
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
            }
        }
    }, [fullScreen])

    function handleProgress(state) {
        if (!seeking) {
            setPlayed(state.played)
        }
    }

    function handleMouseMove() {
        setShowControls(true)
        clearTimeout(controlsTimeoutRef.current)
        controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 2000)
    }

    function handlePlayAndPause() {
      setPlaying(!playing)
    }

    function handleRewind() {
        playerRef?.current?.seekTo(playerRef?.current?.getCurrentTime() - 5)
    }

    function handleForward() {
        playerRef?.current?.seekTo(playerRef?.current?.getCurrentTime() + 5)
    }

    function handleMute() {
        if (muted) {
            setMuted(false)
            if (volume === 0) {
                setVolume(0.5)
            }
        } else {
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

    function handleSeekChange(value) {
        setPlayed(value[0])
        setSeeking(true)
    }

    function handleSeekHover() {
        setSeeking(false)
        playerRef.current?.seekTo(played)
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

    useEffect(() => {
        const handleFullScreenChange = () => {
            setFullScreen(document.fullscreenElement)
        }

        document.addEventListener('fullscreenchange', handleFullScreenChange)

        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange)
        }
    }, [])

    return (
        <div
            ref={playerContainerRef}
            style={{ width, height }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setShowControls(false)}
            className={`${fullScreen ? "w-screen h-screen" : ""} 
            relative overflow-hidden rounded-lg shadow-xl bg-slate-900`}
        >
            <ReactPlayer 
                url={url}
                muted={muted}
                volume={volume}
                ref={playerRef}
                playing={playing}
                onReady={handleReady}
                onProgress={handleProgress} 
                config={{ file: { attributes: { controlsList: 'nodownload' }}}}
                className="absolute top-0 left-0"
                width="100%"
                height="100%"
                // controls
            />
            { showControls && (
                <div className="absolute opacity-100 bottom-0 left-0 right-0 p-4 bg-slate-700 bg-opacity-75 transition-opacity duration-300">
                    <Slider 
                        max={100}
                        step={1}
                        value={[ played * 100 ]}
                        onValueCommit={handleSeekHover}
                        onValueChange={(value) => handleSeekChange([value[0] / 100])}
                        className="w-full mb-4 bg-slate-500"
                    />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Button 
                                size="icon"
                                variant="none" 
                                className="text-white bg-transparent transition ease-in-out hover:scale-125"
                                onClick={handlePlayAndPause}
                            >
                                { playing ? <Pause /> : <Play /> }    
                            </Button>
                            <Button
                                size="icon"
                                variant="none" 
                                className="text-white bg-transparent transition ease-in-out hover:scale-125"
                                onClick={handleRewind}
                            >
                                <RotateCcw />
                            </Button>
                            <Button
                                size="icon"
                                variant="none" 
                                className="text-white bg-transparent transition ease-in-out hover:scale-125"
                                onClick={handleForward}
                            >
                                <RotateCw />
                            </Button>
                            <Button
                                size="icon"
                                variant="none" 
                                className="text-white bg-transparent transition ease-in-out hover:scale-125"
                                onClick={handleMute}
                                disabled={!hasAudio}
                            >
                                { muted || !hasAudio ? <VolumeX /> : <Volume2 /> }
                            </Button>
                            <Slider 
                                max={100}
                                step={1}
                                disabled={!hasAudio}
                                value={[ volume * 100 ]}
                                onValueChange={(value) => handleVolumeChange([value[0] / 100])}
                                className="w-24 bg-slate-500"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="text-white">
                                { timeFormat(played * (playerRef?.current?.getDuration() || 0)) } 
                                {' '} / {' '}
                                { timeFormat(playerRef?.current?.getDuration() || 0) }
                            </div>
                            <Button
                                size="icon"
                                variant="none" 
                                className="text-white bg-transparent transition ease-in-out hover:scale-125"
                                onClick={handleFullScreen}
                            >
                                { fullScreen ? <Minimize /> : <Maximize /> }
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )   
}

export default VideoPlayer
