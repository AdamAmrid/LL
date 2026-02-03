import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    });
    const page = await browser.newPage();
    const publicDir = path.join(__dirname, 'public');
    const videos = ['1.mp4', '2.mp4', '3.mp4', '4.mp4', '5.mp4', '6.mp4', '7.mp4', '8.mp4', '9.mp4'];

    const results = {};

    for (const video of videos) {
        const filePath = path.join(publicDir, video);
        if (!fs.existsSync(filePath)) {
            console.log(`File not found: ${video}`);
            continue;
        }

        // We use absolute file path for local loading
        const fileUrl = 'file:///' + filePath.replace(/\\/g, '/');

        try {
            // Navigate to a blank page with video element
            await page.setContent(`<video src="${fileUrl}" preload="metadata"></video>`);

            const duration = await page.evaluate(async () => {
                const video = document.querySelector('video');
                return new Promise(resolve => {
                    if (video.duration) resolve(video.duration);
                    video.onloadedmetadata = () => resolve(video.duration);
                    video.onerror = () => resolve(0);
                });
            });

            results[video] = duration;
            console.log(`${video}: ${duration}s`);
        } catch (e) {
            console.error(`Error processing ${video}:`, e);
            results[video] = 5; // Fallback
        }
    }

    console.log('JSON_START');
    console.log(JSON.stringify(results));
    console.log('JSON_END');

    await browser.close();
})();
