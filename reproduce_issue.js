
const ImageKit = require("imagekit");

// Mock env vars based on user input
const urlEndpoint = "https://ik.imagekit.io/keerthiga404";
const videoUrl = "https://ik.imagekit.io/keerthiga404/beach_RNTCfsj-U.mp4";
const dirtyVideoUrl = "https://ik.imagekit.io/keerthiga404/beach_RNTCfsj-U.mp4?tr=w-300";

const imagekit = new ImageKit({
    publicKey: "dummy_public_key",
    privateKey: "dummy_private_key",
    urlEndpoint: urlEndpoint,
});

console.log("--- Test 1: Clean URL with src ---");
try {
    const publicUrl = imagekit.url({
        src: videoUrl,
        transformation: [],
    });
    console.log("Public URL:", publicUrl);
} catch (error) {
    console.error("Error:", error);
}

console.log("\n--- Test 2: Dirty URL with src ---");
try {
    const publicUrl = imagekit.url({
        src: dirtyVideoUrl,
        transformation: [],
    });
    console.log("Public URL:", publicUrl);
} catch (error) {
    console.error("Error:", error);
}

console.log("\n--- Test 3: Signed URL ---");
try {
    const signedUrl = imagekit.url({
        src: videoUrl,
        signed: true,
        expireSeconds: 300, // 5 minutes
        transformation: [],
    });
    console.log("Signed URL:", signedUrl);
} catch (error) {
    console.error("Error:", error);
}
