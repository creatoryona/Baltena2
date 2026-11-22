import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common"
import { AuthService } from "./auth.service.js"
import { CustomerAuthGuard } from "./customer-auth.guard.js"
import type { AuthRequest } from "./customer-auth.guard.js"

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

  // Customer update profile
  @Patch("customer/profile")
  @UseGuards(CustomerAuthGuard)
  updateProfile(
    @Req() req: AuthRequest,
    @Body() body: { name: string; email: string },
  ) {
    const customerId = req.user!.sub
    return this.authService.updateProfile(customerId, body)
  }

  // Customer change password
  @Patch("customer/change-password")
  @UseGuards(CustomerAuthGuard)
  changePassword(
    @Req() req: AuthRequest,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    const customerId = req.user!.sub
    return this.authService.changePassword(customerId, body)
  }
}
