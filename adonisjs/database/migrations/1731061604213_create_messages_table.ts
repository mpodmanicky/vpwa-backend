import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      // User can have many message, hence the relationship HasMany
      // lucid.adonisjs.com/docs/relationships
      table.integer('user_id').references('users.id').onDelete('CASCADE')
      table.text('message').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
