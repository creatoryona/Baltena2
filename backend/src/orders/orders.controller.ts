import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common"
import { OrdersService } from "./orders.service.js"
import { CreateOrderDto } from "./dto/create-order.dto.js"
import { AdminAuthGuard } from "../auth/admin-auth.guard.js"
import { CustomerAuthGuard } from "../auth/customer-auth.guard.js"
import type { AuthRequest } from "../auth/customer-auth.guard.js"

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() data: CreateOrderDto) {
    return this.ordersService.create(data)
  }

  @Get("my-orders")
  @UseGuards(CustomerAuthGuard)
  findMyOrders(@Req() req: AuthRequest) {
    const customerId = req.user?.sub
    if (!customerId) return []
    return this.ordersService.findByCustomer(customerId)
  }

  @Get()
  @UseGuards(AdminAuthGuard)
  findAll() {
    return this.ordersService.findAll()
  }

  @Get(":orderNumber")
  findOne(@Param("orderNumber") orderNumber: string) {
    return this.ordersService.findOne(orderNumber)
  }

  @Patch(":id/status")
  @UseGuards(AdminAuthGuard)
  updateStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body("status") status: string
  ) {
    return this.ordersService.updateStatus(id, status)
  }
}
