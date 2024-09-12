## Prerequisites

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

### 2. Starting Qdrant

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

This ensures that all resources are released properly and the container does not continue running in the background.