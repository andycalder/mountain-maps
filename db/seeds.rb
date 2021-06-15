puts 'Seeding...'

dataset_id = 'cj51y5ioi09wh32p1s9frlt9l'
access_token = ENV['MAPBOX_ACCESS_TOKEN']
dataset_url = "https://api.mapbox.com/datasets/v1/andycalder/#{dataset_id}/features?access_token=#{access_token}"

dataset = URI.open(dataset_url).read
trails = JSON.parse(dataset)['features']

whistler = Mountain.create!(name: 'Whistler')

def difficulty(color)
  case color
  when 'green' then 'beginner'
  when 'blue' then 'intermediate'
  when 'black' then 'advanced'
  when 'doubleblack' then 'expert'
  when 'red' then 'proline'
  end
end

trails.each do |trail|
  props = trail['properties']

  unless props['type'] == 'chairlift'
    record = Trail.new(
      name: props['name'],
      difficulty: difficulty(props['difficulty']) || 'beginner',
      category: props['type'] ? 'freeride' : 'technical',
      mountain: whistler
    )

    if record.valid?
      record.save
    else
      puts 'Unable to save record'
      p record
    end
  end
end

puts 'Finished seeding.'
puts "User count: #{User.count}"
puts "Trail count: #{Trail.count}"
puts "Review count: #{Review.count}"
puts "Mountain count: #{Mountain.count}"
