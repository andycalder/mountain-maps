require 'test_helper'

class MountainsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get mountains_index_url
    assert_response :success
  end

end
