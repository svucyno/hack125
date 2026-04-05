# MEDI-CONNECT 🛡️ AI-Powered Healthcare Platform

Secure, HIPAA-compliant platform for real-time medical services.

## 🚀 Deployment

1.  **Environment Variables**:
    -   Create `.env` in `server/` with:
        -   `MONGO_URI`
        -   `JWT_SECRET`
        -   `NODE_ENV=production`

2.  **Build & Launch**:
    ```bash
    npm run install-all
    npm run build
    npm start
    ```

## Dashboard Access
- **Admin**: Audit logs & Verification
- **Doctor**: Session-limited PHI access
- **Staff**: Billing & Lab reports
- **Patient**: AI symptoms & SOS