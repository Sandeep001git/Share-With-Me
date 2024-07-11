# ShareMe

ShareMe is a simple web application for sending files using WebRTC with PeerJS. It allows users to send and receive files without requiring them to log in or provide credentials. Users are assigned a secret key upon account creation, ensuring secure communication.

## Features

- **File Transfer**: Send and receive files using WebRTC with PeerJS.
- **User Roles**: Users can act as senders or receivers.
- **Anonymous Access**: No login or credentials required.
- **Secure Communication**: Each user is given a secret key which is nearly impossible to decode.

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express (if required for serving the frontend and managing peer connections)
- **WebRTC**: PeerJS for managing WebRTC connections

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn

### Installation

1. **Clone the repository**:

    ```sh
    git clone https://github.com/yourusername/shareme.git
    cd shareme
    ```

2. **Install dependencies**:

    ```sh
    npm install
    ```

3. **Run the application**:

    ```sh
    npm start
    ```

4. Open your browser and navigate to `http://localhost:3000`.

## Usage

1. **Creating an Account**:
    - When a user opens the app for the first time, they are assigned a unique secret key. This key is stored locally and is used for secure communication.
    - The key is generated in such a way that it is nearly impossible to decode.

2. **Selecting Mode**:
    - Users can choose to be either a sender or a receiver.
    - The sender initiates the file transfer, and the receiver accepts the files.

3. **Sending Files**:
    - The sender enters the receiver's PeerID and selects the files to send.
    - Once the connection is established, files are transferred securely using WebRTC.

4. **Receiving Files**:
    - The receiver waits for the sender to initiate the connection.
    - Once the sender starts the file transfer, the receiver can download the files.

## How It Works

- **WebRTC with PeerJS**: PeerJS is used to simplify the process of establishing WebRTC connections. It provides an easy-to-use API for creating and managing peer connections.
- **User Identification**: Each user is identified by a unique PeerID and a secret key. The PeerID is used for establishing WebRTC connections, while the secret key ensures secure communication.
- **Anonymous Access**: Users do not need to log in or provide personal information. The app generates a unique secret key for each user on their first visit, which is stored locally.

## Contributing

We welcome contributions! Please follow these steps to contribute:

1. **Fork the repository**.

2. **Create a new branch**:

    ```sh
    git checkout -b feature/your-feature-name
    ```

3. **Make your changes**.

4. **Commit your changes**:

    ```sh
    git commit -m 'Add some feature'
    ```

5. **Push to the branch**:

    ```sh
    git push origin feature/your-feature-name
    ```

6. **Open a pull request**.

## License

This project utilizes libraries that are licensed under the MIT License.

## Acknowledgements

- [PeerJS](https://peerjs.com/) for simplifying WebRTC connections.
- [Node.js](https://nodejs.org/) for the backend runtime.
- [Express](https://expressjs.com/) for the backend framework.

## Contact

For any questions or suggestions, please contact ```sandeepgoswami90550@gmail.com```.

---
