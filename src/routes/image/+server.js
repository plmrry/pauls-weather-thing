// @ts-check
import { chromium } from 'playwright';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	const browser = await chromium.launch(); // Or 'firefox' or 'webkit'.
	const page = await browser.newPage();
	await page.goto('http://pauls-weather-thing.com');
	await page.waitForLoadState('networkidle');
	const buffer = await page.screenshot({
		animations: 'disabled',
		fullPage: true,
		type: 'png'
	});
	return new Response(buffer, { headers: { 'content-type': 'image/png' } });
}
