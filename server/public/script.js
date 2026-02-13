const input = document.getElementById("promptInput");
const generateBtn = document.getElementById("generateBtn");
const status = document.getElementById("status");
const img = document.getElementById("logoImage");
const downloadBtn = document.getElementById("downloadBtn");

generateBtn.addEventListener("click", async () => {
    const idea = input.value.trim();
    if (!idea) return;

    status.textContent = "Generating...";
    generateBtn.disabled = true;
    downloadBtn.disabled = true;

    try {
        const response = await fetch("/generate-logo", {

            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idea })
        });

        if (!response.ok) throw new Error("Failed");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        img.src = url;
        img.style.display = "block";

        downloadBtn.onclick = () => {
            const a = document.createElement("a");
            a.href = url;
            a.download = "ai-logo.png";
            a.click();
        };

        downloadBtn.disabled = false;
        status.textContent = "Done!";
    } catch {
        status.textContent = "Error generating logo";
    } finally {
        generateBtn.disabled = false;
    }
});
