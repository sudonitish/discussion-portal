# Discussion Portal

A web-based discussion platform built with Node.js, Express, and MongoDB.

## Features

- Create and view discussions
- Real-time discussion management
- MongoDB database integration
- Clean and responsive web interface

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Frontend**: HTML, CSS, JavaScript
- **Environment**: dotenv for configuration

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env` file
4. Start the application:
   ```bash
   node main.js
   ```

## Project Structure

```
discussion-portal/
├── database/
│   ├── discussions.js    # Discussion model
│   └── init.js          # Database initialization
├── public/
│   ├── index.html       # Main HTML page
│   ├── script.js        # Client-side JavaScript
│   └── style.css        # Styling
├── main.js              # Server entry point
├── package.json         # Dependencies
└── .env                 # Environment variables
```

## License

This project is licensed under the Educational Community License, Version 2.0 (ECL-2.0) - see the [LICENSE](LICENSE) file for details.

### Key License Points:

- Free for educational and non-commercial use only
- Redistributions must retain the copyright and license
- No warranty is provided

## Author

sudonitish