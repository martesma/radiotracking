class TriangulateController < ApplicationController
  skip_before_filter :authorize

  def new
  end

  def create
    @params = params
    render :index
  end

  def map
    # Triangulation (not finished)
    # If normal, decimal lat/lngs are there, then dms's are ignored.
    a2 = params['lng1'].to_f # The longitude
    if a2.zero?
      a2 = from_dms(params['lng1D'], params['lng1M'], params['lng1S'])
    end

    a1 = params['lat1'].to_f # The latitude
    if a1.zero?
      a1 = from_dms(params['lat1D'], params['lat1M'], params['lat1S'])
    end

    b2 = params['lng2'].to_f
    if b2.zero?
      b2 = from_dms(params['lng2D'], params['lng2M'], params['lng2S'])
    end

    b1 = params['lat2'].to_f
    if b1.zero?
      b1 = from_dms(params['lat2D'], params['lat2M'], params['lat2S'])
    end

    dir1rad = params['dir1'].to_f * Math::PI / 180
    dir2rad = params['dir2'].to_f * Math::PI / 180
    dist_AB = Math.sqrt((a1 - b1) ** 2 + (a2 - b2) ** 2)

    # polylines from points A & B
    ang_a = (90 - params['dir1'].to_f) * Math::PI / 180
    ang_b = (90 - params['dir2'].to_f) * Math::PI / 180
    arbitrary_distance = 1
    a1_prime = a1 + arbitrary_distance * Math.sin(ang_a)
    a2_prime = a2 + arbitrary_distance * Math.cos(ang_a)
    b1_prime = b1 + arbitrary_distance * Math.sin(ang_b)
    b2_prime = b2 + arbitrary_distance * Math.cos(ang_b)
    json = {
      :points => [ { :lat => a1,
                     :lng => a2,
                     :name => 'A' },
                   { :lat => b1,
                     :lng => b2,
                     :name => 'B' } ],
      :paths => [[{:lat => a1, :lng => a2},
                  {:lat => a1_prime, :lng => a2_prime}],
                 [{:lat => b1, :lng => b2},
                  {:lat => b1_prime, :lng => b2_prime}]]
    }
    render :json => json
  end

  private
  def from_dms(d, m, s)
    d.to_f + m.to_f / 60 + s.to_f / 3600
  end
end
