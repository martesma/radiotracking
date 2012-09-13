class DistanceFromWater < ActiveRecord::Base
  has_many :radiotrackings
  attr_accessible :distance_from_water
end
