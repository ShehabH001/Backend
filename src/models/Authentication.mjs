

import axios from "axios";
import admin from "firebase-admin";

// Initialize Firebase Admin SDK for Google OAuth
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

class authentication {
  static async withGoogle(access_token) {
    const decodedToken = await admin.auth().verifyIdToken(access_token);
    return {
      email: decodedToken.email,
      name: decodedToken.name,
      registration_type: "GOOGLE",
    };
  }

  static async withFacebook(access_token) {
    const response = await axios.get(
      `https://graph.facebook.com/debug_token?input_token=${access_token}&access_token=${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`
    );
    const userId = response.data.data.user_id;
    const userResponse = await axios.get(
      `https://graph.facebook.com/${userId}?fields=id,name,email,gender,birthday,picture&access_token=${access_token}`
    );

    const userData = userResponse.data;
    return {
      email: userData.email,
      name: userData.name,
      registration_type: "FACEBOOK",
    };
  }
}

export default authentication;







  // static async register(user) {
  //   const query = `
  //     INSERT INTO temp_user
  //         (name, email, country_code, phone, password, registration_type)
  //     VALUES
  //         ($1, $2, $3, $4, $5, $6)
  //     ON CONFLICT (email) DO UPDATE
  //     SET
  //       name = $1,
  //       country_code = $3,
  //       phone = $4,
  //       password =  $5,
  //       registration_type = $6
  //     RETURNING * `;
  //   const values = [
  //     user.name,
  //     user.email,
  //     user.country_code,
  //     user.phone,
  //     user.password,
  //     user.registration_type,
  //   ];
  //   const result = await gumballPool.query(query, values);
  //   if (result.rowCount === 0) {
  //     throw new Error("User registration failed");
  //   }
  //   return result.rows[0];
  // }

  // static async storeActualUser(user) {
  //   const query = `
  //     INSERT INTO res_partner
  //     (name, email, company_id, phone_code_selection, mobile, password, registration_type, customer_code)
  //     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
  //   const values = [
  //     user.name,
  //     user.email,
  //     null,
  //     user.country_code,
  //     user.phone,
  //     user.password,
  //     user.registration_type,
  //     "CUST-" + user.email.split("@")[0], // Example customer code generation
  //   ];
  //   const result = await darwinPool.query(query, values);
  //   if (result.rowCount === 0) {
  //     throw new Error("Failed to store actual user");
  //   }
  //   return result.rows[0];
  // }

  // static async deleteTempUser(user) {
  //   const { email } = user;
  //   const query = `
  //     DELETE FROM temp_user
  //     WHERE email = $1
  //     AND updated_at < (CURRENT_TIMESTAMP - INTERVAL '${OTP_EXPIRATION_TIME_IN_MINUTES} minute') RETURNING *;`;
  //   const values = [email];
  //   const result = await gumballPool.query(query, values);
  //   if (result.rowCount !== 0) {
  //     return result.rows[0];
  //   }
  // }

  // static async forceDeletingTempUser(user) {
  //   const { email } = user;
  //   const query = `
  //     DELETE FROM temp_user
  //     WHERE email = $1 RETURNING *;`;
  //   const values = [email];
  //   const result = await gumballPool.query(query, values);
  //   if (result.rowCount === 0) {
  //     throw new Error("User not found");
  //   }
  //   return result.rows[0];
  // }

  // static async login(user) {
  //   const query = `
  //     SELECT * FROM res_partner WHERE email = $1 and (password = $2 or password is null) and registration_type = $3`;
  //   const values = [
  //     user.email,
  //     user.password,
  //     user.registration_type,
  //   ];
  //   const result = await darwinPool.query(query, values);
  //   if (result.rowCount === 0) {
  //     throw new Error("User not found");
  //   }
  //   return result.rows[0];
  // }

  // static async logout(user) {
  //   const query = `select * from res_partner where email = $1`;
  //   const values = [user.email];
  //   const result = await darwinPool.query(query, values);
  //   if (result.rowCount === 0) {
  //     throw new Error("User not found");
  //   }
  // }

  // static async getUserByEmail(email) {
  //   const query = `SELECT * FROM res_partner WHERE email = $1`;
  //   const values = [email];
  //   const result = await darwinPool.query(query, values);
  //   if (result.rowCount === 0) {
  //     throw new Error("User not found");
  //   }
  //   return result.rows[0];
  // }

  // static async getTempUserByEmail(email) {
  //   console.log(email);
  //   const query = `SELECT * FROM temp_user WHERE email = $1`;
  //   const values = [email];
  //   const result = await gumballPool.query(query, values);
  //   if (result.rowCount === 0) {
  //     throw new Error("User not found");
  //   }
  //   return result.rows[0];
  // }

  // static async updatePassword(email, new_password) {
  //   const query = `
  //     UPDATE res_partner
  //     SET password = $1
  //     WHERE email = $2
  //     RETURNING *`;
  //   const values = [new_password, email];
  //   const result = await darwinPool.query(query, values);
  //   if (result.rowCount === 0) {
  //     throw new Error("User not found");
  //   }
  //   return result.rows[0];
  // }