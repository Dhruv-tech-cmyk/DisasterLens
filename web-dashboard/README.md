# DisasterLens web dashboard

Responsive Next.js interface for the DisasterLens FastAPI image assessment API.

## Run locally

1. Start the API from the repository root. Install the packages in `requirements.txt`, then run `python main.py`. The API listens at `http://localhost:8080` by default.
2. In this folder, install the dependencies with `pnpm install` (or `npm install`).
3. Copy `.env.example` to `.env.local`. Set `NEXT_PUBLIC_DISASTERLENS_API_URL` if the API is running somewhere other than `http://localhost:8080`.
4. Start the dashboard with `pnpm dev` (or `npm run dev`) and open `http://localhost:3000`.

The API must allow browser requests from the dashboard origin. The current FastAPI app enables CORS for all origins.

## What the dashboard sends and displays

- `POST /analyze/` as `multipart/form-data` with `file` (post-event image), `file_pre` (optional baseline image), and `disaster_type` (`flood`, `wildfire`, or `earthquake`).
- Flood uses a single image. Wildfire and earthquake require both post-event and pre-event images.
- The report shows only the API response: `disaster_type`, `flood_percentage`, `damage_percentage`, `severity`, and `status`. These percentages are image-based estimates, not geographic area measurements.
- The map is a selectable OpenStreetMap basemap preview. Uploaded images are not georeferenced or drawn on the map by the current API.
- Incident triage cards are illustrative sample content, not live model output.

## API configuration

Set `NEXT_PUBLIC_DISASTERLENS_API_URL` to the FastAPI base URL, with no trailing slash. Example:

```env
NEXT_PUBLIC_DISASTERLENS_API_URL=https://your-api.example.com
```
