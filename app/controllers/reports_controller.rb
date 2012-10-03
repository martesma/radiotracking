class ReportsController < ApplicationController
  def animals
    csv = 
      "Nickname,Id,Frequency,Microchip Number,Sex,Birthdate,Release Date,Death Date,Release Site,Release Lat,Release Lng,Cause of Death,Remarks\r\n" +
      ReleasedAnimal.all(:order => [:nickname]).map { |a| animal(a) }.join('\r\n')
    render :text => csv
  end

  private
  def animal(ra)
    "\"#{ra.nickname.capitalize}\"," +
      "\"#{ra.animal_id}\"," +
      "\"#{ra.frequency}\"," +
      "\"#{ra.microchip}\"," +
      "\"#{ra.sex}\"," +
      "\"#{ra.birthdate.strftime(STRFDATE)}\"," +
      "\"#{ra.release_date.strftime(STRFDATE)}\"," +
      "\"#{ra.deathdate.strftime(STRFDATE)}\"," +
      "\"#{ra.release_site}\"," +
      "\"#{ra.release_location_N}\"," +
      "\"#{ra.release_location_E}\"," +
      "\"#{ra.cause_of_death}\"," +
      "\"#{ra.remarks}\""
  end
end
