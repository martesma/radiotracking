class WaterLevel < ActiveRecord::Base
  has_many :radiotrackings
  attr_accessible :water_level
end
