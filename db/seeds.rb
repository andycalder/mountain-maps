puts 'Seeding...'

dataset_id = 'cj51y5ioi09wh32p1s9frlt9l'
access_token = ENV['MAPBOX_ACCESS_TOKEN']
dataset_url = "https://api.mapbox.com/datasets/v1/andycalder/#{dataset_id}/features?access_token=#{access_token}"

dataset = URI.open(dataset_url).read
trails = JSON.parse(dataset)['features']

whistler = Mountain.create!(name: 'Whistler')
admin_user = User.create!(email: 'admin@gmail.com', password: 'secret', nickname: 'admin')

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
  coords = trail['geometry']['coordinates']

  unless props['type'] == 'chairlift' || trail['geometry']['type'] == 'Point'
    record = Trail.new(
      mountain: whistler,
      name: props['name'],
      difficulty: difficulty(props['difficulty']) || 'beginner',
      category: props['type'] ? 'freeride' : 'technical',
      latitude: coords[0][1],
      longitude: coords[0][0]
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
