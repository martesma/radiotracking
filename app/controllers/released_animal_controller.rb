class ReleasedAnimalController < ApplicationController
  def index
    @ras = ReleasedAnimal.find(:all, :order => "nickname")
  end

  def new
  end

  def create
    params['release_location_E'] = params['release_location_E'].to_f
    params['release_location_N'] = params['release_location_N'].to_f
    params['birthdate'] = Time.now.strftime(MYSQLDATE) if params['birthdate'].empty?
    params['deathdate'] = Time.now.years_since(101).strftime(MYSQLDATE) if params['deathdate'].empty?
    params['release_date'] = Time.now.strftime(MYSQLDATE) if params['release_date'].empty?
    ra = ReleasedAnimal.new(params)
    if ra.save
      flash[:notice] = "#{params['nickname']} saved"
    else
      flash[:notice] = "There was a problem saving #{params['nickname']}<br />#{ra.errors.full_messages.inspect}"
    end
    redirect_to '/released_animal'
  end

  def ajakohastama
    logger.info "PUT released animal!"
    params.delete('action')
    params.delete('controller')
    logger.info params.inspect
    ra = ReleasedAnimal.find(params["id"])
    if ra
      if ra.update_attributes(params)
      flash[:notice] = "#{params['nickname']} updated"
    else
      flash[:notice] = "The update failed<br />#{ra.errors.full_messages.inspect}"
    end
    redirect_to '/released_animal'
  else
    redirect_to '/released_animal'
  end

  end

  def show
    @ra = ReleasedAnimal.find(params[:id])
    if @ra
      render 'edit'
    else
      render 'new'
    end
  end

  def destroy
    ra = ReleasedAnimal.find(params['id'])
    ra.destroy
  end
end
