import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CrudService, ListService } from './services';
import { User } from '@shared/src/database';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionsFiltersDto,
} from './dto';
import {
  example_transaction,
  example_transactions_list_result,
} from '@shared/src/types/transactions-section/example.data';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Auth, JwtAuthGuard } from 'src/lib/common';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly crudService: CrudService,
    private readonly listService: ListService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new transaction' })
  @ApiResponse({
    status: 201,
    description: 'Transaction successfully created',
    example: example_transaction,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Transaction already exists' })
  async create(@Auth() user: User, @Body() data: CreateTransactionDto) {
    return this.crudService.create({ data, user });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get list of all transactions' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of transactions',
    example: example_transactions_list_result,
  })
  async findAll(@Auth() user: User, @Query() filters: TransactionsFiltersDto) {
    return await this.listService.findAll({ filters, user });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns transaction',
    example: example_transaction,
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async findOne(@Auth() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.crudService.findOne({ id, user });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update transaction' })
  @ApiResponse({
    status: 200,
    description: 'Transaction successfully updated',
    example: example_transaction,
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async update(
    @Auth() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateTransactionDto,
  ) {
    return this.crudService.update({ id, data, user });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete transaction' })
  @ApiResponse({ status: 204, description: 'Transaction successfully deleted' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async remove(@Auth() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.crudService.remove({ id, user });
  }
}
