export class UserDoestHaveEmoteException extends Error {
  constructor(emoteId: string) {
    super(`User doesn't have emote ID ${emoteId}`);
  }
}