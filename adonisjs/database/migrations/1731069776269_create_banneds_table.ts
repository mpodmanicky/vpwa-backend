import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'banneds'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').references('users.id')
      table.integer('channel_id').references('channels.id')
      table.unique(['user_id', 'channel_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
