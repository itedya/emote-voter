import { CACHE_MANAGER, Inject, Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import { BttvEmoteInfo } from "@/bttv/interfaces/bttv-emote-info.interface";
import { SettingsService } from "@/settings/settings.service";
import { Cache } from "cache-manager";

@Injectable()
export class BttvService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private settingsService: SettingsService
  ) {
  }

  private readonly logger = new Logger("BttvService");

  async getAuthUser(forceRefresh: boolean = false) {
    const fromCache = await this.cacheManager.get("bttv-account");

    if (!fromCache || forceRefresh) {
      await this.cacheManager.del("bttv-account");
      const settings = await this.settingsService.get();

      return await axios.get(`https://api.betterttv.net/3/account`, {
        headers: {
          Authorization: `Bearer ${settings.bttvAuthToken}`
        }
      })
        .then(res => {
          this.cacheManager.set("bttv-account", res.data, { ttl: 5443200 });
          return res.data;
        })
        .catch(err => {
          this.logger.error(`Failed getting BetterTTV account info! Check Auth Token, it's probably expired.`);
          return err;
        });
    }

    return fromCache;
  }

  async getAuthUserEmotes() {
    const fromCache = await this.cacheManager.get<BttvEmoteInfo[]>("bttv-emotes");

    if (!fromCache) {
      const authUser = await this.getAuthUser();

      return await axios.get(`https://api.betterttv.net/3/users/${authUser.id}`, {
        params: { limited: false }
      })
        .then(({ data }) => {
          const emotes = [
            ...data.channelEmotes,
            ...data.sharedEmotes
          ];

          this.cacheManager.set<BttvEmoteInfo[]>('bttv-accounts', emotes, { ttl: 3600 });

          return emotes;
        });
    }

    return fromCache;
  }

  async checkIfUserHasEmote(emoteId: string) {
    const userEmotes = await this.getAuthUserEmotes()
      .then(res => res.map(ele => ele.id));

    return userEmotes.includes(emoteId);
  }

  async getEmoteInfo(emoteId: string): Promise<BttvEmoteInfo | false> {
    const fromCache = await this.cacheManager.get<BttvEmoteInfo | false>(`bttv-raw-emotes.${emoteId}`);

    if (!fromCache) {
      return await axios.get(`https://api.betterttv.net/3/emotes/${emoteId}`)
        .then(async ({ data }) => {
          // 9 weeks
          await this.cacheManager.set(`bttv-raw-emotes.${emoteId}`, data, { ttl: 5443200 });
          return data;
        })
        .catch(async err => {
          // 9 weeks
          await this.cacheManager.set(`bttv-raw-emotes.${emoteId}`, false, { ttl: 5443200 });
          return false;
        });
    }

    return fromCache;
  }

  async addEmote(emoteId: string) {
    const settings = await this.settingsService.get();
    const authUser = await this.getAuthUser();

    return await axios.put(`https://api.betterttv.net/3/emotes/${emoteId}/shared/${authUser.id}`, {},{
      headers: {
        Authorization: `Bearer ${settings.bttvAuthToken}`,
        accept: 'json'
      }
    })
      .then(async () => await this.getAuthUser(true));
  }

  async removeEmote(emoteId: string) {
    const settings = await this.settingsService.get();
    const authUser = await this.getAuthUser();

    return await axios.delete(`https://api.betterttv.net/3/emotes/${emoteId}/shared/${authUser.id}`, {
      headers: {
        Authorization: `Bearer ${settings.bttvAuthToken}`,
        "content-type": 'application/json'
      }
    })
      .then(async () => await this.getAuthUser(true));
  }
}
