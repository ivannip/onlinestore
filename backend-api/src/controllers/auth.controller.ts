import { Request, Response, RequestHandler } from "express";
import bcrypt from "bcryptjs";
import { userService } from "../services/user.service";
import { COOKIE_OPTIONS, getToken, verifyToken } from "../util/authenticate";
import { IUser, INewUser } from "../models/user.model";

// Define a function to handle user registration
const register: RequestHandler = async (
  req: Request<{}, {}, INewUser>,
  res: Response
) => {
  try {
    let newUser = req.body; // Extract user information from the request
    var hashedPassword: string = bcrypt.hashSync(newUser.password, 8); // Hash the user's password
    newUser = { ...newUser, password: hashedPassword }; // Update the user's password to the hashed version

    // Call the user service to create a new user in the database
    const result = await userService.createUser(newUser);

    // If the user was successfully created, generate a token and send it back in a cookie
    if (result !== undefined) {
      var token = getToken({ id: result?.id });
      res.cookie("token", token, COOKIE_OPTIONS);
      res.status(200).json({ success: true, token: token });
    }
    // If the user was not created successfully, send an error message
    else {
      res.status(500).json({ success: false, message: "create reg failed" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err });
  }
};

// Define a function to handle user login
const login: RequestHandler = async (
  req: Request<{}, {}, { email: IUser["email"]; password: IUser["password"] }>,
  res: Response
) => {
  try {
    // Call the user service to find a user with the provided email
    const user = await userService.findByEmail(req.body.email);

    // If the user does not exist, send an error message
    if (!user || user === undefined)
      return res.status(404).json({ message: "User not found" });

    // Check if the provided password matches the hashed password in the database
    var isValid = bcrypt.compareSync(req.body.password, user["password"]);
    if (!isValid)
      return res.status(404).json({ message: "Password incorrect" });

    // If the password is correct, generate a token and send it back in a cookie
    var token = getToken({ id: user["id"] });
    res.cookie("token", token, COOKIE_OPTIONS);
    res
      .status(200)
      .json({
        success: true,
        token: token,
        details: { ...user, password: "" },
      });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

// Define a function to retrieve user information
const retrieveUserInfo: RequestHandler = async (
  req: Request,
  res: Response
) => {
  // Call the user service to find a user by their ID
  const user = await userService.findById(req.body.id);
  // If the user does not exist, send an error message
  if (!user || user === undefined)
    return res.status(404).json("No user found.");
  // If the user exists, send back their information
  res.status(200).json(user);
};

/**
 * Verifies if the user is logged in by checking if the token is valid.
 * If the user is logged in, returns user details excluding the password.
 * If the user is not logged in, returns an "unauthorized" error message.
 * If an error occurs, returns the error message.
 *
 * @param req - The request object containing the cookies.
 * @param res - The response object to send the response back to the client.
 */
const verifyLogin: RequestHandler = async (req: Request, res: Response) => {
    // Extract signed cookies from the request
    const { signedCookies = {} } = req;
    const { token } = signedCookies;
    
    // Check if a token exists
    if (token) {
      try {
        // Verify the token and get the payload
        const payload: any = verifyToken(token);
        
        if (payload) {
          // Find the user by ID using the payload from the token
          const user = await userService.findById(payload.id);
          
          // If user is not found or undefined, return 404 status code and message
          if (!user || user === undefined)
            return res.status(404).json("No user found.");
          
          // If the user is found, return the user details with a success status code
          res.status(200).json({
            success: true,
            token: token,
            details: { ...user, password: "" },
          });
        } else {
          // If the payload is not valid, return 404 status code and message
          res.status(404).json({ message: "unauthorized" });
        }
      } catch (err) {
        // If an error occurs, return 404 status code and the error message
        res.status(404).json({ message: err });
      }
    } else {
      // If a token does not exist, return 404 status code and "unauthorized" message
      res.status(404).json({ message: "unauthorized" });
    }
  };

// Logout the user and clear the cookie
const logout: RequestHandler = (req: Request, res: Response) => {
  const { signedCookies = {} } = req;
  const { token } = signedCookies;
  console.log("Logout:" + token);
  res.clearCookie("token", COOKIE_OPTIONS); // clear token cookie
  res.status(200).json({ success: true }); // return success message
};

export const authController = {
  login,
  logout,
  verifyLogin,
  register,
  retrieveUserInfo,
};
