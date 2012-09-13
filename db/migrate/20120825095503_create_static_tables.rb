class CreateStaticTables < ActiveRecord::Migration
  def self.up
    create_table :biotopes do |t|
      t.string :biotope, :limit => 50
    end

    create_table :distance_from_waters do |t|
      t.string :distance_from_water, :limit => 50
    end

    create_table :obsers do |t|
      t.string :observer, :limit => 50
    end

    create_table :precipitations do |t|
      t.string :precipitation, :limit => 50
    end

    create_table :released_animals do |t|
      t.integer :animal_id
      t.integer :frequency
      t.string :nickname, :limit => 20
      t.string :sex, :limit => 10
      t.timestamp :birthdate
      t.timestamp :release_date
      t.string :microchip, :limit => 30
      t.string :enclosure_type, :limit => 30
      t.float :release_location_N
      t.float :release_location_E
      t.string :release_site, :limit => 30
      t.text :remarks
    end

    create_table :temperatures do |t|
      t.string :temperature, :limit => 50
    end

    create_table :water_levels do |t|
      t.string :water_level, :limit => 50
    end

    create_table :waterbody_types do |t|
      t.string :waterbody_type, :limit => 50
    end

    create_table :radiotrackings do |t|
      t.integer :frequency
      t.string :nickname, :limit => 30
      t.datetime :date
      t.float :location_of_animal_E
      t.float :location_of_animal_N
      t.boolean :activity, :default => false
      t.text :remarks
      t.integer :released_animal_id
      t.integer :obser_id
      t.integer :biotope_id
      t.integer :distance_from_water_id
      t.integer :waterbody_type_id
      t.integer :water_level_id
      t.integer :precipitation_id
      t.integer :temperature_id
    end
  end

  def self.down
    drop_table :biotopes
    drop_table :distance_from_waters
    drop_table :obsers
    drop_table :precipitations
    drop_table :released_animals
    drop_table :temperatures
    drop_table :water_levels
    drop_table :waterbody_types
    drop_table :radiotrackings
  end
end
