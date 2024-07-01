import { Body, Controller, Delete, Param, Post, Req } from '@nestjs/common';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/user/enums/roles.enum';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Roles(Role.EMPLOYEE, Role.MANAGER)
  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string): Promise<boolean> {
    return this.commentService.remove(+id, req.user.id);
  }

  @Roles(Role.EMPLOYEE, Role.MANAGER)
  @Post()
  create(@Req() req: any, @Body() createCommentDto: CreateCommentDto): Promise<CreateCommentDto> {
    return this.commentService.create(req.user.id, createCommentDto);
  }
}
