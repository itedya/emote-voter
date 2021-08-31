import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EmoteChangeEntity } from "@/emote-changes/entities/emote-change.entity";
import { IsNull, LessThan, MoreThan, Not, Repository } from "typeorm";
import { CreateEmoteChangeRequestDto } from "@/emote-changes/dto/create-emote-change-request.dto";
import * as moment from "moment";
import { ServiceType } from "@/bot/enums/service-type.enum";

@Injectable()
export class EmoteChangesService {
  constructor(
    @InjectRepository(EmoteChangeEntity)
    private emoteChangeRepository: Repository<EmoteChangeEntity>
  ) {
  }

  /**
   * Find emote change by ID
   *
   * @param id
   */
  findById(id: string) {
    return this.emoteChangeRepository.findOne(id);
  }

  /**
   * Find emote change request by vote message ID
   *
   * @param messageId
   */
  findByMessageId(messageId: string) {
    return this.emoteChangeRepository.findOne({
      where: {
        voteMessageId: messageId
      }
    })
  }

  /**
   * Add vote up or down to emote change request
   *
   * @param messageId
   * @param action
   * @param voteType
   */
  async changeVote(messageId: string, action: "add" | "remove", voteType: "up" | "down") {
    const emoteChange = await this.emoteChangeRepository.findOne({ where: { voteMessageId: messageId } });

    if (emoteChange.voteEnds.getTime() < new Date().getTime() || emoteChange.completed) return;

    if (action === "add") {
      voteType === "up" ? emoteChange.voteUp += 1 : emoteChange.voteDown += 1;
    } else {
      voteType === "up" ? emoteChange.voteUp -= 1 : emoteChange.voteDown -= 1;
    }

    await this.emoteChangeRepository.save(emoteChange);
  }

  /**
   * Get emote change requests that don't have vote message
   */
  getWithoutVoteMessage() {
    return this.emoteChangeRepository.find({
      where: { voteMessageId: null, completed: false }
    });
  }

  /**
   * Get emote change requests with ended vote
   */
  getWithEndedVote() {
    return this.emoteChangeRepository.find({
      where: {
        voteEnds: LessThan(moment().format("YYYY-MM-DD HH:mm:ss")),
        voteMessageId: Not(IsNull()),
        completed: false
      }
    });
  }

  /**
   * Create emote change request
   *
   * @param serviceType
   * @param createEmoteChangeRequest
   */
  async create(serviceType: ServiceType, createEmoteChangeRequest: CreateEmoteChangeRequestDto) {
    return await this.emoteChangeRepository.save({
      serviceType,
      fromEmoteId: createEmoteChangeRequest.fromEmoteId,
      toEmoteId: createEmoteChangeRequest.toEmoteId,
      voteEnds: null
    });
  }

  /**
   * Add vote message ID to emote change request
   *
   * @param messageId
   * @param emoteChangeId
   */
  async addVoteMessageId(messageId: string, emoteChangeId: string) {
    await this.emoteChangeRepository.save({
      id: emoteChangeId,
      voteMessageId: messageId,
      voteEnds: moment(new Date()).add(5, "minutes").format("YYYY-MM-DD HH:mm:ss")
    });
  }

  /**
   * Switch completed attribute in emote change request
   *
   * @param emoteChangeId
   */
  async switchCompleted(emoteChangeId: string) {
    await this.emoteChangeRepository.save({
      id: emoteChangeId,
      completed: true
    })
  }
}
