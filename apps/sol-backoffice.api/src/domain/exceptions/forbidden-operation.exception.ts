export class ForbiddenOperationException extends Error {
  constructor(message = 'This operation is not allowed') {
    super(message);
    this.name = 'ForbiddenOperationException';
  }
}
