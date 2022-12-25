import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "./jwt.service";
import { UsersService } from "../../users/users.service";
import { NextFunction, Request } from "express";

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService, private readonly usersService: UsersService) {
  }
  async use(req:Request, res: Response, next: NextFunction) {
    if ("x-jwt" in req.headers) {
      const token = req.headers["x-jwt"];
      const decoded = this.jwtService.verify(token.toString());
      if (typeof decoded === "object" && decoded.hasOwnProperty("id")) {
        try {
          const { user } = await this.usersService.getUser({ id: decoded["id"] });
          req["user"] = user;
        } catch (error) {
          // TODO 에러 검사 필요
        }
      }
    }
    next();
  }
}