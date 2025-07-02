export interface IBaseUseCase<Input, Output> {
  execute(data: Input): Promise<Output>;
}