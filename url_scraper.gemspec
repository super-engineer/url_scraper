# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'url_scraper/version'

Gem::Specification.new do |spec|
  spec.name          = "url_scraper"
  spec.version       = UrlScraper::VERSION
  spec.authors       = ["Super Engineer"]
  spec.email         = ["akshayshinde7@gmail.com"]
  spec.description   = %q{A simple plugin for extracting information from url entered by user (Something
  like what facebook does). This gem is built on top of opengraph gem created by michael
  bleigh.}
  spec.summary       = %q{A simple plugin for extracting information from url entered by user (Something
  like what facebook does). This gem is built on top of opengraph gem created by michael
  bleigh.}
  spec.homepage      = "http://github.com/super-engineer/url_scraper"
  spec.license       = "MIT"

  spec.files         = `git ls-files`.split($/)
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler", "~> 1.3"
  spec.add_development_dependency "rake"

  spec.add_dependency 'hashie'
  spec.add_dependency 'nokogiri', '~> 1.5.9'
  spec.add_dependency 'rest-client', '~> 1.6.7'
  spec.add_dependency 'thor'
end
