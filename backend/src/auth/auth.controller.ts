import {
  Body,
  Controller,
  Post,
} from "@nestjs/common"
import { AuthService } from "./auth.service.js"

@Controller("admin/auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  // Existing admin login
  @Post("login")
  login(
    @Body()
    body: {
      email: string
      password: string
    },
  ) {
    return this.authService.login(
      body.email,
      body.password,
    )
  }

  // Customer registration
  @Post("customer/register")
  registerCustomer(
    @Body()
    body: {
      name: string
      email: string
      password: string
    },
  ) {
    return this.authService.registerCustomer(
      body.name,
      body.email,
      body.password,
    )
  }

  // Customer login
  @Post("customer/login")
  customerLogin(
    @Body()
    body: {
      email: string
      password: string
    },
  ) {
    return this.authService.customerLogin(
      body.email,
      body.password,
    )
  }
}
