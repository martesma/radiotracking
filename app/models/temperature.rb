class Temperature < ActiveRecord::Base
  has_many :radiotrackings
  attr_accessible :temperature
end
