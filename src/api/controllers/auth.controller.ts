import { CreateAuthRequestDTO } from '@application/dtos/auth/requests';
import { CreateAuthUseCase } from '@application/use-cases/auth';
import { IsPublic } from '@common/authentication';
import { CookieService } from '@common/cookie/cookie.service';
import { EnviromentService } from '@common/enviroment';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Controller()
export class AuthController {
  constructor(
    private readonly createAuthUseCase: CreateAuthUseCase,
    private readonly env: EnviromentService,
  ) {}

  @IsPublic()
  @Post('/login')
  async login(@Body() createAuthDto: CreateAuthRequestDTO) {
    return this.createAuthUseCase.execute(createAuthDto);
  }

  @Get('check')
  check(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user;

    if (!user) {
      res.clearCookie(this.env.get('COOKIE_NAME'));
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    return user;
  }
}
