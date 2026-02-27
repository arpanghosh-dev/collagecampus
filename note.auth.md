# Access Token vs Refresh Token

**Access Token** and **Refresh Token** are two types of tokens used in authentication systems, particularly in OAuth 2.0 and JWT-based authentication.

---

## Access Token

An **access token** is a credential used to authenticate API requests and access protected resources.

### Key Characteristics:
- 🔑 **Short-lived** (typically minutes to hours)
- 📤 **Sent with every API request** (usually in Authorization header)
- 👤 **Contains information** about the user/permissions
- ❌ **Cannot be revoked** easily once issued

### Example Use:  

Authorization: Bearer eyJhbGciOiJIUzI1NiIs...


---

## Refresh Token

A **refresh token** is a special token used to obtain new access tokens without requiring the user to log in again.

### Key Characteristics:
- ⏱️ **Long-lived** (days to months)
- 🔒 **Stored securely** (not sent with every request)
- 🔄 **Can be revoked** if needed
- 🎯 **Used only** at the token refresh endpoint

---

## Why They're Used

### 1. Security 🛡️
- **Access tokens** have short lifespans to limit damage if stolen
- **Refresh tokens** can be stored more securely and rotated
- If an access token is compromised, it expires quickly

### 2. User Experience ✨
- Users stay logged in without re-entering credentials
- Automatic token refresh happens in the background
- Seamless long-term sessions

### 3. Control ⚙️
- Refresh tokens can be revoked (e.g., password change, logout)
- Server can issue new access tokens with updated permissions
- Better session management

---

## How It Works

```javascript
// 1. Login
POST /login → Returns { accessToken, refreshToken }

// 2. API Request
GET /api/data 
Headers: { Authorization: `Bearer ${accessToken}` }

// 3. Token Expired (401)
When accessToken expires, client gets 401 Unauthorized

// 4. Refresh
POST /refresh 
Body: { refreshToken: "xxx" }
→ Returns { newAccessToken }

// 5. Retry Original Request
GET /api/data with new accessToken