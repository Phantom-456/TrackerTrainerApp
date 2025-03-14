## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/         # React components
│   ├── AITrainer.js   # AI chat interface
│   ├── Charts.js      # Activity visualization
│   ├── Navbar.js      # Navigation component
│   ├── PunchForm.js   # Activity input form
│   └── ThemeToggle.js # Theme switcher
├── styles/
│   └── theme.css      # Global styles and theme
└── App.js             # Main application component
```

## Available Scripts

- `npm start`: Run development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm eject`: Eject from Create React App

## Technologies Used

- React.js
- React Router
- Chart.js
- Axios
- Tailwind CSS
- Google Fonts
- Font Awesome

## Environment Variables

Create a `.env` file in the project root:

```env
REACT_APP_API_URL=http://localhost:5000
```

## API Integration

The frontend communicates with the backend API for:
- Activity logging (POST /api/punch)
- Activity retrieval (GET /api/punch)
- AI trainer chat (POST /api/trainer/chat)
- Chat history (GET /api/trainer/chat)

## Theme Customization

The application supports two themes:
- Light theme (default)
- Dark theme

Theme preferences are stored in local storage and can be toggled using the theme switch button.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
