import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createMemberDto: CreateMemberDto) {
    return this.prisma.members.create({
      data: {
        ...createMemberDto,
        birth_date: new Date(createMemberDto.birth_date)
      }
    });
  }

  async findAll() {
    return await this.prisma.members.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} member`;
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }

  async pay(memberId: number) {
    // Ellenőrzés: létezik-e a tag
    await this.prisma.members.findUniqueOrThrow({
      where: { id: memberId }
    }).catch(() => {
      throw new NotFoundException();
    });

    // Ellenőrzés: fizetett-e már az aktuális hónapban
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const existingPayment = await this.prisma.payments.findFirst({
      where: {
        member_id: memberId,
        paid_at: { gte: startOfMonth }
      }
    });

    if (existingPayment) {
      throw new ConflictException('Member has already paid for this month');
    }

    // Payment létrehozása
    return this.prisma.payments.create({
      data: {
        member_id: memberId,
        amount: 5000,
        paid_at: now,
      }
    });
  }
}
