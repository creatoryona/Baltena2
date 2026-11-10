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
}
