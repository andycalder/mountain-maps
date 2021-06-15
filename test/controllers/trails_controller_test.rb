require 'test_helper'

class TrailsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get trails_index_url
    assert_response :success
  end

end
