import Errors, { HttpCode, Message } from "../libs/Errors";
import { AUTH_TIME, SECRET_TOKEN } from "../libs/config";
import { Member } from "../libs/types/member";
import jwt from "jsonwebtoken";

class AuthService {
  private readonly secret_token;
  constructor() {
    this.secret_token = SECRET_TOKEN;
  }

  public createToken(payload: Member) {
    return new Promise((resolve, reject) => {
      const duration = `${AUTH_TIME}h`;
      jwt.sign(
        payload,
        this.secret_token as string,
        {
          expiresIn: duration,
        },
        (err, token) => {
          if (err)
            reject(
              new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CREATION_FAIL)
            );
          else resolve(token as string);
        }
      );
    });
  }

  public async checkAuth(token: string): Promise<Member> {
    const result = (await jwt.verify(
      token,
      this.secret_token as string
    )) as Member;
    console.log(`member nick check: ${result.memberNick}`);
    return result;
  }
}

export default AuthService;
