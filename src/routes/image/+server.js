// @ts-check
// import { createCanvas } from 'canvas';
// import { chromium } from 'playwright';
import sharp from 'sharp';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	// Create an SVG string with a circle and some text
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
    <circle cx="100" cy="100" r="50" fill="red" />
    <text x="10" y="50" font-family="Verdana" font-size="15" fill="blue">${new Date().toLocaleString()}</text>
    <text x="20" y="70" font-family="Verdana" font-size="15" fill="red">pinto smells</text>
</svg>`;

	// Convert the SVG to a PNG
	const buffer = await sharp(Buffer.from(svg)).png().toBuffer();

	return new Response(buffer, { headers: { 'content-type': 'image/png' } });
}

// // Create a new canvas
// const canvas = createCanvas(500, 500);
// const ctx = canvas.getContext('2d');

// // Draw a red circle
// ctx.beginPath();
// ctx.arc(100, 100, 50, 0, Math.PI * 2, true); // Outer circle
// ctx.fillStyle = 'red';
// ctx.fill();

// // Draw a line
// ctx.beginPath();
// ctx.moveTo(150, 150);
// ctx.lineTo(300, 300);
// ctx.strokeStyle = 'blue';
// ctx.stroke();

// // Add some text
// ctx.font = '30px Arial';
// ctx.fillStyle = 'black';
// ctx.fillText('Hello, world!', 50, 50);

// // Get the PNG data as a buffer
// const buffer = canvas.toBuffer('image/png');

// return new Response(buffer, { headers: { 'content-type': 'image/png' } });

// const browser = await chromium.launch(); // Or 'firefox' or 'webkit'.
// const page = await browser.newPage();
// await page.goto('http://pauls-weather-thing.com');
// await page.waitForLoadState('networkidle');
// const buffer = await page.screenshot({
// 	animations: 'disabled',
// 	fullPage: true,
// 	type: 'png'
// });
// return new Response(buffer, { headers: { 'content-type': 'image/png' } });
