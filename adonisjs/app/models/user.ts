import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import Message from '#models/message'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Channel from '#models/channel'

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
  declare visibility_status: string

  @hasMany(() => Message)
  declare messages: HasMany<typeof Message>

  @manyToMany(() => Channel, {
    pivotTable: 'user_channels',
  })
  declare channels: ManyToMany<typeof Channel>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
