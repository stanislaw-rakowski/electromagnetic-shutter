import "./App.css";
import React from "react";
import Octagon from "./Octagon";

const FREQUENCY = 4.53 * Math.pow(10, 9);
const SPEED_OF_LIGHT = 299792458;
const LAMBDA = SPEED_OF_LIGHT / FREQUENCY;
const GAP = LAMBDA / 10;

const MATRIX_SIZE = 500;
const MATRIX_PADDING = 10;
const PIXEL_GAP = GAP * 1000;

const DESIRED_EFFICIENCY = 8;

function getInnerLength(length: number) {
	return length * Math.pow(4 + 2 * Math.pow(2, 0.5), 0.5);
}

function getEfficiency(innerLength: number) {
	return 20 * Math.log10(LAMBDA / (2 * (innerLength / 1000)));
}

function App() {
	const [length, setLength] = React.useState(10);
	const height = length * (1 + Math.pow(2, 0.5));
	const currentRowCount = Math.floor(
		(MATRIX_SIZE - MATRIX_PADDING) / (height + PIXEL_GAP)
	);

	const [count, setCount] = React.useState(Math.pow(currentRowCount, 2));

	const innerLength = getInnerLength(length);
	const efficiency = getEfficiency(innerLength);
	const multiEfficiency = -20 * Math.log10(Math.pow(count, 0.5));

	React.useEffect(() => {
		const results = [];

		for (let i = 0.001; i < 200; i += 0.001) {
			results.push({ length: i, efficiency: getEfficiency(getInnerLength(i)) });
		}

		results.sort((a, b) => b.efficiency - a.efficiency);

		const result = results
			.filter(result => result.efficiency > DESIRED_EFFICIENCY)
			.at(-1);

		setLength(result?.length ?? 0);
	}, []);

	React.useEffect(() => {
		setCount(Math.pow(currentRowCount, 2));
	}, [length]);

	return (
		<div className="App">
			<div className="container">
				<div
					className="matrix"
					style={{
						gridGap: `${PIXEL_GAP}px`,
						gridTemplateColumns: `repeat(${currentRowCount}, ${height}px)`,
						gridTemplateRows: `repeat(${currentRowCount}, ${height}px)`,
					}}
				>
					{[...Array(count)].map((_, index) => (
						<Octagon key={index} />
					))}
				</div>
				<div className="range-container">
					<label htmlFor="side">Side length:</label>
					<input
						id="side"
						name="side"
						type="range"
						min="0.001"
						max="200"
						step="0.001"
						value={length}
						onChange={event => setLength(Number(event.target.value))}
					/>
				</div>
			</div>
			<div className="container">
				<table>
					<tbody>
						<tr>
							<td>Wave frequency</td>
							<td>4.53Ghz</td>
						</tr>
						<tr>
							<td>Wave length</td>
							<td>{`${(LAMBDA * 1000).toFixed(3)}px`}</td>
							<td>{`${LAMBDA.toFixed(6)}m`}</td>
						</tr>
						<tr>
							<td>Count</td>
							<td>{count}</td>
						</tr>
						<tr>
							<td>Side length</td>
							<td>{`${length.toFixed(3)}px`}</td>
							<td>{`${(length / 10).toFixed(3)}cm`}</td>
						</tr>
						<tr>
							<td>Height</td>
							<td>{`${height.toFixed(3)}px`}</td>
							<td>{`${(height / 10).toFixed(6)}cm`}</td>
						</tr>
						<tr>
							<td>Longest diagonal</td>
							<td>{`${innerLength.toFixed(3)}px`}</td>
							<td>{`${(innerLength / 10).toFixed(6)}cm`}</td>
						</tr>
						<tr>
							<td>Efficiency</td>
							<td>{`${efficiency.toFixed(3)}dB`}</td>
						</tr>
						<tr>
							<td>Multi efficiency</td>
							<td>{`${multiEfficiency.toFixed(3)}dB`}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default App;
