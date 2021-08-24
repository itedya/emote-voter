import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EmoteChangeEntity } from "@/emote-changes/entities/emote-change.entity";
import { IsNull, LessThan, MoreThan, Not, Repository } from "typeorm";
import { CreateEmoteChangeRequestDto } from "@/emote-changes/dto/create-emote-change-request.dto";
import * as moment from "moment";

@Injectable()
export class EmoteChangesService {
  constructor(
    @InjectRepository(EmoteChangeEntity)
    private emoteChangeRepository: Repository<EmoteChangeEntity>
  ) {
  }

  async addVoteToEmoteChange(messageId: string, voteType: "up" | "down") {
    // get emote change entity
    const emoteChange = await this.emoteChangeRepository.findOne({ where: { voteMessageId: messageId } });

    // if vote ended, return void
    if (emoteChange.voteEnds.getTime() < new Date().getTime()) return;

    if (voteType === "up") {
      await this.emoteChangeRepository.save({
        ...emoteChange,
        voteUp: emoteChange.voteUp + 1
      });
    } else {
      await this.emoteChangeRepository.save({
        ...emoteChange,
        voteDown: emoteChange.voteDown + 1
      });
    }
  }

  async removeVoteToEmoteChange(messageId: string, voteType: "up" | "down") {
    // get emote change entity
    const emoteChange = await this.emoteChangeRepository.findOne({ where: { voteMessageId: messageId } });

    // if vote ended, return void
    if (emoteChange.voteEnds.getTime() < new Date().getTime()) return;

    if (voteType === "up") {
      await this.emoteChangeRepository.save({
        ...emoteChange,
        voteUp: emoteChange.voteUp - 1
      });
    } else {
      await this.emoteChangeRepository.save({
        ...emoteChange,
        voteDown: emoteChange.voteDown - 1
      });
    }
  }

  getWithoutVoteMessage() {
    return this.emoteChangeRepository.find({
      where: {
        voteEnds: MoreThan(moment().format("YYYY-MM-DD HH:mm:ss")),
        voteMessageId: null
      }
    });
  }

  getWithVoteMessageAndWithoutEndedVote() {
    return this.emoteChangeRepository.find({
      where: {
        voteEnds: MoreThan(moment().format("YYYY-MM-DD HH:mm:ss")),
        voteMessageId: Not(IsNull())
      }
    });
  }

  getWithEndedVotes() {
    return this.emoteChangeRepository.find({
      where: {
        voteEnds: LessThan(moment().format("YYYY-MM-DD HH:mm:ss")),
        voteMessageId: Not(IsNull())
      }
    });
  }

  async createEmoteChangeRequest(serviceType: "bttv", createEmoteChangeRequest: CreateEmoteChangeRequestDto) {
    return await this.emoteChangeRepository.save({
      serviceType,
      fromEmoteId: createEmoteChangeRequest.fromEmoteId,
      toEmoteId: createEmoteChangeRequest.toEmoteId,
      voteEnds: moment().add(20, "seconds").toDate()
    });
  }

  async addVoteMessageIdToEmoteChangeRequest(messageId: string, emoteChangeId: string) {
    await this.emoteChangeRepository.save({
      id: emoteChangeId,
      voteMessageId: messageId
    });
  }
}
