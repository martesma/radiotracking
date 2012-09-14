class AddDeathdateAndCauseOfDeathToReleasedAnimals < ActiveRecord::Migration
  def self.up
    add_column :released_animals, :deathdate, :timestamp
    add_column :released_animals, :cause_of_death, :text
  end

  def self.down
    remove_column :released_animals, :deathdate
    remove_column :released_animals, :cause_of_death
  end
end
