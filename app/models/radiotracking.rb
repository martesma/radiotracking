class Radiotracking < ActiveRecord::Base
  belongs_to :released_animal
  belongs_to :obser
  belongs_to :biotope
  belongs_to :distance_from_water
  belongs_to :waterbody_type
  belongs_to :water_level
  belongs_to :precipitation
  belongs_to :temperature

  attr_accessible :frequency, :nickname, :date, :location_of_animal_E, :location_of_animal_N, :activity, :remarks, :released_animal_id, :obser_id, :biotope_id, :distance_from_water_id, :waterbody_type_id, :water_level_id, :precipitation_id, :temperature_id
end
