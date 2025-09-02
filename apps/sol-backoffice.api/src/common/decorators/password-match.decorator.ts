import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class PasswordMatchConstraint implements ValidatorConstraintInterface {
  validate(confirmPassword: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const password = (args.object as any)[relatedPropertyName];
    return password === confirmPassword;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} deve ser igual ao campo ${relatedPropertyName}`;
  }
}

export function PasswordMatch(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: PasswordMatchConstraint,
    });
  };
}
