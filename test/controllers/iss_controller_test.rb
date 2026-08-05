require "test_helper"

class IssControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get iss_index_url
    assert_response :success
  end
end
