// Add blinking keyframes to the document (if not already defined)
const style = document.createElement("style");
document.head.appendChild(style);

// Function to create the blinking recording notice
function createRecordingNotice() {
  const notice = document.createElement("div");
  notice.id = "recordingNotice";
  notice.innerText = "Recording in progress. Please do not change any options.";
  notice.style.position = "fixed";
  notice.style.top = "20px";
  notice.style.left = "50%";
  notice.style.transform = "translateX(-50%)";
  notice.style.padding = "10px 20px";
  notice.style.backgroundColor = "rgba(255, 0, 0, 1)";
  notice.style.color = "#fff";
  notice.style.fontSize = "20px";
  notice.style.borderRadius = "100px";
  notice.style.fontWeight = "bold";
  notice.style.zIndex = "10000";
  notice.style.textAlign = "center";
  return notice;
}

const recordBtn = document.getElementById("recordBtn");
const statusIndicator = document.getElementById("statusIndicator");

let mediaRecorder;
let recordedChunks = [];
let recordingTimeout;

const CLOUDCONVERT_API_KEY =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYmMxNzNmOTFjZGNmMDVjYjNiYzc4ZWY1YWNjMzdmYzU4NTkzYWZmNTg3MmRkYWY3ODlkZDQyNTg5YzY5ZDg3YzgwYmVkN2Y2N2VkNjY1OWYiLCJpYXQiOjE3Mzc3NDg1NzguMDUwNzA2LCJuYmYiOjE3Mzc3NDg1NzguMDUwNzA4LCJleHAiOjQ4OTM0MjIxNzguMDQ3MDIzLCJzdWIiOiI3MDgzODI5NyIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ0YXNrLnJlYWQiLCJ0YXNrLndyaXRlIl19.mkTQCPfjt8PcYknj9Pm81RpoSDEPZw-Y6FY4Tl_fND1bjh0H4ZDC8T1L3PD3dUslZfuO2NdRXkN9cSEpcjG9EQyCyhDlortYRdzJWVK8XQbgpCc3jwioWhb8ChnzVF3LvBcnNnCSkVo3jA_SsiGukyJJSZrEcq2ryVXKxIGHLKOux3u3U3qgZFxBw8TE5qkUSAmv3-ILks6zM2Zx9et3KnSkfox-JoNzP07JMN-p3JsbMTECXwR2tEmKPd0sA1ZfLxxcFHX2ilOYzczFwqp9ME8_O6C-Vc1S7P8heAxdAehRoqFaoNyEQcm_cjZqvn1G1jQniLMTYWqfe6LZU0JYIn6xZZPSgZZVjhARs6U1vu4gyXkkG8fXDWQIjYiTGX2L5e7PHQ8lhFw-W8KeksCZigQSV0-oZaUXoZ0yQlKoS-b0adkM9V3uCTe6GV4iDbwPHseCReADkLTR0GpqOaH2sQVLw8eru_OTdBI3Jv8V4bsp1cb0HUAyQZQ2movJ6j0ags3d4c42o0dP2PVFf80rkVJmlp3nPnfenBlYdjzSwYG8SNCarcEUzpgU7_IXu5mRCHnB3_ddt-JyIj7CBpo_8-U9b_PyN7O1fmLFe-7R-s1pr3G7glyRYwSGp-QAQvuTiWSJD-VbzSHwEoRupzvpWt_wW30EN8Ij9TXIxzP2g0M";

const waitForTaskCompletion = async (taskId) => {
  while (true) {
    const response = await fetch(
      `https://api.cloudconvert.com/v2/tasks/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${CLOUDCONVERT_API_KEY}`,
        },
      }
    );
    const taskData = await response.json();
    console.log("Task Status Check:", taskData);
    if (taskData?.data?.status === "finished") {
      return taskData?.data;
    } else if (taskData?.data?.status === "error") {
      throw new Error("Task failed with error.");
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
};

const convertWebMToMP4 = async (webmBlob) => {
  try {
    statusIndicator.innerText = "Requesting import/upload task...";
    console.log("Requesting import/upload task...");

    const importResponse = await fetch(
      "https://api.cloudconvert.com/v2/import/upload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CLOUDCONVERT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const importData = await importResponse.json();
    console.log("Import Response:", importData);
    if (
      !importData?.data?.result?.form?.url ||
      !importData?.data?.result?.form?.parameters
    ) {
      throw new Error("Failed to retrieve the upload URL or form parameters.");
    }
    const uploadUrl = importData.data.result.form.url;
    const formParameters = importData.data.result.form.parameters;

    statusIndicator.innerText = "Uploading WebM file...";
    console.log("Uploading WebM file...");
    const formData = new FormData();
    for (const [key, value] of Object.entries(formParameters)) {
      formData.append(key, value);
    }
    formData.append("file", webmBlob, "recording.webm");

    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });
    const uploadResponseBody = await uploadResponse.text();
    console.log("Upload Response Status:", uploadResponse.status);
    console.log("Upload Response Body:", uploadResponseBody);
    if (!uploadResponse.ok) {
      throw new Error("Failed to upload the WebM file to CloudConvert.");
    }
    console.log("File successfully uploaded.");
    statusIndicator.innerText = "File uploaded. Creating conversion job...";

    const conversionResponse = await fetch(
      "https://api.cloudconvert.com/v2/jobs",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CLOUDCONVERT_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tasks: {
            "convert-my-file": {
              operation: "convert",
              input: importData.data.id,
              input_format: "webm",
              output_format: "mp4",
              converteroptions: {
                width: 3840,
                height: 2160,
              },
            },
            "export-my-file": {
              operation: "export/url",
              input: "convert-my-file",
            },
          },
        }),
      }
    );
    const conversionData = await conversionResponse.json();
    console.log("Conversion Response:", conversionData);
    statusIndicator.innerText =
      "Conversion job created. Retrieving export task...";
    const exportTask = conversionData?.data?.tasks?.find(
      (task) => task.operation === "export/url"
    );
    if (!exportTask?.id) {
      throw new Error("Export task ID not found in conversion response.");
    }
    statusIndicator.innerText = "Waiting for export task to finish...";
    console.log("Waiting for the export task to finish...");
    const completedExportTask = await waitForTaskCompletion(exportTask.id);
    const downloadUrl = completedExportTask?.result?.files?.[0]?.url;
    if (!downloadUrl) {
      throw new Error(
        "Failed to retrieve the download URL for the converted MP4."
      );
    }
    console.log("MP4 File URL:", downloadUrl);
    statusIndicator.innerText = "Conversion successful.";
    return downloadUrl;
  } catch (error) {
    console.error("Error converting WebM to MP4:", error.message || error);
    statusIndicator.innerText = "Conversion failed. Try again.";
    throw error;
  }
};

