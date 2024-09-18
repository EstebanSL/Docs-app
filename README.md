# Google Docs Clone

This project is a clone of Google Docs, built with a React frontend and a Node.js backend using socket.io for real-time collaboration. The idea of the proyect is to explore new librearies and approach the logic and development of a real-time application.

### Prerequisites

- Node.js
- npm or yarn

## Tech Stack

**Client:** React, React-router, Quill, Socket.io, Typescript, Vite

**Server:** Node, Mongoose, socket.io

## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies in both the client and server directories

```bash
  cd client
  npm install
```

Start the server

```bash
  cd server
  npm run start
```

## Lessons Learned

### Rich Text Implementation with Quill

Through the development of this project, we gained valuable experience using the Quill library for rich text editing. Quill's powerful features and flexibility allowed us to implement a robust text editor with formatting options, embedding of media, and seamless user experience.

### Real-Time Collaboration with Socket.io

Explored the capabilities of Socket.io to implement real-time collaborative editing. By utilizing Socket.io, i were able to create a responsive and interactive environment where multiple users can edit documents simultaneously and see each other's changes in real-time.the challenges associated were mosthly related to managing concurrent user interactions.

## Next Steps

- **Implement User Accounts**: Introduce user authentication and account management to allow users to create accounts, log in, and manage their personal information.

- **Add Documents List Page**: Develop a page where users can view a list of their documents, including options to create new documents, delete existing ones, and open documents for editing.

- **Add User Edit/Read Permissions**: Implement permission controls to manage user access levels. Allow document owners to set read or edit permissions for other users, enhancing collaboration and security.

- **Implement Document Sharing**: Enable users to share documents with others via email or direct links. Include options to specify access permissions (view or edit) for shared documents.

