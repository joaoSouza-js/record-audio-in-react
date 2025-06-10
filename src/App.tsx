import { useRecordAudio } from "./hooks/use-recod-audio";
import {  RecordedAudio } from "./components/recorded-audio";

export function App() {
    const {
         startRecordingAudio,
        stopRecordingAudio,
        isRecordingAudio,
        recordedAudios,
       removeRecordedAudio,
        audioVisualRecordedTime,
    } = useRecordAudio();

    return (
        <div className="min-h-dvh flex justify-center items-center">
            <main className="flex flex-col gap-4 items-center p-6  rounded-2xl shadow-lg">
                <h1 className="text-2xl font-bold">Audio Recorder</h1>

                <button
                    onClick={
                        isRecordingAudio ? stopRecordingAudio : startRecordingAudio
                    }
                    className={`px-6 py-3 rounded-lg font-semibold text-white transition-all ${
                        isRecordingAudio
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                    {isRecordingAudio ? "Stop Recording" : "Start Recording"}
                </button>

                <div className="text-gray-700">
                    {isRecordingAudio
                        ? `Recording... ${audioVisualRecordedTime}`
                        : "Not recording"}
                </div>

                {recordedAudios.map((audioRecorded) => (
                    <RecordedAudio
                        key={audioRecorded.id}
                        audioRecorded={audioRecorded}
                        onDeleteAudio={removeRecordedAudio}
                    />
                ))}
            </main>
        </div>
    );
}
