type createAudioProps = {
    audioChunks: Blob[],
    duration: number,
}

export function createAudioRecord(props: createAudioProps):RECORDED_AUDIO_DTO{
    const {audioChunks,duration} = props
    const mimeType = MediaRecorder.isTypeSupported("audio/webm") 
            ? "audio/webm"
            : "audio/mp3"

    const audioBlob = new Blob(audioChunks, {
        type: mimeType
    })

    const recordedAudio: RECORDED_AUDIO_DTO = {
        id: crypto.randomUUID(),
        audioBlob,
        duration: duration,  
    } 

    return recordedAudio

}