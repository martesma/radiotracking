class CreateUsers < ActiveRecord::Migration
  def self.up
    create_table :users do |t|
      t.string :username, :limit => 20
      t.string :encrypted_password, :limit => 255
      t.string :salt, :limit => 255
      t.string :remember_token, :limit => 255
    end
  end

  def self.down
    drop_table :users
  end
end
