import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("emote_changes")
export class EmoteChangeEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: true })
  fromEmoteId: string;

  @Column({ type: "varchar" })
  toEmoteId: string;

  @Column({ type: "varchar" })
  serviceType: string;

  @Column({ type: "datetime", nullable: true })
  voteEnds: Date;

  @Column({ type: "varchar", nullable: true })
  voteMessageId: string;

  @Column({ type: "integer" })
  voteUp: number;

  @Column({ type: "integer" })
  voteDown: number;

  @Column({ type: "boolean", default: false })
  completed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}