import { useCallback, useRef, useState } from "react";
import { createAudioRecord } from "../utils/create-audio";

const handleRecordingError = (error: DOMException | Error): string => {
    const errorMessages: Record<string, string> = {
        NotAllowedError: "Usuário negou acesso ao microfone.",
        NotFoundError: "Nenhum microfone não encontrado.",
    };
    const message = errorMessages[error.name] || "Ocorreu um erro ao gravar o áudio.";
    return message
};

export function useRecordAudio() {
    const [recordedAudios, setRecordedAudios] = useState<RECORDED_AUDIO_DTO[]>([]);
    const [isRecordingAudio, setIsRecordingAudio] = useState(false);
    const audioRecorderMediaRef = useRef<MediaRecorder | null>(null);
    const audioRecordedTimeRef = useRef(0);
    const audionIntervalIdRef = useRef<number| null>(null);
    const [audioVisualRecordedTime, setAudioVisualRecordedTime] = useState(0);
    const audioChunksRef = useRef<Blob[]>([]);

    const cleanupRecording = (audioStream: MediaStream): void => {
        const newAudioRecorded = createAudioRecord({
            audioChunks: audioChunksRef.current,
            duration: audioRecordedTimeRef.current,
        });
        setRecordedAudios((prev) => [...prev, newAudioRecorded]);

        audioChunksRef.current = [];
        audioRecordedTimeRef.current = 0;
        setAudioVisualRecordedTime(0);

        for (const track of audioStream.getTracks()) {
            track.stop();
        }
    };

    const setupMediaRecorder = (audioStream: MediaStream): MediaRecorder => {
        const audioMedia = new MediaRecorder(audioStream);

        audioMedia.ondataavailable = (event: BlobEvent): void => {
            if (event.data.size < 1) return;
            audioChunksRef.current.push(event.data);
        };

        audioMedia.onstop = (): void => cleanupRecording(audioStream);

        return audioMedia;
    };

    const startRecordingAudio = async (): Promise<void> => {
        try {
            const audioStreamPermissions: MediaStream =
                await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });

            const audioMedia = setupMediaRecorder(audioStreamPermissions);

            audioRecorderMediaRef.current = audioMedia;

            const audioRecordIntervalId= setInterval((): void => {
                audioRecordedTimeRef.current++;
                setAudioVisualRecordedTime(audioRecordedTimeRef.current);
            }, 1000);

            audionIntervalIdRef.current = audioRecordIntervalId;
            audioMedia.start();
            setIsRecordingAudio(true);
        } catch (error) {
            const errorMessage = handleRecordingError(error as DOMException);
            throw new Error(errorMessage);
        }
    };

    const stopRecordingAudio = (): void => {
        if (
            audioRecorderMediaRef.current === null ||
            audioRecorderMediaRef.current.state !== "recording"
        )
            return;

        audioRecorderMediaRef.current.stop();
        setIsRecordingAudio(false);

        if (audionIntervalIdRef.current == null) return;
        clearInterval(audionIntervalIdRef.current);
        audionIntervalIdRef.current = null;
    };

    const removeRecordedAudio = useCallback(
        (id: string): void => {
            const recordedAudioWithoutRemoved = recordedAudios.filter(
                (audio) => audio.id !== id,
            );
            setRecordedAudios(recordedAudioWithoutRemoved);
        },
        [recordedAudios],
    );

    return {
        startRecordingAudio,
        stopRecordingAudio,
        isRecordingAudio,
        recordedAudios,
        removeRecordedAudio,
        audioVisualRecordedTime,
    };
}
