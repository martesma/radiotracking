class Biotope < ActiveRecord::Base
  has_many :radiotrackings
  attr_accessible :biotope
end
