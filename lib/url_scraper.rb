require "url_scraper/version"
require 'hashie'
require 'nokogiri'
require 'restclient'
require 'logger'
require 'thor'

module UrlScraper
  # Tell rails to load all assets
  class Engine < Rails::Engine
  
  end

  class CLI < Thor

  end
  
  # Handles the url request

  # Fetch Open Graph data from the specified URI. Makes an
  # HTTP GET request and returns an UrlScraper::Object if there
  # is data to be found or <tt>false</tt> if there isn't.
  #
  # Pass <tt>false</tt> for the second argument if you want to
  # see invalid (i.e. missing a required attribute) data.
  
  def self.fetch(uri, strict = true)  
    parse(RestClient.get(uri).body, strict)
    rescue RestClient::Exception, SocketError
      false
  end
  
  def self.parse(html, strict = true)
    logger = Logger.new(STDOUT)
    doc = Nokogiri::HTML.parse(html)
    page = UrlScraper::Object.new
    doc.css('meta').each do |m|
      if m.attribute('property') && m.attribute('property').to_s.match(/^og:(.+)$/i)
        page[$1.gsub('-','_')] = m.attribute('content').to_s
      end
    end

    page.title = (doc.at_css('title').text rescue nil) if page.title.nil? 
    if page.description.nil?
      page.description = doc.at_css("meta[name='description']")['content'] unless doc.at_css("meta[name='description']").nil?
    end
    if page.image.nil?
      image_array = doc.css("img").take(3).collect{|img| img['src']}
      page.image = image_array unless image_array.empty?
    end
    # return false if page.keys.empty?
    # return false unless page.valid? if strict
    page
    # return doc
  end
  
  TYPES = {
    'activity' => %w(activity sport),
    'business' => %w(bar company cafe hotel restaurant),
    'group' => %w(cause sports_league sports_team),
    'organization' => %w(band government non_profit school university),
    'person' => %w(actor athlete author director musician politician public_figure),
    'place' => %w(city country landmark state_province),
    'product' => %w(album book drink food game movie product song tv_show),
    'website' => %w(blog website)
  }
  
  # The UrlScraper::Object is a Hash with method accessors for
  # all detected Open Graph attributes.
  class Object < Hashie::Mash
    MANDATORY_ATTRIBUTES = %w(title type image url)
    
    # The object type.
    def type
      self['type']
    end
    
    # The schema under which this particular object lies. May be any of
    # the keys of the TYPES constant.
    def schema
      UrlScraper::TYPES.each_pair do |schema, types| 
        return schema if types.include?(self.type)
      end
      nil
    end
    
    UrlScraper::TYPES.values.flatten.each do |type|
      define_method "#{type}?" do
        self.type == type
      end
    end
    
    UrlScraper::TYPES.keys.each do |scheme|
      define_method "#{scheme}?" do
        self.type == scheme || UrlScraper::TYPES[scheme].include?(self.type)
      end
    end
    
    # If the Open Graph information for this object doesn't contain
    # the mandatory attributes, this will be <tt>false</tt>.
    def valid?
      MANDATORY_ATTRIBUTES.each{|a| return false unless self[a]}
      true
    end
  end
end