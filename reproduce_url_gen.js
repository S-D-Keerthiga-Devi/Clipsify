
const ImageKit = require("imagekit");

// Mock env vars based on user input
const urlEndpoint = "https://ik.imagekit.io/keerthiga404";
const videoUrl = "https://ik.imagekit.io/keerthiga404/beach_RNTCfsj-U.mp4";

const imagekit = new ImageKit({
    publicKey: "dummy_public_key",
    privateKey: "dummy_private_key",
    urlEndpoint: urlEndpoint,
});

try {
    const url = new URL(videoUrl);
    const filePath = url.pathname;

    console.log("Extracted filePath:", filePath);

    // Test with src
    const publicUrlSrc = imagekit.url({
        src: videoUrl,
        transformation: [], // Explicitly empty
    });

    console.log("Generated publicUrl (src):", publicUrlSrc);
} catch (error) {
    console.error("Error:", error);
}
