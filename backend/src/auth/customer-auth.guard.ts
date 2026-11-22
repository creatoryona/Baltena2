import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Request } from "express"

export interface AuthRequest extends Request {
  user?: {
    sub: number
    email: string
    role: string
  }
}

@Injectable()
export class CustomerAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>()
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Login required")
    }

    const token = authHeader.substring(7)

    try {
      const payload = await this.jwtService.verifyAsync(token)
      request.user = payload
      return true
    } catch {
      throw new UnauthorizedException("Invalid or expired session")
    }
  }
}

