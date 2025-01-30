const fileInput = document.getElementById("fileInput");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const convertBtn = document.getElementById("convertBtn");
const downloadBtn = document.getElementById("downloadBtn");
const ctx = canvas.getContext("2d");

// Handle file upload
fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith("video/")) {
        const url = URL.createObjectURL(file);
        video.src = url;
    } else {
        alert("Please upload a valid video file.");
    }
});

// Apply Cartoon Effect
convertBtn.addEventListener("click", function () {
    if (video.src) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        function processFrame() {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            let frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let data = frame.data;

            for (let i = 0; i < data.length; i += 4) {
                let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                let threshold = avg > 128 ? 255 : 0;

                data[i] = threshold; // R
                data[i + 1] = threshold; // G
                data[i + 2] = threshold; // B
            }

            ctx.putImageData(frame, 0, 0);

            if (!video.paused && !video.ended) {
                requestAnimationFrame(processFrame);
            }
        }

        video.play();
        processFrame();
        downloadBtn.style.display = "block";
    } else {
        alert("Upload a video first!");
    }
});

// Download Cartoon Video
downloadBtn.addEventListener("click", function () {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "cartoonized_frame.png";
    link.click();
});
