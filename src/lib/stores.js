import { browser } from '$app/environment';
import { writable, readable, derived } from 'svelte/store';
import * as d3 from 'd3';
import * as Plot from '@observablehq/plot';
import * as everpolate from 'everpolate';

export const debug_mode = writable(false);

const tick = readable(0, (set) => {
	setInterval(() => set(new Date()), 10_000);
});

const tide_data = derived(
	tick,
	($tick, set) => {
		if (!browser) return;
		async function get_tide_data() {
			const start = d3.utcSecond();
			const end = d3.utcDay.offset(start, 2);
			const url = new URL(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter`);
			url.searchParams.set(`begin_date`, d3.utcFormat(`%Y%m%d`)(start));
			url.searchParams.set(`end_date`, d3.utcFormat(`%Y%m%d`)(end));
			url.searchParams.set(`station`, `8722670`);
			url.searchParams.set(`product`, `predictions`);
			url.searchParams.set(`datum`, `MLLW`);
			url.searchParams.set(`interval`, `1`);
			url.searchParams.set(`time_zone`, `gmt`);
			url.searchParams.set(`units`, `english`);
			url.searchParams.set(`format`, `json`);
			const response_1_minute = await d3.json(url).catch(() => undefined);
			return response_1_minute.predictions
				.map((d) => ({
					...d,
					date: new Date(d.t + `Z`),
					value: +d.v
				}))
				.filter((d) => d.date >= new Date());
		}

		get_tide_data().then((data) => set(data));
	},
	[]
);

const weather_data = derived(
	tick,
	($tick, set) => {
		if (!browser) return;
		async function get_weather_data() {
			const weather_gov_grid_points = await d3.json(
				`https://api.weather.gov/points/26.3995,-80.0656`
			);

			const weather_gov_forecast_grid_data = await d3.json(
				weather_gov_grid_points?.properties?.forecastGridData
			);

			return weather_gov_forecast_grid_data;
		}

		get_weather_data()
			.then((data) => set(data))
			.catch(() => set([]));
	},
	[]
);

export const tide_plot = derived(tide_data, ($tide_data) => {
	console.log({ $tide_data });
	return {
		y: { nice: 3, ticks: 3, label: 'Tide (ft)' },
		marks: [Plot.line($tide_data, { x: 'date', y: 'value', clip: true })]
	};
});

export const temperature_plot = derived(weather_data, ($weather_data) => {
	const munged = ($weather_data?.properties?.temperature?.values ?? [])
		.map(parse_object_stupid_time)
		.map((d) => ({ ...d, value: d.value * 1.8 + 32 }));
	return {
		y: { nice: 3, ticks: 3, label: 'Temperature (°F)' },
		marks: [Plot.line(munged, { x: `date`, y: `value`, clip: true })]
	};
});

export const wind_plot = derived(weather_data, ($weather_data) => {
	const wind_speed = ($weather_data?.properties?.windSpeed?.values ?? [])
		.map(parse_object_stupid_time)
		.map((d) => ({ ...d, value: d.value * 0.539957 }));

	const wind_direction = ($weather_data?.properties?.windDirection?.values ?? []).map(
		parse_object_stupid_time
	);

	const wind_speed_dates = wind_speed.map((d) => d.date);
	const wind_speed_values = wind_speed.map((d) => d.value);

	const wind_direction_dates = wind_direction.map((d) => d.date);

	const wind_direction_values_interpolated = everpolate.linear(
		wind_direction_dates,
		wind_speed_dates,
		wind_speed_values
	);

	const wind_direction_with_interpolated = wind_direction.map((d, i) => ({
		...d,
		value2: wind_direction_values_interpolated[i]
	}));

	return {
		y: { nice: 3, ticks: 3, label: 'Wind Speed (knots)' },
		marks: [
			Plot.line(wind_speed, { x: 'date', y: 'value', clip: true }),
			Plot.vector(wind_direction_with_interpolated, {
				x: 'date',
				y: 'value2',
				rotate: (d) => d.value + 180,
				length: 'value2',
				clip: true
			})
		]
	};
});

export const wave_plot = derived(weather_data, ($weather_data) => {
	const wave_height = ($weather_data?.properties?.waveHeight?.values ?? [])
		.map(parse_object_stupid_time)
		.map((d) => ({ ...d, value: d.value * 3.2808 }));
	return {
		y: { label: 'Wave Height (ft)', nice: 3, ticks: 3 },
		marks: [Plot.line(wave_height, { x: `date`, y: `value`, clip: true })]
	};
});

function parse_object_stupid_time(d) {
	return {
		...d,
		date: parse_stupid_time(d.validTime)
	};
}

function parse_stupid_time(string) {
	return d3.isoParse(string.replace(/\/.*/, ''));
}
