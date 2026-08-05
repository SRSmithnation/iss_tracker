require "net/http"
require "json"

class IssController < ApplicationController
  def index
    @iss_data = fetch_iss_data

    respond_to do |format|
      format.html
      format.json { render json: @iss_data }
    end
  end

  private

  def fetch_iss_data
    response = Net::HTTP.get(URI("https://api.wheretheiss.at/v1/satellites/25544"))
    JSON.parse(response)
  end
end
