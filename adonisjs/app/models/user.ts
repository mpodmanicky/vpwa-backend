import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import Message from '#models/message'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Channel from '#models/channel'

export enum VisibilityStatus {
  Online = 'online',
  Offline = 'offline',
  Away = 'away',
}

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare username: string

  @column()
  declare email: string

  @column()
  declare password: string

  @column()
  declare visibility_status: VisibilityStatus

  @hasMany(() => Message, { foreignKey: 'message_id' })
  declare messages: HasMany<typeof Message>

  @manyToMany(() => Channel, {
    pivotTable: 'user_channels',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'channel_id',
  })
  declare channels: ManyToMany<typeof Channel>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
