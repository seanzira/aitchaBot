# Aitcha Bot

AitchaBot is a customizable ChatGPT model and personality, designed to function similar to the normal ChatGPT. The differences are present in the sign up and log in processes and how it feels like you're having a conversation with someone you're familiar with, and not a created personality. 

# Table of contents
- [Project Details](#project-details)
- [Features](#features)
- [Usage](#usage)
- [Installation](#installation)
- [License](#license)
- [Contact](#contact)

## Project Details
This project addresses the need for a customizable ChatGPT interface that can be used by any company for any personalised needs that can be added. 

## Features
- **User Input section** : The user can enter any question they need assistance with
- **User Registration and Login** : Securely register and authenticate users, and changes the username on the user's input from 'You' to their username.
- **View History** : Tracking your search history in the event that you need to revisit pages that you came across, with the timestamps.
- **Like and Unlike functionality on the View History** : Better method of keeping track of what you regard important or interesting to come back to
- **Delete history functionality** : To clear your search history if the information is unimportant.
- **Excel File Upload Functionality** : Allows the user to upload Excel files which are then checked for spelling errors, and are displayed underlined in red.

## Usage 
Upon launching the application, users are presented with the main AitchaBot interface, which allows them to:

- 1: SignUp/ login
- 2: Enter anything they need help with
- 3: View History
- 4: Choose a file to upload

## Installation
To set up the application on your local machine, follow these steps:

1. **Download the Project Files**: 
   Clone the repository or download it as a ZIP file. If you’re using Git, run:
   ```bash
   git clone https://github.com/username/aitchaBot.git
2. **Navigate to the Project Directory**
   Tpe: 
   ```bash
   cd aitchaBot
3. **Set up the environment variables**
   Create a .env file in the root of the project's directory to configure your        environment settings. This might include adding:
   ```bash
   PORT:3001
   MONGODB_URI=your_database_url
   JWT_SECRET=FfrRdz72tKrsmgFAj8WXrIJw8e5v1bad
4. **Start the application**
   Launch the app by typing:
   ```bash
   npm start
5. **Access application**
   Open your web browser and navigate to the 'http://localhost:3000' to access      the application.
6. Troubleshooting: If you encounter any issues during installation or running      the application, check the following:

   Ensure that all dependencies are correctly installed without errors.
   Verify your environment variables are set correctly.
   Check the terminal for any error messages that can guide you to potential 
   solutions.

## License
AitchaBot is licensed under the HyperionDev License. See the LICENSE file for more information.

## Contact
For questions, suggestions, or feedback, please reach out to:

Email: seanzira2401@gmail.com
