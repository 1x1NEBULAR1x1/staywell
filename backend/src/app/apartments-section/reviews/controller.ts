import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import {
  example_review,
  example_reviews_list_result,
} from '@shared/src/types/apartments-section';
import { CreateReviewDto, UpdateReviewDto, ReviewsFiltersDto } from './dto';
import { User } from '@shared/src/database';
import { ApiOperation, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CrudService, ListService } from './services';
import { JwtAuthGuard, AdminOnly, Auth } from 'src/lib/common';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly crudService: CrudService,
    private readonly listService: ListService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new review' })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({
    status: 201,
    description: 'The review has been successfully created.',
    example: example_review,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 409, description: 'Review already exists.' })
  create(@Auth() user: User, @Body() data: CreateReviewDto) {
    return this.crudService.create({ data, user });
  }

  @Get()
  @ApiOperation({ summary: 'Get reviews by filters' })
  @ApiResponse({ status: 200, example: example_reviews_list_result })
  findAll(@Query() filters: ReviewsFiltersDto) {
    return this.listService.findAll({ filters });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a review by ID' })
  @ApiResponse({
    status: 200,
    description: 'The review has been successfully retrieved.',
    example: example_review,
  })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.crudService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a review by ID' })
  @ApiResponse({
    status: 200,
    description: 'The review has been successfully updated.',
    example: example_review,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  update(
    @Auth() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateReviewDto,
  ) {
    return this.crudService.update({ id, data, user });
  }

  @Delete(':id')
  @AdminOnly()
  @ApiOperation({ summary: 'Delete a review by ID' })
  @ApiResponse({
    status: 204,
    description: 'The review has been successfully deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  remove(@Auth() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.crudService.remove({ id, user });
  }
}