recordBtn.addEventListener("click", async () => {
  try {
    statusIndicator.innerText = "Preparing canvas...";
    console.log("Preparing canvas...");
    const canvasElement = document.querySelector("canvas");
    if (!canvasElement) {
      throw new Error(
        "Canvas element not found. Please ensure the sketch is running."
      );
    }

    // Warm up the canvas so that it's fully rendered
    await new Promise((resolve) => {
      canvasElement.toBlob(() => {
        console.log("Canvas warmed up.");
        resolve();
      }, "image/webp");
    });

    // Wait a couple of animation frames to ensure the canvas is fully rendered
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => requestAnimationFrame(resolve));

    statusIndicator.innerText = "Starting recording...";
    console.log("Starting recording...");

    const canvasStream = canvasElement.captureStream(60);
    const audioContext = getAudioContext();
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }
    const audioDestination = audioContext.createMediaStreamDestination();
    sound.connect(audioDestination);
    const audioStream = audioDestination.stream;
    const combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...audioStream.getAudioTracks(),
    ]);

    // Determine a supported MIME type
    let chosenMimeType = "";
    if (
      MediaRecorder.isTypeSupported('video/mp4;codecs="avc1.42E01E, mp4a.40.2"')
    ) {
      chosenMimeType = 'video/mp4;codecs="avc1.42E01E, mp4a.40.2"';
    } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
      chosenMimeType = "video/webm;codecs=vp9";
    } else if (MediaRecorder.isTypeSupported("video/webm")) {
      chosenMimeType = "video/webm";
    } else {
      throw new Error("No supported MIME type found for MediaRecorder");
    }
    console.log("Using MIME type:", chosenMimeType);

    const options = {
      mimeType: chosenMimeType,
      videoBitsPerSecond: 10000000, // 10 Mbps
    };

    mediaRecorder = new MediaRecorder(combinedStream, options);
    recordedChunks = [];
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    // Display the blinking recording notice
    const recordingNotice = createRecordingNotice();
    document.body.appendChild(recordingNotice);

    mediaRecorder.onstop = async () => {
      // Remove the recording notice when recording stops
      const notice = document.getElementById("recordingNotice");
      if (notice) {
        notice.remove();
      }
      statusIndicator.innerText = "Recording stopped. Starting conversion...";
      console.log("Recording stopped. Starting conversion...");

      // Create a blob using the chosen MIME type
      const recordedBlob = new Blob(recordedChunks, { type: chosenMimeType });

      // If the blob is in WebM format, convert it to MP4.
      // Otherwise (if recorded as MP4), trigger download directly.
      if (chosenMimeType.startsWith("video/webm")) {
        try {
          const mp4Url = await convertWebMToMP4(recordedBlob);
          statusIndicator.innerText =
            "Conversion successful. Initiating download...";
          console.log("Conversion successful. Initiating download...");
          const a = document.createElement("a");
          a.href = mp4Url;
          a.download = "canvas-recording.mp4";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          console.log("Download triggered.");
          statusIndicator.innerText = "Download triggered.";
        } catch (error) {
          console.error("Error during conversion:", error.message || error);
          alert("Conversion to MP4 failed. Please try again.");
        }
      } else {
        // Recorded as MP4—download directly.
        const a = document.createElement("a");
        const mp4BlobUrl = window.URL.createObjectURL(recordedBlob);
        a.href = mp4BlobUrl;
        a.download = "canvas-recording.mp4";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        console.log("Download triggered (MP4 recorded directly).");
        statusIndicator.innerText = "Download triggered.";
      }
      recordBtn.disabled = false;
      recordedChunks = [];
    };

    mediaRecorder.start();
    console.log("Recording started.");
    statusIndicator.innerText =
      "Recording in progress. This will take 15 seconds.";
    recordBtn.disabled = true;

    // Instead of stopping immediately at 15 seconds,
    // request final data and then stop after a short delay to capture the last frame.
    recordingTimeout = setTimeout(() => {
      if (mediaRecorder.state !== "inactive") {
        // Request the final data chunk
        mediaRecorder.requestData();
        // Wait for one more animation frame, then delay further before stopping
        requestAnimationFrame(() => {
          // Increase the delay to 300ms (you can experiment with 300-500ms)
          setTimeout(() => {
            if (mediaRecorder.state !== "inactive") {
              mediaRecorder.stop();
              console.log(
                "Automatically stopping recording after 15 seconds..."
              );
            }
          }, 300);
        });
      }
    }, 15000);
  } catch (err) {
    console.error("Error starting recording:", err.message || err);
    alert(`Error: ${err.message}`);
    statusIndicator.innerText = `Error: ${err.message}`;
    recordBtn.disabled = false;
  }
});
