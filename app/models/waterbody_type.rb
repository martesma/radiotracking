class WaterbodyType < ActiveRecord::Base
  has_many :radiotrackings
  attr_accessible :waterbody_type
end
