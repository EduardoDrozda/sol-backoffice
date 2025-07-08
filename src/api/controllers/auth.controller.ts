import { CreateAuthRequestDTO } from "@application/dtos/auth/requests";
import { CreateAuthUseCase } from "@application/use-cases/auth";
import { IsPublic } from "@common/authentication";
import { Body, Controller, Post } from "@nestjs/common";

@Controller()
export class AuthController {
  constructor(
    private readonly createAuthUseCase: CreateAuthUseCase,
  ) { }

  @IsPublic()
  @Post('/login')
  async login(@Body() createAuthDto: CreateAuthRequestDTO) {
    return this.createAuthUseCase.execute(createAuthDto);
  }
}
