import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.string('username')
      table.string('email')
      table.string('password')
      table
        .enu('visibility_status', ['online', 'offline', 'away'], {
          useNative: true,
          enumName: 'user_visibility_status',
          existingType: true,
        })
        .defaultTo('offline')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
