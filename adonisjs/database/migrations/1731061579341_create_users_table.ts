import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('username').notNullable()
      table.string('email', 254).notNullable()
      table.string('password').notNullable()
      table.enu('notification_status', ['MENTIONS', 'ACTIVE', 'NONE'],
        {
          useNative: true,
          enumName: 'user_notification_status',
          existingType: false,
          schemaName: 'public',
        }).notNullable()

      table.enu('visibility_status', ['ONLINE', 'OFFLINE', 'DO NOT DISTURB'],
        {
          useNative: true,
          enumName: 'user_visibility_status',
          existingType: false,
          schemaName: 'public',
        }).notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
