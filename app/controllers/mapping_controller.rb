class MappingController < ApplicationController
  # params['id'] is the released animal id, not the radiotracking id.
  def show
    @rts = Radiotracking.find_by_released_animal_id(params['id'],
                                                    :order => [:date])
  end
end
