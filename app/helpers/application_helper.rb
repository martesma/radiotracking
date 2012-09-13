# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  def format_date(s)
    Time.parse(s).strftime(STRFDATE)
  end
  def format_time(s)
    Time.parse(s).strftime(STRFTIME)
  end
  def options_for_nicknames(nn = nil)
    ReleasedAnimal.all(:order => "nickname").inject("<option value=\"\"></option>") do |mem, ra|
      mem += "<option value=\"#{ra.nickname}\" #{ra.nickname == nn ? 'selected=\"selected\"' : ''}>#{ra.nickname}</option>"
    end
  end
  def options_for_nicknames_to_ids(id = nil)
    ReleasedAnimal.all(:order => "nickname").inject("") do |mem, ra|
      mem += "<option value=\"#{ra.id}\" #{ra.id == id ? 'selected=\"selected\"' : ''}>#{ra.nickname.empty? ? '...' : ra.nickname}</option>"
    end
  end
  def options_for_animal_ids(id = nil)
    ReleasedAnimal.all(:order => "animal_id").inject("") do |mem, ra|
      mem += "<option value=\"#{ra.id}\" #{ra.id == id.to_i ? 'selected=\"selected\"' : ''}>#{ra.animal_id}</option>"
    end
  end
  def options_for_frequencies(freq = nil)
    ReleasedAnimal.all(:order => "frequency").inject("") do |mem, ra|
      mem += "<option value=\"#{ra.id}\" #{ra.id == id.to_i ? 'selected=\"selected\"' : ''}>#{ra.frequency}</option>"
    end
  end
  def options_for_observers(id = nil)
    Obser.all(:order => "id").inject("") do |mem, ra|
      mem += "<option value=\"#{ra.id}\" #{ra.id == id.to_i ? 'selected=\"selected\"' : ''}>#{ra.observer}</option>"
    end
  end
  def options_for_biotopes(id = nil)
    Biotope.all(:order => "id").inject("") do |mem, ra|
      mem += "<option value=\"#{ra.id}\" #{ra.id == id.to_i ? 'selected=\"selected\"' : ''}>#{ra.biotope}</option>"
    end
  end
  def options_for_distance_from_waters(id = nil)
    DistanceFromWater.all(:order => "id").inject("") do |mem, ra|
      mem += "<option value=\"#{ra.id}\" #{ra.id == id.to_i ? 'selected=\"selected\"' : ''}>#{ra.distance_from_water}</option>"
    end
  end
  def options_for_waterbody_types(id = nil)
    WaterbodyType.all(:order => "id").inject("") do |mem, ra|
      mem += "<option value=\"#{ra.id}\" #{ra.id == id.to_i ? 'selected=\"selected\"' : ''}>#{ra.waterbody_type}</option>"
    end
  end
  def options_for_water_levels(id = nil)
    WaterLevel.all(:order => "id").inject("") do |mem, ra|
      mem += "<option value=\"#{ra.id}\" #{ra.id == id.to_i ? 'selected=\"selected\"' : ''}>#{ra.water_level}</option>"
    end
  end
  def options_for_precipitations(id = nil)
    Precipitation.all(:order => "id").inject("") do |mem, ra|
      mem += "<option value=\"#{ra.id}\" #{ra.id == id.to_i ? 'selected=\"selected\"' : ''}>#{ra.precipitation}</option>"
    end
  end
  def options_for_temperatures(id = nil)
    Temperature.all(:order => "id").inject("") do |mem, ra|
      mem += "<option value=\"#{ra.id}\" #{ra.id == id.to_i ? 'selected=\"selected\"' : ''}>#{ra.temperature}</option>"
    end
  end
end
