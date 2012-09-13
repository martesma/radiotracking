class ReleasedAnimal < ActiveRecord::Base
  has_many :radiotrackings
  attr_accessible :frequency, :nickname, :sex, :birthdate, :release_date, :microchip, :enclosure_type, :release_location_N, :release_location_E, :release_site, :remarks
end
