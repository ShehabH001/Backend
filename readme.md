<div align="center">

# Authentication API

</div>

<div align="start">

### Authentication BASE URL : http://server-name/api/v2/auth/

</div>

## Register User Endpoint

### **POST** `/api/v2/auth/register`

#### Request Format

- **URL**: `http://server-name/api/v2/auth/register`
- **Method**: `POST`
- **Authentication**: None required
- **Content-Type**: `application/json`

#### Important Notes:

1. On successful registration (201 response):

   - A verification email will be sent to the user's email address

#### Request Body Constraints:

- name: required (2-255 characters)
- email: required (valid email format)
- country_code: required
- phone: required
- password: required

#### Example Request 

```json
{
  "name": "username",
  "email": "user@domain.com",
  "country_code": "+20",
  "phone": "1111111111",
  "password": "user password"
}
```

#### Responses

Success (201 Created):

```json
{
  "name": "username",
  "email": "user@domain.com",
  "country_code": "+20",
  "phone": "1111111111",
  "password": "user password",
  "created_at": "2025-04-14T15:37:56.043Z"
}
```

#### Error Cases

Error (400 Bad Request):

```json
{
  "message": "Error registering user"
}
```

<hr style="height:15px; border-width:0; background-color:#00000000">

---

<hr style="height:15px; border-width:0; background-color:#00000000">

## OTP Verification Endpoint

### **POST** `/api/v2/auth/verfiy_otp`

#### Request Format

- **URL**: `http://server-name/api/v2/auth//register/verify-otp`
- **Method**: `POST`
- **Authentication**: None required
- **Content-Type**: `application/json`

#### Request Body Constraints:

- email
- otp

#### Example Request

```json
{
  "email": "user@domain.com",
  "otp": "0000"
}
```

#### Responses

Success (200 Ok):

```json
{
  "id": "123456",
  "name": "username",
  "email": "user@domain.com",
  ...
  ...
}
```

#### Error Cases

OTP is expired (403 Forbidden):

```json
{
  "message": "OTP is expired"
}
```

Error (400 Bad Request):

```json
{
  "message": "Error verifying OTP"
}
```

<hr style="height:15px; border-width:0; background-color:#00000000">

---

<hr style="height:15px; border-width:0; background-color:#00000000">

## Resend OTP Verification Endpoint

### **POST** `/api/v2/auth/register/resend-otp`

#### Request Format

- **URL**: `http://server-name/api/v2/auth/register/resend-otp`
- **Method**: `POST`
- **Authentication**: None required
- **Content-Type**: `application/json`

#### Important Notes:

- You can successfully request a new OTP verification endpoint when the old OTP has expired. (After 1 minute)

#### Request Body Constraints:

- name: required (2-255 characters)
- email: required (valid email format)
- country_code: required
- phone: required
- password: required

#### Example Request 

```json
{
  "name": "username",
  "email": "user@domain.com",
  "country_code": "+20",
  "phone": "1111111111",
  "password": "user password"
}
```

#### Responses


Success (200 Ok):

```json
{
  "name": "username",
  "email": "user@domain.com",
  "country_code": "+20",
  "phone": "1111111111",
  "password": "user password",
  "created_at": "2025-04-14T15:37:56.043Z"
}
```

OTP is not expired (401 Not Forbidden):

```json
{
  "message": "Resend OTP verified failed because it is not expired"
}
```

#### Error Cases

Error (400 Bad Request):

```json
{
  "message": "Error resending verification"
}
```

<hr style="height:15px; border-width:0; background-color:#00000000">

---

<hr style="height:15px; border-width:0; background-color:#00000000">

## Login Endpoint

### **POST** `/api/v2/auth/login`

#### Request Format

- **URL**: `http://server-name/api/v2/auth/login`
- **Method**: `POST`
- **Authentication**: None required
- **Content-Type**: `application/json`

#### Request Body Constraints:

- email: required,
- password: required for EMAIL_PASSWORD
- registration_type: required (EMAIL_PASSWORD|GOOGLE|FACEBOOK)

#### Example Request (Google)

```json
{
  "user_email": "user@domain.com",
  "user_password_hash": null,
  "registration_type": "GOOGLE"
}
```

#### Example Request (Email)

```json
{
  "user_email": "user@domain.com",
  "user_password_hash": "hashed_password",
  "registration_type": "EMAIL_PASSWORD"
}
```

#### Responses

Success (200 Ok):

#### Headers:
```json
    Authorization: Bearer {token}
    X-Auth-Token: {token}
    Access-Control-Expose-Headers: Authorization, X-Auth-Token
```

#### Body:

```json
{
  "id": "123456",
  "name": "username",
  "email": "user@domain.com",
  ...
  ...
}
```

#### Error Cases

