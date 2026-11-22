import { UnauthorizedException } from "@nestjs/common"
import * as bcrypt from "bcrypt"
import { describe, expect, it, vi } from "vitest"

import { AuthService } from "./auth.service.js"

describe("AuthService", () => {
  it("logs in a valid admin and returns a JWT token", async () => {
    const hashedPassword = await bcrypt.hash("admin123", 10)

    const prisma = {
      admin: {
        findUnique: vi.fn().mockResolvedValue({
          id: 1,
          name: "Baltena Admin",
          email: "admin@baltena.com",
          password: hashedPassword,
        }),
      },
    } as any

    const jwtService = {
      signAsync: vi.fn().mockResolvedValue("signed-admin-token"),
    } as any

    const service = new AuthService(prisma, jwtService)

    const result = await service.login(
      "admin@baltena.com",
      "admin123",
    )

    expect(result.access_token).toBe("signed-admin-token")
    expect(result.role).toBe("admin")
    expect(result.admin.email).toBe("admin@baltena.com")
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: 1,
      email: "admin@baltena.com",
      role: "admin",
    })
  })

  it("rejects an invalid admin password", async () => {
    const hashedPassword = await bcrypt.hash("admin123", 10)

    const prisma = {
      admin: {
        findUnique: vi.fn().mockResolvedValue({
          id: 1,
          name: "Baltena Admin",
          email: "admin@baltena.com",
          password: hashedPassword,
        }),
      },
    } as any

    const jwtService = {
      signAsync: vi.fn(),
    } as any

    const service = new AuthService(prisma, jwtService)

    await expect(
      service.login("admin@baltena.com", "wrong-password"),
    ).rejects.toThrow(UnauthorizedException)
    expect(jwtService.signAsync).not.toHaveBeenCalled()
  })
})
