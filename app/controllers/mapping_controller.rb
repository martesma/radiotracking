class MappingController < ApplicationController
  # params['id'] is the released animal id, not the radiotracking id.
  def show
    @ra = begin
            ReleasedAnimal.find(params['id'])
          rescue
            nil
          end
    @rts = Radiotracking.find_all_by_released_animal_id(params['id'],
                                                        :order => [:date])
  end
end