Invalid credentials or user not found (401 Unauthorized):

```json
{
  "message": "Error logging in"
}
```

Error (400 Bad Request):

```json
{
  "message": "Error logging in"
}
```

<hr style="height:15px; border-width:0; background-color:#00000000">

---

<hr style="height:15px; border-width:0; background-color:#00000000">

## Forget Password Endpoint

### **POST** `/api/v2/auth/forgot-password`

#### Request Format

- **URL**: `http://server-name/api/v2/auth/forgot-password`
- **Method**: `POST`
- **Authentication**: None required
- **Content-Type**: `application/json`

#### Request Body Constraints:

- email: required


#### Example Request

```json
{
  "email": "user@domain.com"
}
```

#### Responses

Success (200 Ok):

#### Body:

```json
{
  "message": "OTP sent successfully"
}
```

#### Error Cases

User not found (401 Unauthorized):

```json
{
  "message": "User not found"
}
```

Error (400 Bad Request):

```json
{
  "message": "Error sending OTP" 
}
```

<hr style="height:15px; border-width:0; background-color:#00000000">

---

<hr style="height:15px; border-width:0; background-color:#00000000">

## Reset Password Endpoint

### **POST** `/api/v2/auth/forgot-password/reset-password`

#### Request Format

- **URL**: `http://server-name/api/v2/auth/forgot-password/reset-password`
- **Method**: `POST`
- **Authentication**: None required
- **Content-Type**: `application/json`

#### Request Body Constraints:

- email: required
- new_password: required
- otp: required

#### Example Request

```json
{
  "email": "user@domain.com",
  "new_password": "new_user_password_hash",
  "otp": "0000"
}
```

#### Responses

Success (200 Ok):

#### Body:

```json
{
  "message": "Password updated successfully"
}
```

#### Error Cases

OTP expired (403 Forbidden):

```json
{
  "message": "OTP is expired"
}
```

Error (400 Bad Request):

```json
{
  "message": "Error updating password"
}
```



<hr style="height:15px; border-width:0; background-color:#00000000">

---

<hr style="height:15px; border-width:0; background-color:#00000000">

## Reset Password Endpoint

### **POST** `/api/v2/auth/forgot-password/verify-otp`

#### Request Format

- **URL**: `http://server-name/api/v2/auth/forgot-password/verify-otp`
- **Method**: `POST`
- **Authentication**: None required
- **Content-Type**: `application/json`

#### Request Body Constraints:

- email: (string, required): The user's email address.
- otp: (string, required): The OTP code sent to the user's email.

#### Example Request

```json
{
  "email": "user@example.com",
  "otp": "0000"
}
```

#### Responses

Success (200 Ok):

#### Body:

```json
{
  "message": "OTP verified successfully"
}
```

#### Error Cases

OTP expired (403 Forbidden):

```json
{
  "message": "OTP not found or expired"
}
```



<hr style="height:15px; border-width:0; background-color:#00000000">

---

<hr style="height:15px; border-width:0; background-color:#00000000">

## Reset Password Endpoint

### **GET** `/api/v2/auth/me`

- Returns information about the currently authenticated user.  
- Requires a valid JWT access token in the `Authorization` header.

#### Request Format

- **URL**: `http://server-name/api/v2/auth/me`
- **Method**: `POST`
- **Authentication**: Bearer <your_jwt_token>
- **Content-Type**: `application/json`

#### Responses

Success (200 Ok):

#### Body:

```json
{
  "id": 123,
  "name": "username",
  "email": "user@example.com",
  // ...other user fields
}
```

#### Error Cases

OTP expired (403 Forbidden):

```json
{
  "message": "Access denied. No token provided."
}
```



<hr style="height:15px; border-width:0; background-color:#00000000">

---

<hr style="height:15px; border-width:0; background-color:#00000000">

## Reset Password Endpoint

### **GET** `/api/v2/auth/google`

- Authenticates a user using Google OAuth.  
- Expects a Google access token in the request body.  
- If authentication is successful, returns the user object and a JWT token.


#### Request Body Constraints:

- access_token (string, required): The Google OAuth access token.

#### Example Request

```json
{
  "access_token": "string"
}
```

#### Request Format

- **URL**: `http://server-name/api/v2/auth/me`
- **Method**: `POST`
- **Authentication**: NONE_REQUIRED
- **Content-Type**: `application/json`

#### Responses

Success (200 Ok):

- The authenticated user object is returned in the response body.
- The JWT token is sent in the response headers (`Authorization` or `X-Auth-Token`).

**Example Response Body:**
```json
{
  "user": {
    "id": 123,
    "name": "username",
    "email": "user@example.com"
    // ...other user fields
  }
}
```

#### Error Cases

OTP expired (400 Bad Request):

```json
{
  "message": "Missing required fields."
}
```
