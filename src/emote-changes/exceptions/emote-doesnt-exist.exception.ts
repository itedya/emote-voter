export class EmoteDoesntExistException extends Error {
  constructor(place: string) {
    super(`Emotka podana w parametrze ${place} nie istnieje!`);
  }
}