# AI Life Trainer Backend

Backend service for the AI Life Trainer application, providing API endpoints for activity tracking and AI trainer interactions.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create PostgreSQL database:
```bash
psql -U postgres
CREATE DATABASE ai_life_trainer;
\c ai_life_trainer
```

3. Set up database tables:
```bash
psql -U postgres -d ai_life_trainer -f db.sql
```

4. Configure environment variables:
- Copy `.env.example` to `.env`
- Update the values according to your environment

5. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Activity Tracking

#### POST /api/punch
Create a new activity entry.
```json
{
  "exercise": "30 minutes cardio",
  "nutrition": "Protein-rich breakfast",
  "sleep": "8 hours"
}
```

#### GET /api/punch
Retrieve all activity entries.

#### PUT /api/punch/:id
Update an existing activity entry.
```json
{
  "exercise": "45 minutes strength training",
  "nutrition": "Balanced lunch",
  "sleep": "7.5 hours"
}
```

#### DELETE /api/punch/:id
Delete an activity entry.

### AI Trainer

#### POST /api/trainer/chat
Send a message to the AI trainer.
```json
{
  "message": "How can I improve my workout routine?"
}
```

#### GET /api/trainer/chat
Retrieve chat history.

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

Error responses include:
```json
{
  "status": "error",
  "message": "Error description"
}
```

## Development

- Uses nodemon for automatic server restart during development
- PostgreSQL for data persistence
- Express.js for API routing
- CORS enabled for frontend integration

## Environment Variables

```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=ai_life_trainer
DB_PASSWORD=your_password
DB_PORT=5432
PORT=5000
NODE_ENV=development
