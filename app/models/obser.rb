class Obser < ActiveRecord::Base
  has_many :radiotrackings
  attr_accessible :observer
end
