require 'test_helper'

class PlacesControllerTest < ActionController::TestCase
=begin  
  def setup
    @place = places(:one)
  end
  test "should redirect index when not logged in" do
    get :index
    assert_not flash.empty?
    assert_redirected_to login_url
  end
  
  test "should redirect new when not logged in" do
    get :new
    assert_not flash.empty?
    assert_redirected_to login_url
  end

  test "should redirect show when not logged in" do
    get :show, id: @place
    assert_not flash.empty?
    assert_redirected_to login_url
  end

  test "should redirect edit when not logged in" do
    get :edit, id: @place
    assert_not flash.empty?
    assert_redirected_to login_url
  end
  
  test "should redirect destroy when not logged in" do
    assert_no_difference 'Place.count' do
      delete :destroy, id: @place
    end
    assert_redirected_to login_url
  end
=end
end
