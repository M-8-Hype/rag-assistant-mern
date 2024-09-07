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