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

  def basic_path
    if params['id'] == "0"
      json = {}
    else
      @rts = Radiotracking.find_all_by_released_animal_id(params['id'],
                                                          :order => [:date])
      points = @rts.inject([]) do |m, rt|
        if rt.location_of_animal_N.zero? || rt.location_of_animal_E.zero?
          m
        else
          m += [ {
                   :id => rt.id,
                   :lat => rt.location_of_animal_N,
                   :lng => rt.location_of_animal_E,
                   :name => rt.date.strftime(STRFTIME)
                 } ]
        end
      end
      paths = points
      json = { :points => points, :paths => paths }
    end
    render :json => json
  end

  def enable_marker
    rt = Radiotracking.find(params['id']);
    render :partial => "rtdate", :locals => { :rt => rt }
  end

  def disable_marker
    rt = Radiotracking.find(params['id']);
    render :partial => "rtdatedisabled", :locals => { :rt => rt }
  end
end
