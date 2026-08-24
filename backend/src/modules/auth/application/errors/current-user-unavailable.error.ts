export class CurrentUserUnavailableError extends Error {
  constructor() {
    super('Authenticated user is unavailable');
    this.name = 'CurrentUserUnavailableError';
  }
}
