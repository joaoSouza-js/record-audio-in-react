---

# 🎙️ React Audio Recorder (with MediaRecorder API)

This project demonstrates how to **record audio in a React app using the MediaRecorder API** and manage the recording logic cleanly via a custom React hook.

---

![image](https://github.com/user-attachments/assets/97f1d60b-99a3-4384-84c0-d24f4fc26cc4)





## ✅ Features

* Record audio via the browser microphone
* Track recording duration in real-time
* Store and play back audio blobs
* Seek within audio with a custom slider
* Delete individual recordings

---

## 📂 Core File: `use-recod-audio.ts`

This file contains the full logic for:

1. **Requesting microphone access**
2. **Starting and stopping audio recording**
3. **Tracking the duration of the recording**
4. **Storing and managing multiple recordings**

---

## 🎛 Hook API: `useRecordAudio()`

### Return values:

| Property                  | Type                   | Description                                          |
| ------------------------- | ---------------------- | ---------------------------------------------------- |
| `startRecordingAudio()`   | `() => void`           | Begins recording from the microphone                 |
| `stopRecordingAudio()`    | `() => void`           | Stops the current recording and saves it             |
| `isRecordingAudio`        | `boolean`              | True if a recording is in progress                   |
| `audioVisualRecordedTime` | `string`               | A string like `00:13` showing elapsed time           |
| `recordedAudios`          | `RECORDED_AUDIO_DTO[]` | Array of all recorded audio blobs and their metadata |
| `removeRecordedAudio()`   | `(id: string) => void` | Deletes a recording from the list                    |

---

## 🔍 How Recording Works

### ✅ 1. Microphone Access

```ts
const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
```

* Prompts the user for permission to use the mic.
* Returns a `MediaStream` containing the live audio track.

---

### ✅ 2. Creating the MediaRecorder

```ts
const mediaRecorder = new MediaRecorder(mediaStream);
```

* Uses the `MediaStream` to create a `MediaRecorder`.
* Records audio as chunks of data (`Blob`s).

---

### ✅ 3. Handling Recorded Chunks

```ts
mediaRecorder.ondataavailable = (event) => {
  if (event.data.size > 0) {
    audioChunks.push(event.data);
  }
};
```

* `ondataavailable` fires when the recorder produces a blob.
* The blob is pushed to an array (`audioChunks`).

---

### ✅ 4. Stopping and Saving Audio

```ts
mediaRecorder.onstop = async () => {
  const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
  const recordedAudio = await createAudio(audioBlob);
  setRecordedAudios((prev) => [...prev, recordedAudio]);
};
```

* When recording is stopped, combine all chunks into one `Blob`.
* `createAudio()` wraps the blob with a unique ID and its duration.
* Save the audio to state via `setRecordedAudios`.

---

### ✅ 5. Recording Duration Tracking

```ts
const interval = setInterval(() => {
  seconds++;
  setRecordedTime(formatTime(seconds));
}, 1000);
```

* While recording, a timer is updated every second.
* `formatTime()` turns seconds into `mm:ss`.

---

## 🎯 Recording Lifecycle Overview

```text
[User Clicks Start] 
   ↓
getUserMedia() → MediaRecorder() 
   ↓
Start recording → Store chunks
   ↓
Track time every 1s 
   ↓
[User Clicks Stop] 
   ↓
Combine chunks into Blob 
   ↓
Store in state with metadata
```

---

## 🧼 Cleanup

* When the recording ends:

  * Mic stream is stopped: `mediaStream.getTracks().forEach(t => t.stop())`
  * Interval is cleared
  * State is reset

---

## 🎁 Audio Object Format

The `createAudio()` helper produces this structure:

```ts
{
  id: string,            // unique ID
  audioBlob: Blob,       // raw audio
  duration: number       // in seconds
}
```

---

## 🧠 Why Use a Custom Hook?

Encapsulating the recording logic inside `useRecordAudio()` provides:

* Cleaner separation of logic and UI
* Reusable and testable logic
* Easy access to recording state

---

## 🔐 Permissions

* The app uses `navigator.mediaDevices.getUserMedia`
* The user **must allow mic access** for recording to work

---

Let me know if you want this turned into a `README.md` file or if you'd like to include visual flowcharts or diagrams for clarity.







## 🚀 Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run the project**:

   ```bash
   npm run dev
   ```

---

## 📦 Core Components and Logic

### 1. `App.tsx` — The Main Interface

This file integrates the full app logic:

* It imports the `useRecordAudio` custom hook to manage recording state and audio data.
* A button toggles recording using `startRecordingAudio` and `stopRecordingAudio`.
* The list of recorded audios is rendered using the `RecordedAudio` component.

🔁 **Conditional Logic:**

```tsx
onClick={isRecordingAudio ? stopRecordingAudio : startRecordingAudio}
```

This switches between recording and stopping based on `isRecordingAudio`.

🎧 **Recording Display:**

```tsx
{recordedAudios.map((audioRecorded) => (
  <RecordedAudio
    key={audioRecorded.id}
    audioRecorded={audioRecorded}
    onDeleteAudio={removeRecordedAudio}
  />
))}
```

Each recording is passed to a playback component.

---

### 2. `use-recod-audio.ts` — Custom Hook for Recording

This hook encapsulates all logic for:

* Accessing microphone permissions
* Managing recording state
* Handling audio blobs
* Formatting recording time

🔑 **Key Functions:**

* `startRecordingAudio()`: Requests mic access and starts capturing audio using `MediaRecorder`.
* `stopRecordingAudio()`: Stops the recorder and saves the audio as a blob.
* `removeRecordedAudio(id)`: Removes an audio recording by ID.
* `audioVisualRecordedTime`: A visual display string for how long the recording has lasted.

🧠 **Why a hook?**
Using a custom hook separates logic from UI, improves reusability, and keeps the main component clean.

---

### 3. `recorded-audio.tsx` — Audio Playback UI

This component displays:

* A play/pause button
* A seekable slider (Radix Slider)
* A delete button

🧲 **Audio Management:**

```ts
const audioUrl = URL.createObjectURL(audioRecorded.audioBlob);
const audio = new Audio(audioUrl);
```

* Converts blob to URL for playback.
* Keeps track of audio time via `timeupdate` event.

🔁 **Slider Functionality:**

```tsx
<Slider.Root
  value={[currentTime]}
  max={audioRecorded.duration}
  onValueChange={handleUpdatePlayedTime}
>
```




## 📷 UI & Libraries

* **Radix UI** Slider for precise time control
* **Lucide Icons** for UI elements
* **Tailwind CSS** for utility-first styling

---

## 🧪 Features in Action

✅ Start/stop recording
✅ Visual recording timer
✅ Play/pause audio
✅ Seek through audio
✅ Delete audio
✅ Multiple audio recordings

---

## 🔐 Permissions

Your browser will prompt for microphone access. This is required for the app to work.

---

## ❗ Notes

* This implementation uses browser-native `MediaRecorder`. Ensure your browser supports it.
* Audio is stored in-memory (in `useState`), not persisted across reloads.

---

## 📌 Future Ideas

* Add localStorage or IndexedDB support to persist recordings.
* Export/download audio files.
* Add waveform visualization.

---


