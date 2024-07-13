# DOCUMENTATION

### Welcome to the documentation for my portfolio drawing gallery web application! Below is an overview of the core functionality and technologies used in the application.

# About the application

My web application is a portfolio drawing gallery inspired by Instagram. Users can view drawings, add comments to them, as well as register, log in to their accounts and edit their profiles.

## Functionality

**View drawings:** Users can view drawings from the portfolio on the Arts page. Drawings are retrieved using the Instagram API.

**Commenting** on drawings: Users can add comments to drawings.

**Comment Management:** Administrators can delete user comments.

**Register and sign in to an account:** Users can register and sign in to their accounts to access additional features of the app.

**Edit Profile:** Users can change information in their profiles such as first name, last name, avatar and other details.

## Technologies

The following technologies and tools are used in the development of the application:

**Node.js:** A server-side JavaScript runtime environment.
**Express:** A framework for building web applications on Node.js.
**Ajax:** A technology for asynchronous data exchange between client and server.
**Instagram API:** Application programming interface for accessing Instagram data.

# Arts page

The Arts page allows users to view drawings from the portfolio and add comments to them. For administrators, a function to delete comments is also available.

## View drawings

Users can view drawings from the portfolio on the Arts page. The drawings are presented as a gallery, each drawing is accompanied by a description and comments from users.

## Adding comments

Users can add comments to drawings, expressing their thoughts, impressions and feedback on the work. To add a comment a user must be logged in to their account.

## Deleting comments (for administrators)

Administrators have the ability to delete user comments that violate community rules or contain inappropriate content. The administrator needs to be logged in to perform this operation.

## Integration with Instagram API

Instagram API is used to retrieve drawings and their descriptions. The application requests data from Instagram and displays it on the Arts page for users.

# Registration and Login page

The Registration and Login page allows users to register with the system to access additional features of the application or log in to their accounts.

## New User Registration

To register a new user, follow the steps below:

Click on the ‘Sign in’ link on the main page of the app.
Fill out the registration form with your details such as username, email address and password.
Click on the ‘Create user’ button.

Follow the steps below to log in to your account:

Click on the ‘Log in’ link on the main page of the app.
Fill out the login form with your email address and password.
After successful login, you will be redirected to the main page of the app.

## Data security and privacy

I ensure the security and privacy of our users' data. All passwords are stored encrypted and i take steps to protect users' personal information from unauthorised access.

# User Profile page

The User Profile page allows users to view and edit their personal information such as first name, last name and avatar.

## View Profile

Users can view their profile on the User Profile page, which displays information about them including first name, last name, email address and other details.

## Editing a profile

Follow the steps below to edit your profile:

Click on the ‘Profile’ link in the top menu of the application.
Change the required fields such as first name, last name, avatar and other details.
Click on the ‘Save Changes’ button.
Changing your password

## Authorisation and access to personal information

Authentication is required to access a user's personal information and edit their profile. Users must be logged in to the system to perform these actions.

# Environment Variables

The application uses the following environment variables for configuration:

**PORT:** The port on which the server is running (default is 3000).
**DATABASE_URL:** The URL to connect to the database.
**INSTAGRAM_ACCESS_TOKEN:** The token used to access the Instagram API.
**SECRET_KEY:** The secret key used to create and verify JWT authentication tokens. \*_Security recommendations_
