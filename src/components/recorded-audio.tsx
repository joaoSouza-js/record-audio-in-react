import { useEffect, useRef, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { PauseIcon, PlayIcon, Trash2 } from "lucide-react";
import { formatTime } from "../utils/format-hours";

type RecordedAudioProps = {
    audioRecorded: RECORDED_AUDIO_DTO;
    onDeleteAudio: (id: string) => void;
};

export function RecordedAudio(props: RecordedAudioProps) {
    const { audioRecorded, onDeleteAudio } = props;

    function handleDeleteRecordedAudio() {
        onDeleteAudio(audioRecorded.id);
    }

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [audioIsPlaying, setAudioIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    useEffect(() => {
        const audioUrl = URL.createObjectURL(audioRecorded.audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        const updateTime = () => setCurrentTime(audio.currentTime);
        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("ended", () => {
            setAudioIsPlaying(false);
        });

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            URL.revokeObjectURL(audioUrl);
            audio.pause();
        };
    }, [audioRecorded]);

    function startPlayAudio() {
        if (!audioRef.current) return;
        audioRef.current.play();
        setAudioIsPlaying(true);
    }
    function stopPlayingAudio() {
        if (!audioRef.current) return;
        audioRef.current.pause();
        setAudioIsPlaying(false);
    }

    function handleUpdatePlayedTime(trackTimeList: number[]) {
        if (audioRef.current === null) return;
        const [trackTime] = trackTimeList;
        setCurrentTime(trackTime);
        audioRef.current.currentTime = trackTime;
    }

    return (
        <div className="flex gap-3 items-center">
            <button
                type="button"
                onClick={audioIsPlaying ? stopPlayingAudio : startPlayAudio}
            >
                {audioIsPlaying ? (
                    <PauseIcon size={18} />
                ) : (
                    <PlayIcon size={18} />
                )}
            </button>

            <Slider.Root
                value={[currentTime]}
                className="relative flex h-5 w-[200px] touch-none select-none items-center"
                max={audioRecorded.duration}
                onValueChange={handleUpdatePlayedTime}
                step={1}
            >
                <Slider.Track className="relative h-[3px] grow rounded-full bg-zinc-600">
                    <Slider.Range className="absolute h-full rounded-full bg-white" />
                </Slider.Track>
                <Slider.Thumb
                    className="block size-5 rounded-[10px] bg-white shadow-[0_2px_10px] shadow-blackA4 hover:bg-violet3 focus:shadow-[0_0_0_5px] focus:shadow-blackA5 focus:outline-none"
                    aria-label="Volume"
                />
            </Slider.Root>

            <div className="flex gap-2 items-center">
                <div>
                    <span className="text-sm font-mono whitespace-nowrap">
                        {formatTime(currentTime)} /{" "}
                        {formatTime(audioRecorded.duration)}
                    </span>
                </div>
                <button
                    onClick={handleDeleteRecordedAudio}
                    type="button"
                    className="text-red-600"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
}
