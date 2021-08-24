import { Inject, Injectable } from "@nestjs/common";
import axios from "axios";
import { CreateEmoteChangeRequestDto } from "@/emote-changes/dto/create-emote-change-request.dto";
import { EmoteDoesntExistException } from "@/emote-changes/exceptions/emote-doesnt-exist.exception";
import { EmoteChangesService } from "@/emote-changes/emote-changes.service";
import { BttvEmoteInfo } from "@/bttv/interfaces/bttv-emote-info.interface";

@Injectable()
export class BttvService {
  constructor(private emoteChangesService: EmoteChangesService) {
  }

  async checkIfEmoteExists(emoteId: string) {
    return await this.getEmoteInfo(emoteId)
      .then(() => true)
      .catch(() => false);
  }

  async getEmoteInfo(emoteId: string): Promise<BttvEmoteInfo> {
    return await axios.get(`https://api.betterttv.net/3/emotes/${emoteId}`)
      .then(({data}) => data);
  }

  async createBttvEmoteChangeRequest(createEmoteChangeRequestDto: CreateEmoteChangeRequestDto) {
    const fromEmoteIdExists = await this.checkIfEmoteExists(createEmoteChangeRequestDto.fromEmoteId);
    if (!fromEmoteIdExists) throw new EmoteDoesntExistException("from_emote_id");

    const toEmoteIdExists = await this.checkIfEmoteExists(createEmoteChangeRequestDto.toEmoteId);
    if (!toEmoteIdExists) throw new EmoteDoesntExistException("to_emote_id");

    await this.emoteChangesService.createEmoteChangeRequest("bttv", createEmoteChangeRequestDto);
  }

}
