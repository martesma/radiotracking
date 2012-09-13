class Precipitation < ActiveRecord::Base
  has_many :radiotrackings
  attr_accessible :precipitation
end
