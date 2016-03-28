class Place < ActiveRecord::Base
    belongs_to :user
    validates_associated :user
    
    #validates :address, presence: true
    #validates :title, presence: true
    validates :user_id, presence: true
    validates_numericality_of :latitude, :greater_than_or_equal_to => 48, :less_than_or_equal_to => 50
    validates_numericality_of :longitude, :greater_than => -124, :less_than_or_equal_to => -122
    #geocoded_by :address
    #after_validation :geocode
    
    reverse_geocoded_by :latitude, :longitude
    after_validation :reverse_geocode  # auto-fetch address
    
end
