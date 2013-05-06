class OpenGraphController < ApplicationController
  def scrape
    object = OpenGraph.fetch(params[:url])
    render :json => object
  end
end