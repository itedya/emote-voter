import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("settings")
export class SettingsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", nullable: true })
  bttvAuthToken: string;

  @Column({ type: "varchar", nullable: true })
  requestChannelId: string;

  @Column({ type: "varchar", nullable: true })
  announcementsChannelId: string;

  @Column({ type: "varchar", nullable: true })
  discordBotToken: string;

  // emojis
  @Column({ type: "varchar", nullable: true })
  voteUpEmojiResolver: string;

  @Column({ type: "varchar", nullable: true })
  voteDownEmojiResolver: string;

  // create - update
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}