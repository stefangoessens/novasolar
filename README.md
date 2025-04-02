# NovaSolar

A React application for a solar panel installation company that allows potential customers to request quotes and calculates estimated costs based on their specific needs.

## Features

- Multi-step quote calculator form
- Responsive design for mobile and desktop
- Integration with Pipedrive CRM for lead management
- Dynamic pricing based on customer selections
- Form validation and error handling

## Tech Stack

- React.js
- Tailwind CSS for styling
- Axios for API requests
- Pipedrive API for CRM integration

## Getting Started

### Prerequisites

- Node.js 14+ and npm

### Installation

1. Clone the repository:
```
git clone https://github.com/stefangoessens/novasolar.git
cd novasolar
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the root directory and add your Pipedrive API key:
```
REACT_APP_PIPEDRIVE_API_TOKEN=your_pipedrive_api_token
```

4. Start the development server:
```
npm start
```

The application will be available at http://localhost:3000

## Environment Setup

- Set up Pipedrive API token in the .env file

## Deployment

To build the app for production:

```
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request