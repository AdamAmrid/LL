import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    console.log('Launching browser...');
    // Use the detected local Chrome path
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    const baseUrl = 'https://um6p-solidarity-network.vercel.app';
    const routes = [
        { path: '/', name: 'home' },
        { path: '/about', name: 'about' },
        { path: '/activities', name: 'activities' },
        { path: '/team', name: 'team' },
        { path: '/login', name: 'login' },
        { path: '/signup', name: 'signup' }
    ];

    const publicDir = path.join(__dirname, 'public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
    }

    try {
        for (const route of routes) {
            const url = `${baseUrl}${route.path}`;
            console.log(`Navigating to ${url}...`);
            await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

            // Scroll down to trigger scroll-based animations (fadeInUp)
            await page.evaluate(async () => {
                await new Promise((resolve) => {
                    let totalHeight = 0;
                    const distance = 100;
                    const timer = setInterval(() => {
                        const scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;

                        if (totalHeight >= scrollHeight) {
                            clearInterval(timer);
                            resolve();
                        }
                    }, 100);
                });
            });

            // Wait a bit for animations to finish completing
            await new Promise(r => setTimeout(r, 2000));

            // Scroll back to top to ensure we capture from start (although fullPage handles this, some stickies might need reset)
            await page.evaluate(() => window.scrollTo(0, 0));
            await new Promise(r => setTimeout(r, 500));

            const screenshotPath = path.join(publicDir, `${route.name}.png`);
            console.log(`Capturing ${route.name}...`);
            await page.screenshot({ path: screenshotPath, fullPage: true });
        }
        console.log('All screenshots captured!');
    } catch (e) {
        console.error('Error in capture loop:', e);
    } finally {
        await browser.close();
    }
})();
