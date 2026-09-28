import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  listar() { 
    return this.users.listar(); 
  }

  @Get(':id')
  buscar(@Param('id', ParseIntPipe) id: number) {
    return this.users.buscarPorId(id);
  }

  @Post()
  criar(@Body() dto: CreateUserDto) { 
    return this.users.criar(dto); 
  }
}