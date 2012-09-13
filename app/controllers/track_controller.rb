class TrackController < ApplicationController
  def index
    render 'index'
  end

  def new
  end

  def create
    logger.info "POST radiotracking data!"
    params['activity'] = params['activity'] ? true : false
    params['location_of_animal_E'] = params['location_of_animal_E'].to_f
    params['location_of_animal_N'] = params['location_of_animal_N'].to_f
    time = params.delete('time')
    params['date'] += " #{time}"
    if params['date'].strip.empty?
      params['date'] = Time.now.strftime(MYSQLDATETIME)
    end
    logger.info params.inspect
    rt = Radiotracking.new(params)
    if rt.save
      flash[:notice] = "#{params['nickname']} radiotracking by #{Obser.find(params['obser_id']).observer} saved"
      redirect_to "/track/animal/#{rt.released_animal.id}"
    else
      flash[:notice] = "There was a problem saving radiotracking data: #{params['nickname']} by #{Obser.find(params['obser_id']).observer}<br />#{rt.errors.full_messages.inspect}"
      redirect_to '/track/new'
    end
  end

  def ajakohastama
    logger.info "PUT radiotracking!"
    params['activity'] = params['activity'] ? true : false
    params['location_of_animal_E'] = params['location_of_animal_E'].to_f
    params['location_of_animal_N'] = params['location_of_animal_N'].to_f
    time = params.delete('time')
    params['date'] += " #{time}"
    params.delete('action')
    params.delete('controller')
    logger.info params.inspect
    rt = Radiotracking.find(params["id"])
    if rt
      if rt.update_attributes(params)
	flash[:notice] = "#{params['nickname']} radiotracking by #{Obser.find(params['obser_id']).observer} updated"
	redirect_to "/track/animal/#{rt.released_animal.id}"
      else
	flash[:notice] = "The update failed<br />#{rt.errors.full_messages.inspect}"
	redirect_to '/track'
      end
    else
      redirect_to '/track/new'
    end
  end

  def show
    @rt = Radiotracking.find(params['id'])
    if @rt
      render 'edit'
    else
      render 'new'
    end
  end

  def animal
    @ra_id = params['id'].to_i
    render 'index'
  end

  def destroy
    rt = Radiotracking.find(params['id'])
    rt.destroy
  end
end
