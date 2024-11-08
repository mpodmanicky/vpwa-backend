import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'channels'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.enu('visibility', ['PUBLIC', 'PRIVATE'], {
        useNative: true,
        enumName: 'channel_visibility_status',
        existingType: false,
        schemaName: 'public',
      }).notNullable()
      table.foreign('user_id').references('user.id')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

