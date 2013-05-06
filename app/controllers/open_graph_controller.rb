class OpenGraphController < ApplicationController
  def scrape
    object = UrlScraper.fetch(params[:url])
    render :json => object
  end
end