# frozen_string_literal: true

# Standard-library checks; run before and optionally after the Jekyll build.
require 'cgi'
require 'json'
require 'optparse'
require 'uri'
require 'yaml'

root = File.expand_path('..', __dir__)
options = {}
OptionParser.new do |parser|
  parser.banner = 'Usage: ruby scripts/check_structure.rb [--site _site]'
  parser.on('--site DIRECTORY', 'Also check a built Jekyll site') { |value| options[:site] = value }
end.parse!

errors = []
config = YAML.safe_load(File.read(File.join(root, '_config.yml')))
internal = %w[docs templates exercises scripts tests]
excluded = Array(config['exclude']).map { |path| path.sub(%r{/$}, '') }
(internal + %w[AGENTS.md README.md Gemfile Gemfile.lock]).each do |path|
  errors << "Missing site exclusion: #{path}" unless excluded.include?(path)
end
errors << 'url must contain the origin without the project path' unless config['url'] == 'https://itshaihong.github.io'
errors << 'baseurl must preserve /StudentGuide' unless config['baseurl'] == '/StudentGuide'

files = ['index.md'] + Dir.chdir(root) { Dir.glob('{guides,modules}/**/*.md') }
pages = files.map do |path|
  text = File.read(File.join(root, path))
  match = text.match(/\A---\r?\n(.*?)\r?\n---(?:\r?\n|\z)/m)
  unless match
    errors << "Missing front matter: #{path}"
    next
  end
  begin
    metadata = YAML.safe_load(match[1])
  rescue Psych::Exception => exception
    errors << "Invalid front matter in #{path}: #{exception.message}"
    next
  end
  unless metadata.is_a?(Hash)
    errors << "Front matter must be a mapping: #{path}"
    next
  end
  next if metadata['published'] == false

  %w[layout title nav_order permalink].each do |key|
    errors << "Missing #{key}: #{path}" unless metadata.key?(key)
  end
  route = metadata['permalink'].to_s
  unless route.start_with?('/') && route.end_with?('/') && !route.include?('..')
    errors << "Use an explicit directory permalink: #{path}"
  end
  { path: path, text: text, metadata: metadata, route: route }
end.compact

routes = pages.map { |page| page[:route] }
titles = pages.map { |page| page[:metadata]['title'] }
pages.each do |page|
  parent = page[:metadata]['parent']
  errors << "Unknown navigation parent #{parent}: #{page[:path]}" if parent && !titles.include?(parent)
  grand_parent = page[:metadata]['grand_parent']
  if grand_parent && !pages.any? { |candidate| candidate[:metadata]['title'] == parent && candidate[:metadata]['parent'] == grand_parent }
    errors << "Invalid navigation ancestry: #{page[:path]}"
  end
end
pages.group_by { |page| page[:route] }.each do |route, group|
  errors << "Duplicate route #{route}" if group.length > 1
end
pages.group_by { |page| [page[:metadata]['parent'], page[:metadata]['nav_order']] }.each_value do |group|
  errors << "Duplicate sibling navigation order: #{group.map { |page| page[:path] }.join(', ')}" if group.length > 1
end
pages.group_by { |page| [page[:metadata]['parent'], page[:metadata]['title']] }.each_value do |group|
  errors << "Duplicate sibling navigation title: #{group.map { |page| page[:path] }.join(', ')}" if group.length > 1
end

expected = %w[/ /folder/ /recomputer/ /satcat/ /guides/ /modules/ /modules/git/ /modules/zynq-7000/]
(expected - routes).each { |route| errors << "Missing required route: #{route}" }

