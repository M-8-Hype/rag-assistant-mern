## Status

🚧 **Work in Progress** 🚧  
This project is currently under development. Features and functionality may change as work progresses. Contributions and feedback are welcome, but please note that the project is not yet complete.

## Installation

Before you can run the project locally, ensure you have met the following prerequisites:

### 1. Generate Self-Signed Certificates for HTTPS (Development Only)

To enable HTTPS for your local development environment, you'll need to generate self-signed SSL/TLS certificates. Follow these steps using OpenSSL:

#### Steps to Generate Certificates

1. **Generate a Private Key**

   Open a terminal and navigate to the directory where you want to store your certificates. Run the following command to generate a 2048-bit RSA private key:

   ```bash
   openssl genrsa -out key.pem 2048
   ```

2. **Create a Certificate Signing Request (CSR)**

   Run the following command to create a CSR:
   ```bash
   openssl req -new -key key.pem -out csr.pem
   ```

   You will be prompted to enter information about your organization and the domain name (Common Name, CN). For local development, you can use localhost as the CN.

3. **Generate the Self-Signed Certificate**

   Use the private key and CSR to generate a self-signed certificate:
   ```bash
   openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem
   ```

   This command creates a certificate (cert.pem) that is valid for 365 days.

### 2. Environment Configuration

This project uses environment variables to manage configuration settings for both the client and server components. Environment variables are stored in `.env` files, which are not included in the repository for security reasons. Instead, we provide `.env.example` files that specify the required variables.

#### Setting Up Environment Variables

To set up your environment variables, follow these steps for both the client and server:

1. **Locate the `.env.example` files**
    - Navigate to the `client` and `server` directories to find the `.env.example` files.

2. **Copy and rename**
    - For each component, copy the `.env.example` file and rename it to `.env`.

   ```bash
   # For the client
   cd client
   cp .env.example .env

   # For the server
   cd server
   cp .env.example .env
   ```

3. **Fill in the required variables**

    - Open each `.env` file and fill in the necessary values for each variable. The `.env.example` files provide a template with placeholders that indicate what information needs to be provided.

### 3. Starting Qdrant

To start Qdrant, ensure that Docker Desktop and/or the Docker daemon are running. The application uses Docker to manage the Qdrant container. By default, Qdrant uses the following ports:

- **HTTP Port**: 6333
- **gRPC Port**: 6334

These ports can be adjusted by modifying the corresponding entries in the `.env` file:

```plaintext
QDRANT_HTTP_PORT=your_custom_http_port
QDRANT_GRPC_PORT=your_custom_grpc_port
```

Make sure to restart the application after making any changes to the `.env` file to apply the new port settings.

#### Notes for Different Operating Systems

- **Windows**: Ensure that Docker Desktop is running and configured properly. Use PowerShell or Command Prompt to manage Docker commands.
- **MacOS**: Docker Desktop should be installed and running. Use the Terminal to execute Docker commands.
- **Linux**: Ensure the Docker daemon is running. You may need to use `sudo` for Docker commands depending on your user permissions.

#### Stopping the Docker Container

When terminating the Node server, the Docker container running Qdrant needs to be stopped manually. You can do this by pressing the corresponding button in Docker Desktop or by running the following command in your terminal:

```bash
docker stop qdrant
```

### 4. Handling CORS Issues

The application uses the `cors` middleware to handle Cross-Origin Resource Sharing (CORS) issues. By default, the application allows requests from `localhost` on port `5173`. If you are running the client on a different port or domain, you can specify it in the corresponding `.env` file or may need to generally adjust the CORS settings in the `app.js` file. To learn more about CORS and how to handle these issues, refer to [MDN's CORS reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

This ensures that all resources are released properly and the container does not continue running in the background.

## Usage

This project includes scripts to start both the client and server components of the MERN stack application. You can run each component individually or both concurrently in development mode.

### Available Scripts

- **`npm start`**: This script starts both the client and server concurrently in development mode, enabling features such as hot-reloading for easier development and debugging.
- **`npm run client`**: Starts only the client application in development mode.
- **`npm run server`**: Starts only the server application in development mode.

### How to Use

1. **Ensure dependencies are installed**:

   Before running the application, make sure that all dependencies are installed for both the client and server. Run the following commands from the root directory in order:

   ```bash
   # Install dependencies for both client and server
   npm install
   cd client && npm install
   cd ../server && npm install
    ```

2. **Run both client and server concurrently**:

   To start both the client and server concurrently, run the following command from the root directory:

   ```bash
   # Start both client and server concurrently
   npm start
   ```

   This command will concurrently start both parts of the application, allowing you to make changes without needing to restart the servers manually.


3. **Run client or server individually**:

   To start only either part of the application in development mode, you can use:

   ```bash
   # Start only the client
   npm run client
   
   # Start only the server
   npm run server
   ```

   Alternatively, run either part by navigating to the `client` or `server` directory:

   ```bash
   # Start only the client
   cd client
   npm run dev
   
   # Start only the server
   cd server
   npm run dev
   ```