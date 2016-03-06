require 'test_helper'

class ItemsIndexTest < ActionDispatch::IntegrationTest
  def setup
    @admin = users(:michael)
    file = File.read("app/assets/items/items.json")
    @items = JSON.parse(file)
  end
  
  test "index" do
    log_in_as(@admin)
    get items_path
    assert_select 'p', "Gold: " + @admin.player.gold.to_s
    assert_template 'items/index'
    @items.each do |name, array|
      assert_select 'a[href=?]', item_path(name), text: name
      assert_select 'td', "Price: " + array["price"].to_s + " G"
    end
  end
end
