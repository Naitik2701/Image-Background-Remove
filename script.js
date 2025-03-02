document.addEventListener("DOMContentLoaded", () => {
    const uploadArea = document.getElementById("Upload-area");
    const imageinput = document.getElementById("imageinput");
    const removebtn = document.getElementById("removeBackgroundbtn");
    const resetbtn = document.getElementById("resetbtn");
    const result = document.getElementById("result");

    let selectedFile = null;

    uploadArea.addEventListener("click", () => {
        imageinput.click();
    });

    uploadArea.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    uploadArea.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleFile(e.dataTransfer.files[0]);
    });

    imageinput.addEventListener("change", (e) => {
        handleFile(e.target.files[0]);
    });

    function handleFile(file) {
        if (file && file.type.startsWith("image")) {
            selectedFile = file;
            const reader = new FileReader();
            reader.onload = () => {
                displayImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please upload a valid image format.");
        }
    }

    function displayImage(imgsrc) {
        result.innerHTML = `<img src="${imgsrc}" />`;
    }

    removebtn.addEventListener("click", () => {
        if (selectedFile) {
            removeBackground(selectedFile);
        } else {
            alert("Please upload an image first.");
        }
    });

    async function removeBackground(file) {
        const apiKey = "bc8YoiuprD45CHthFxn7zzKR";
        const formData = new FormData();
        formData.append("image_file", file);
        formData.append("size", "auto");
        result.innerHTML = "<p>Removing Background...</p>";

        try {
            const response = await fetch("https://api.remove.bg/v1.0/removebg", {
                method: "POST",
                headers: {
                    "X-API-Key": apiKey,
                },
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to remove background.");

            const blob = await response.blob();
            const imageURL = URL.createObjectURL(blob);
            result.innerHTML = `<img src="${imageURL}" />`;

            const downloadBtn = document.createElement("button");
            downloadBtn.innerText = "Download Image";
            downloadBtn.classList.add("Button");
            downloadBtn.addEventListener("click", () => {
                const link = document.createElement("a");
                link.href = imageURL;
                link.download = "background_remove.png";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });

            result.appendChild(downloadBtn);
        } catch (error) {
            console.error("Error:", error);
            result.innerHTML = "<p>Error removing background.</p>";
        }
    }

    resetbtn.addEventListener("click", () => {
        selectedFile = null;
        result.innerHTML = "<p>No images processed yet.</p>";
        imageinput.value = "";
    });
});