pages.each do |page|
  # Resolve Liquid links first, then ordinary Markdown links, including images.
  text = page[:text].gsub(/\{\{\s*['"]([^'"]+)['"]\s*\|\s*relative_url\s*\}\}/, '\1')
  text.scan(/\]\(([^)]+)\)/).flatten.each do |link|
    next if link.start_with?('#') || link.match?(%r{\A(?:[a-z][a-z0-9+.-]*:|//)}i)
    begin
      target = URI::DEFAULT_PARSER.unescape(URI.join("https://site.invalid#{page[:route]}", link).path)
      disk_path = File.join(root, target.sub(%r{\A/}, ''))
      unless routes.include?(target) || File.file?(disk_path)
        errors << "Broken public link #{link}: #{page[:path]}"
      end
      if internal.any? { |directory| target.start_with?("/#{directory}/") }
        errors << "Public page links to excluded authoring material: #{page[:path]} -> #{link}"
      end
    rescue URI::InvalidURIError
      errors << "Invalid or unsupported public link #{link}: #{page[:path]}"
    end
  end
end

scenario_paths = Dir.glob(File.join(root, 'exercises', '**', '*.json'))
scenario_ids = []
scenario_paths.each do |path|
  begin
    scenario = JSON.parse(File.read(path))
    required = %w[id module_id status task model_limits initial_state steps reset evidence open_questions]
    required.each { |key| errors << "Missing scenario field #{key}: #{path}" unless scenario.key?(key) }
    errors << "Unknown scenario module: #{path}" unless pages.any? { |page| page[:metadata]['module_id'] == scenario['module_id'] }
    errors << "Scenario directory does not match module: #{path}" unless File.basename(File.dirname(path)) == scenario['module_id']
    errors << "Unsupported scenario status: #{path}" unless scenario['status'] == 'design'
    scenario_ids << scenario['id']
    %w[model_limits steps evidence].each do |key|
      errors << "Scenario #{key} must be a nonempty array: #{path}" unless scenario[key].is_a?(Array) && !scenario[key].empty?
    end
    errors << "Scenario needs a nonempty initial_state: #{path}" unless scenario['initial_state'].is_a?(Hash) && !scenario['initial_state'].empty?
    steps = Array(scenario['steps'])
    steps.each do |step|
      %w[id prediction action expected_change feedback].each do |key|
        errors << "Scenario step missing #{key}: #{path}" unless step.is_a?(Hash) && step[key].is_a?(String) && !step[key].strip.empty?
      end
    end
    step_ids = steps.select { |step| step.is_a?(Hash) }.map { |step| step['id'] }
    errors << "Duplicate scenario step ID: #{path}" unless step_ids.uniq.length == step_ids.length
  rescue JSON::ParserError => exception
    errors << "Invalid scenario JSON #{path}: #{exception.message}"
  end
end
errors << 'Duplicate scenario ID' unless scenario_ids.uniq.length == scenario_ids.length

if options[:site]
  site = File.expand_path(options[:site], root)
  unless File.directory?(site)
    errors << "Built site directory does not exist: #{site}"
  else
    routes.each do |route|
      target = File.join(site, route.sub(%r{\A/}, ''), 'index.html')
      errors << "Missing built page: #{route}" unless File.file?(target)
    end
    (internal + %w[AGENTS.md README.md Gemfile Gemfile.lock]).each do |path|
      errors << "Internal material leaked into build: #{path}" if File.exist?(File.join(site, path))
    end
    Dir.glob(File.join(site, '**', '*.html')).each do |path|
      relative = path.delete_prefix(site)
      base = "#{config['url']}#{config['baseurl']}#{relative}"
      File.read(path).scan(/(?:href|src)=["']([^"']+)["']/).flatten.each do |raw_link|
        link = CGI.unescapeHTML(raw_link)
        next if link.start_with?('#') || link.match?(/\A(?:mailto|tel|data|javascript):/i)
        begin
          uri = URI.join(base, link)
          next unless uri.host == URI(config['url']).host

          output_path = URI::DEFAULT_PARSER.unescape(uri.path)
          prefix = config['baseurl']
          unless output_path == prefix || output_path.start_with?("#{prefix}/")
            errors << "Built link escapes site prefix: #{relative} -> #{link}"
            next
          end
          output_path = output_path.delete_prefix(prefix).sub(%r{\A/}, '')
          target = File.join(site, output_path)
          unless File.file?(target) || File.file?(File.join(target, 'index.html'))
            errors << "Broken built link: #{relative} -> #{link}"
          end
        rescue URI::InvalidURIError
          errors << "Invalid built link: #{relative} -> #{link}"
        end
      end
    end
  end
end

unless errors.empty?
  warn errors.map { |message| "ERROR: #{message}" }.join("\n")
  exit 1
end
puts "Checked #{pages.length} public pages, #{scenario_paths.length} scenario specifications, navigation, links, and exclusions."
puts 'Built-site routes, local links, and exclusions also passed.' if options[:site]
