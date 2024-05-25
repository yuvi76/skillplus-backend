# SkillPlus

SkillPlus is a Learning Management System (LMS) designed to provide a robust platform for managing educational courses, tracking progress, and enhancing the learning experience. It is built with Nest.js and MongoDB, and it offers a RESTful API for easy integration with other services.

## Features 

- **User Authentication and Authorization**: Secure login and signup functionality, with role-based access control.
- **Course Management**: Create, update, delete, and view courses. Assign courses to users.
- **Progress Tracking**: Track the progress of users in their assigned courses.
- **Support for Multiple Learning Formats**: Support for various learning formats like Videos, Documents, Quizzes.
- **Notifications and Announcements**: Send notifications and announcements to users.
- **Integration with External Services**: Integration with services like Cloudinary for image storage and Stripe for payment processing.
- **RESTful API**: A comprehensive API for interacting with the system programmatically.

## Installation

### Prerequisites

- Node.js (v16 or later)
- npm (v6 or later)
- MongoDB

### Steps

1. Clone the repository:
  ```sh
  git clone https://github.com/yuvi76/skillplus-backend.git
  cd skillplus
  ```

2. Install dependencies:
  ```sh
  npm install
  ```

3. Set up environment variables:
  - Copy `dev.env` to `.env` and update the environment variables as needed.

4. Run the project:
  ```sh
  npm run start
  ```

## Running Tests

To run tests, run the following command

```bash
  npm run test
```


## API Documentation

[API Swagger Documentation](https://skillplus-backend.vercel.app/api)


## Feedback

If you have any feedback, questions, or issues, please reach out to us at upadhyayyuvi@gmail.com. I appreciate your input and are always looking to improve SkillPlus!