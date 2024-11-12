import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

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
  declare notification_status: string

  @column()
  declare visibility_status: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
