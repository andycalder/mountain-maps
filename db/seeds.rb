puts 'Seeding...'

users = {
  'andrew': 'https://res.cloudinary.com/daysaku3r/image/upload/v1624495193/avatars/andrew_lcwitq.png',
  'paal': 'https://res.cloudinary.com/daysaku3r/image/upload/v1624495196/avatars/paal_gavt7r.png',
  'sy': 'https://res.cloudinary.com/daysaku3r/image/upload/v1624495196/avatars/sy_gjnjn7.png',
  'shank': 'https://res.cloudinary.com/daysaku3r/image/upload/v1624495196/avatars/shank_qbmch8.png',
  'marty': 'https://res.cloudinary.com/daysaku3r/image/upload/v1624495195/avatars/marty_nrtgmk.png',
  'matt': 'https://res.cloudinary.com/daysaku3r/image/upload/v1624495195/avatars/matt_dcapcf.png',
  'sheila': 'https://res.cloudinary.com/daysaku3r/image/upload/v1624495195/avatars/sheila_cxz4wt.png',
  'hong': 'https://res.cloudinary.com/daysaku3r/image/upload/v1624495195/avatars/hong_ghqsoo.png',
  'cam': 'https://res.cloudinary.com/daysaku3r/image/upload/v1624495195/avatars/cam_org2rk.png',
  'hillel': 'https://res.cloudinary.com/daysaku3r/image/upload/v1624495194/avatars/hillel_w3l3l0.png',
  'george': 'https://res.cloudinary.com/daysaku3r/image/upload/v1624495195/avatars/george_fs87by.png',
  'julain': 'https://res.cloudinary.com/daysaku3r/image/upload/v1624495194/avatars/julian_hyjn5i.png',
  'cass': 'https://res.cloudinary.com/daysaku3r/image/upload/v1624495194/avatars/cass_ctqyrg.png',
  'manon': 'https://res.cloudinary.com/daysaku3r/image/upload/v1624495194/avatars/manon_jrckrv.png',
  'jorge': 'https://res.cloudinary.com/daysaku3r/image/upload/v1624495194/avatars/jorge_kutokl.png',
  'julia': 'https://res.cloudinary.com/daysaku3r/image/upload/v1624495193/avatars/julia_c5vz5m.jpg',
  'bobby': 'https://res.cloudinary.com/daysaku3r/image/upload/v1624500280/avatars/bobby_nzvsur.jpg',
  'hardcorebikrrr': 'https://res.cloudinary.com/daysaku3r/image/upload/v1624500496/avatars/hardcorebikrrr_gw6fod.jpg'
}

users.each do |nickname, photo_url|
  file = URI.open(photo_url)
  user = User.new(email: "#{nickname}@gmail.com", password: 'secret', nickname: nickname)
  user.photo.attach(io: file, filename: "#{nickname}@png", content_type: 'image/png')

  if user.valid?
    user.save
  else
    p 'Unable to save user'
  end
end

whistler = Mountain.create!(name: 'Whistler')

dataset_id = 'cj51y5ioi09wh32p1s9frlt9l'
access_token = ENV['MAPBOX_ACCESS_TOKEN']
dataset_url = "https://api.mapbox.com/datasets/v1/andycalder/#{dataset_id}/features?access_token=#{access_token}"

dataset = URI.open(dataset_url).read
trails = JSON.parse(dataset)['features']

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
      start_lat: coords.first[1],
      start_lng: coords.first[0],
      end_lat: coords.last[1],
      end_lng: coords.last[0]
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
