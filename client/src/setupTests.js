// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Ensure consistent timezone across environments for date calculations
process.env.TZ = 'UTC';

// Global axios mock to avoid ESM parse issues in Jest and control network calls in tests
jest.mock('axios', () => ({
	get: jest.fn(),
	post: jest.fn(),
}));

// Mock Lottie React ESM module to a simple noop component for tests
jest.mock('@lottiefiles/dotlottie-react', () => ({
	DotLottieReact: () => null,
}));

// Mock react-leaflet ESM to simple noops to avoid Jest parsing issues
jest.mock('react-leaflet', () => ({
	MapContainer: () => null,
	TileLayer: () => null,
	Marker: () => null,
	Popup: () => null,
	Tooltip: () => null,
}));

// Stub CSS import used by leaflet to prevent module errors in Jest
jest.mock('leaflet/dist/leaflet.css', () => '');

// Silence noisy React Router v7 future warnings during tests
beforeAll(() => {
	jest.spyOn(console, 'warn').mockImplementation(() => {});
});
afterAll(() => {
	// @ts-ignore
	if (console.warn && console.warn.mockRestore) console.warn.mockRestore();
});
