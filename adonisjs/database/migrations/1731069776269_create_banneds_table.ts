import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'banneds'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.foreign('user_id').references('users.id')
      table.foreign('channel_id').references('channels.id')

    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
