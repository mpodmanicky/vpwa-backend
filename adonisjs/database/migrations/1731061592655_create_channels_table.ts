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
      // reference to the user who is the owner of the channel
      table.integer('owner_id').references('user.id').onDelete('CASCADE')
      // reference to the messages that belongTo the channel
      table.integer('message_id').references('messages.id').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

