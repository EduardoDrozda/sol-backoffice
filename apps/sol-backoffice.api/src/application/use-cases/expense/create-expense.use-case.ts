import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { IBaseUseCase } from "../IBase.use-case";
import { CreateExpenseRequestDto } from "@application/dtos/expense/request";
import { EXPENSE_REPOSITORY, IExpenseRepository } from "@domain/interfaces/repositories";
import { ExpenseModel } from "@domain/models";
import { LoggerService } from "@common/logger";
import { AuthenticationService } from "@common/authentication";

@Injectable()
export class CreateExpenseUseCase implements IBaseUseCase<CreateExpenseRequestDto, ExpenseModel> {
  constructor(
    @Inject(EXPENSE_REPOSITORY) private readonly expenseRepository: IExpenseRepository,
    private readonly loggerService: LoggerService,
    private readonly authenticationService: AuthenticationService
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute(data: CreateExpenseRequestDto): Promise<ExpenseModel> {
    const session = this.authenticationService.getSession();
    const user = session?.user;
    this.loggerService.log(`Creating expense for user: ${user?.id}`);

    return this.expenseRepository.create({
      issueDate: new Date(data.issueDate),
      description: data.description,
      amount: data.amount,
      categoryExpense: {
        connect: {
          id: data.categoryId
        }
      },
      costCenter: {
        connect: {
          id: data.costCenterId
        }
      },
      user: {
        connect: {
          id: user!.id
        }
      },
      company: {
        connect: {
          id: user!.companyId
        }
      },
      ...(data.groupId && {
        group: {
          connect: {
            id: data.groupId
          }
        }
      }),
      ...(data.projectId && {
        project: {
          connect: {
            id: data.projectId
          }
        }
      })
    });
  }
}