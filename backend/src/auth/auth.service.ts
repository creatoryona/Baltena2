import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import { PrismaService } from "../prisma/prisma.service.js"

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const admin = await this.prisma.admin.findUnique({
      where: {
        email: email.trim().toLowerCase(),
      },
    })

    if (!admin) {
      throw new UnauthorizedException(
        "Invalid email or password",
      )
    }

    const passwordValid = await bcrypt.compare(
      password,
      admin.password,
    )

    if (!passwordValid) {
      throw new UnauthorizedException(
        "Invalid email or password",
      )
    }

    const token = await this.jwtService.signAsync({
      sub: admin.id,
      email: admin.email,
      role: "admin",
    })

    return {
      access_token: token,
      role: "admin",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    }
  }

  async registerCustomer(
    name: string,
    email: string,
    password: string,
  ) {
    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()

    if (!cleanName) {
      throw new ConflictException("Name is required")
    }

    if (!cleanEmail) {
      throw new ConflictException("Email is required")
    }

    if (password.length < 6) {
      throw new ConflictException(
        "Password must be at least 6 characters",
      )
    }

    const existingCustomer =
      await this.prisma.customer.findUnique({
        where: {
          email: cleanEmail,
        },
      })

    if (existingCustomer) {
      throw new ConflictException(
        "An account with this email already exists",
      )
    }

    const existingAdmin =
      await this.prisma.admin.findUnique({
        where: {
          email: cleanEmail,
        },
      })

    if (existingAdmin) {
      throw new ConflictException(
        "This email is already registered",
      )
    }

    const hashedPassword =
      await bcrypt.hash(password, 10)

    const customer =
      await this.prisma.customer.create({
        data: {
          name: cleanName,
          email: cleanEmail,
          password: hashedPassword,
        },
      })

    const token = await this.jwtService.signAsync({
      sub: customer.id,
      email: customer.email,
      role: "customer",
    })

    return {
      access_token: token,
      role: "customer",
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
      },
    }
  }

  async customerLogin(
    email: string,
    password: string,
  ) {
    const cleanEmail = email.trim().toLowerCase()

    // Check admin account first.
    // This allows the main Login page to recognize
    // both admins and customers.
    const admin = await this.prisma.admin.findUnique({
      where: {
        email: cleanEmail,
      },
    })

    if (admin) {
      const passwordValid =
        await bcrypt.compare(
          password,
          admin.password,
        )

      if (passwordValid) {
        const token =
          await this.jwtService.signAsync({
            sub: admin.id,
            email: admin.email,
            role: "admin",
          })

        return {
          access_token: token,
          role: "admin",
          admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
          },
        }
      }
    }

    // If it is not an admin, check customer.
    const customer =
      await this.prisma.customer.findUnique({
        where: {
          email: cleanEmail,
        },
      })

    if (!customer) {
      throw new UnauthorizedException(
        "Invalid email or password",
      )
    }

    const passwordValid =
      await bcrypt.compare(
        password,
        customer.password,
      )

    if (!passwordValid) {
      throw new UnauthorizedException(
        "Invalid email or password",
      )
    }

    const token =
      await this.jwtService.signAsync({
        sub: customer.id,
        email: customer.email,
        role: "customer",
      })

    return {
      access_token: token,
      role: "customer",
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
      },
    }
  }

  async updateProfile(customerId: number, data: { name: string; email: string }) {
    const cleanName = data.name.trim()
    const cleanEmail = data.email.trim().toLowerCase()

    if (!cleanName) {
      throw new ConflictException("Name cannot be empty")
    }
    if (!cleanEmail) {
      throw new ConflictException("Email cannot be empty")
    }

    const existingCustomer = await this.prisma.customer.findUnique({
      where: { email: cleanEmail },
    })

    if (existingCustomer && existingCustomer.id !== customerId) {
      throw new ConflictException("Email already in use by another account")
    }

    const updated = await this.prisma.customer.update({
      where: { id: customerId },
      data: {
        name: cleanName,
        email: cleanEmail,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    return {
      message: "Profile updated successfully",
      customer: updated,
    }
  }

  async changePassword(
    customerId: number,
    data: { currentPassword: string; newPassword: string },
  ) {
    if (!data.currentPassword || !data.newPassword) {
      throw new ConflictException("Both current and new password are required")
    }

    if (data.newPassword.length < 6) {
      throw new ConflictException("New password must be at least 6 characters")
    }

    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    })

    if (!customer) {
      throw new UnauthorizedException("Customer not found")
    }

    const isMatch = await bcrypt.compare(
      data.currentPassword,
      customer.password,
    )

    if (!isMatch) {
      throw new UnauthorizedException("Current password is incorrect")
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10)

    await this.prisma.customer.update({
      where: { id: customerId },
      data: { password: hashedPassword },
    })

    return {
      message: "Password changed successfully",
    }
  }
}
