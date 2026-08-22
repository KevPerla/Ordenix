export class EmailAlreadyExistsError extends Error {
  constructor() {
    super('El correo ya está registrado.');
    this.name = 'EmailAlreadyExistsError';
  }
}
