import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { paraDataUtc } from '../common/helpers/data';
import { Prisma } from '../generated/prisma/client';
import * as bcrypt from 'bcrypt';

const CUSTO_BCRYPT = 12;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: {
          nome: dto.nome,
          email: dto.email,
          senha: await bcrypt.hash(dto.senha, CUSTO_BCRYPT),
          rg: dto.rg,
          cpf: dto.cpf,
          nomeMae: dto.nomeMae,
          role: 'user',
        },
      });
    } catch (erro) {
      throw this.traduzirErro(erro);
    }
  }

  listar() {
    return this.prisma.user.findMany({ orderBy: { id: 'asc' } });
  }

  async buscarPorId(id: number) {
    const usuario = await this.prisma.user.findUnique({ where: { id } });
    if (!usuario) throw new NotFoundException(`Usuario ${id} nao encontrado`);
    return usuario;
  }

  buscarPorEmailComSenha(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      omit: { senha: false },
    });
  }

  private traduzirErro(erro: unknown, id?: number): Error {
    if (erro instanceof Prisma.PrismaClientKnownRequestError) {
      if (erro.code === 'P2002') {
        return new ConflictException('Ja existe um usuario com este email ou cpf');
      }
      if (erro.code === 'P2025') {
        return new NotFoundException(`Usuario ${id} nao encontrado`);
      }
    }
    return erro instanceof Error ? erro : new Error(String(erro));
  }
}