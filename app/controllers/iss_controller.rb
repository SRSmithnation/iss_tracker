require "net/http"
require "json"

class IssController < ApplicationController
  def index
    response = Net::HTTP.get(URI("https://api.wheretheiss.at/v1/satellites/25544"))
    @iss_data = JSON.parse(response)
  end
end