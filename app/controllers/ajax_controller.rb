class AjaxController < ApplicationController
  def ra
    ra = if request.post?
	   ReleasedAnimal.find_by_nickname(params['nickname'])
	 else
	   ReleasedAnimal.find(params[:id])
	 end
    render :json => if ra
		      ra.attributes
		    else
		      nil
		    end
  end

  def rt
    @rts = Radiotracking.find(:all, :conditions => ["released_animal_id = ?", params['id']], :order => "date")
    render :partial => 'track/buliimia'
  end

  def ra_id
    ra_id = Radiotracking.find(params['id']).released_animal.id
    render :json => ra_id.to_json
  end
end
